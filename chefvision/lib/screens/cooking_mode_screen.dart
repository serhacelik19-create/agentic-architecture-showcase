import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:permission_handler/permission_handler.dart';
import '../models/recipe.dart';
import '../services/cloud_tts_service.dart';
import '../services/voice_service.dart';
import '../models/chat_message.dart';
import 'package:provider/provider.dart';
import '../providers/recipe_provider.dart';
import 'cooking_completion_screen.dart';
import '../services/notification_service.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../providers/timer_provider.dart';

class CookingModeScreen extends StatefulWidget {
  final Recipe recipe;

  const CookingModeScreen({
    super.key,
    required this.recipe,
  });

  @override
  State<CookingModeScreen> createState() => _CookingModeScreenState();
}

class _CookingModeScreenState extends State<CookingModeScreen>
    with TickerProviderStateMixin {
  late PageController _pageController;
  late CloudTtsService _cloudTts;
  late stt.SpeechToText _speech;

  int _currentStep = 0;
  int _speakingStepIndex = -1; // Track which step is being spoken
  bool _isAutoReadEnabled = false; // Disabled by default per user request
  final Set<int> _completedSteps = {};
  bool _isListening = false;
  bool _isSpeechAvailable = false;
  List<String> _steps = [];

  // Timer is now managed via TimerProvider
  // late TimerProvider _timerProvider;

  // Design Palette - Matching App Theme (Purple/Blue/White)
  static const Color appPrimary = Color(0xFF6C63FF); // Example Primary Purple
  static const Color appBackground = Color(0xFFF5F6FA); // Light Grey
  static const Color cardColor = Colors.white;
  static const Color textColor = Color(0xFF2D2D2D);
  late TextEditingController _chatController;

  @override
  void initState() {
    super.initState();
    // Resume from saved step if recipe matches
    final provider = Provider.of<RecipeProvider>(context, listen: false);
    // Ensure current recipe is set so per-recipe chat works correctly
    if (provider.currentRecipe?.title == widget.recipe.title) {
      _currentStep = provider.cookingStepIndex;
    }

    _pageController = PageController(
      initialPage: _currentStep,
      viewportFraction: 0.9,
    );
    _chatController = TextEditingController();
    _steps = widget.recipe.instructions;

    // Fallback if empty - but we will handle this in UI now
    // if (_steps.isEmpty) {
    //   _steps = ["Tarif adımları yüklenemedi."];
    // }

    _initTts();
    // Voice commands disabled for now - don't request microphone permission
    // _initSpeech();
    _enableWakelock();

    // Initialize Notification Service
    NotificationService().init();
    NotificationService().requestPermissions();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_isAutoReadEnabled) {
        // User requested: Disable auto-play initially
        // _speakStep(0);
      }
    });

    _pageController.addListener(() {
      if (mounted) setState(() {});
    });
  }

  Future<void> _enableWakelock() async {
    try {
      await WakelockPlus.enable();
    } catch (e) {
      debugPrint("Wakelock error: $e");
    }
  }

  String _selectedLocaleId = 'tr_TR';

  Future<void> _initSpeech() async {
    _speech = stt.SpeechToText();
    try {
      var status = await Permission.microphone.request();
      if (status != PermissionStatus.granted) {
        debugPrint("Microphone permission denied");
        return;
      }

      _isSpeechAvailable = await _speech.initialize(
        onStatus: (status) {
          debugPrint('Speech status: $status');
          if (status == 'done' || status == 'notListening') {
            // Logic to handle stop
            if (_isListening && _lastWords.isNotEmpty && !_isProcessing) {
              // Wait a bit to ensure we don't have more coming?
              // Actually the silence timer handles the stop now.
              // But if status is done, we should update UI.
              // _silenceTimer handles the logic mostly.
              if (mounted) setState(() => _isListening = false);
            } else {
              if (mounted) setState(() => _isListening = false);
            }
          }
        },
        onError: (error) {
          debugPrint('Speech error: $error');
          if (mounted) setState(() => _isListening = false);
        },
      );

      if (_isSpeechAvailable) {
        // Find Turkish Locale
        var locales = await _speech.locales();
        var selectedLocale = locales.firstWhere(
          (locale) => locale.localeId == "tr_TR",
          orElse: () => locales.first,
        );
        _selectedLocaleId = selectedLocale.localeId;
        debugPrint("Selected Locale: $_selectedLocaleId");
      }

      if (mounted) setState(() {});
    } catch (e) {
      debugPrint("Speech init error: $e");
    }
  }

  void _initTts() {
    _cloudTts = CloudTtsService();
    _cloudTts.onStart = () {
      if (mounted) setState(() {});
    };
    _cloudTts.onPause = () {
      if (mounted) setState(() {});
    };
    _cloudTts.onComplete = () async {
      if (mounted) {
        setState(() {
          _speakingStepIndex = -1;
        });
      }
    };
    _cloudTts.onError = () {
      if (mounted) {
        setState(() {
          _speakingStepIndex = -1;
        });
      }
    };
  }

  bool _isProcessing = false;
  String _lastWords = '';

  Timer? _silenceTimer;

  void _startSilenceTimer() {
    _silenceTimer?.cancel();
    _silenceTimer = Timer(const Duration(seconds: 2), () {
      if (_isListening && _lastWords.isNotEmpty) {
        debugPrint("Silence detected, stopping...");
        _speech.stop();
        _handleVoiceCommand(_lastWords);
      }
    });
  }

  Future<void> _listenForCommands() async {
    if (!_isSpeechAvailable || _isListening || _isProcessing) return;

    setState(() {
      _isListening = true;
      _lastWords = '';
    });

    // Start manual silence detection
    _startSilenceTimer();

    await _speech.listen(
      onResult: (result) {
        setState(() {
          _lastWords = result.recognizedWords;
        });

        // Reset silence timer on every result
        _startSilenceTimer();

        if (result.finalResult) {
          _silenceTimer?.cancel();
          _handleVoiceCommand(_lastWords);
        }
      },
      localeId: 'tr_TR', // Hardcoded to ensure Turkish
      listenFor: const Duration(seconds: 60),
      pauseFor: const Duration(seconds: 3),
      listenOptions: stt.SpeechListenOptions(
        partialResults: true,
        cancelOnError: true,
        listenMode: stt
            .ListenMode.dictation, // Dictation is often better for non-English
        onDevice: false, // Prefer cloud for better language support
      ),
    );
  }

  void _handleVoiceCommand(String command) async {
    if (command.isEmpty) return;

    debugPrint("Voice Command: $command");

    // Stop listening immediately
    await _speech.stop();
    setState(() => _isListening = false);

    final lowerCommand = command.toLowerCase();

    if (lowerCommand.contains('ileri') ||
        lowerCommand.contains('sonraki') ||
        lowerCommand.contains('devam')) {
      _nextPage();
    } else if (lowerCommand.contains('geri') ||
        lowerCommand.contains('önceki')) {
      _prevPage();
    } else if (lowerCommand.contains('tekrar') ||
        lowerCommand.contains('oku')) {
      _speakStep(_currentStep);
    } else if (lowerCommand.contains('başlat') ||
        lowerCommand.contains('zamanlayıcı')) {
      final duration = _extractDuration(_steps[_currentStep]);
      if (duration != null) {
        _startTimer(duration);
      }
    } else {
      // Chat with AI about the recipe (Context Aware)
      final provider = Provider.of<RecipeProvider>(context, listen: false);
      setState(() {
        provider.addCookingMessage(ChatMessage(
          text: command,
          isUser: true,
          timestamp: DateTime.now(),
        ));
      });

      // We want to speak the response for voice commands
      // So we can't fully use _processAIResponse as is if we want to selectively speak.
      // Let's accept duplication or refactor _processAIResponse to accept "speak" param.

      _processVoiceAndSpeak(command);
    }
  }

  // Modified to NOT speak automatically on Chat response
  Future<void> _processVoiceAndSpeak(String text) async {
    setState(() => _isProcessing = true);

    try {
      final contextData = {
        'title': widget.recipe.title,
        'ingredients': widget.recipe.ingredients.map((i) => i.name).toList(),
        'current_step': '${_currentStep + 1}. adım: ${_steps[_currentStep]}',
      };

      final response = await voiceService.chat(text,
          includePantry: false, recipeContext: contextData);

      if (!mounted) return;
      final provider = Provider.of<RecipeProvider>(context, listen: false);
      setState(() {
        _isProcessing = false;
        provider.addCookingMessage(ChatMessage(
          text: response.response,
          isUser: false,
          timestamp: DateTime.now(),
        ));
      });

      // User requested to disable auto-speak for chat responses
      // await _cloudTts.speak(response.response);
    } catch (e) {
      debugPrint("Chat error: $e");
      setState(() {
        _isProcessing = false;
        Provider.of<RecipeProvider>(context, listen: false)
            .addCookingMessage(ChatMessage(
          text: AppLocalizations.of(context)!.errorOccurred,
          isUser: false,
          timestamp: DateTime.now(),
        ));
      });
      // await _cloudTts.speak("Bir hata oluştu.");
    }
  }

  Future<void> _speakStep(int index) async {
    if (index < 0 || index >= _steps.length) return;

    // Stop listening before speaking
    if (_isListening) {
      await _speech.stop();
      setState(() => _isListening = false);
    }

    // Toggle logic for current step
    if (_speakingStepIndex == index) {
      if (_cloudTts.isPlaying) {
        await _cloudTts.pause();
        setState(() {});
        return;
      }
      if (_cloudTts.isPaused) {
        // Resume from where we left off
        await _cloudTts.resume();
        setState(() {});
        return;
      }
    }

    setState(() {
      _speakingStepIndex = index;
    });

    String text = _steps[index].replaceAll(RegExp(r'^\d+[\.\)]\s*'), '').trim();
    await _cloudTts.speak(text);
  }

  void _nextPage() {
    setState(() {
      _completedSteps.add(_currentStep);
    });
    if (_currentStep < _steps.length - 1) {
      _pageController.nextPage(
        duration: 800.ms,
        curve: Curves.easeInOutQuart,
      );
    } else {
      _onCookingFinished();
    }
  }

  void _prevPage() {
    if (_currentStep > 0) {
      _pageController.previousPage(
        duration: 800.ms,
        curve: Curves.easeInOutQuart,
      );
    }
  }

  @override
  void dispose() {
    // Disposal handled by TimerProvider
    _pageController.dispose();
    _chatController.dispose();
    _cloudTts.dispose();
    _speech.stop();
    _silenceTimer?.cancel();
    NotificationService().cancelAll(); // Cancel all notifications on dispose
    super.dispose();
  }

  Duration? _extractDuration(String text) {
    // Regex for "X dakika", "X saat", "X dk"
    // Supports Turkish numbers to some extent if needed, but digits are easier
    // Supports TR, EN, DE, IT, FR, ES and common abbreviations
    final minuteRegex = RegExp(
        r'(\d+)\s*(?:dakika|dk|min|minute|minutes|minuti|minutos|minuten)',
        caseSensitive: false);
    final hourRegex = RegExp(
        r'(\d+)\s*(?:saat|sa|hour|hours|hr|hrs|stunde|stunden|std|ora|ore|heure|heures|hora|horas|h)',
        caseSensitive: false);

    int minutes = 0;

    final minuteMatch = minuteRegex.firstMatch(text);
    if (minuteMatch != null) {
      minutes += int.tryParse(minuteMatch.group(1) ?? '0') ?? 0;
    }

    final hourMatch = hourRegex.firstMatch(text);
    if (hourMatch != null) {
      minutes += (int.tryParse(hourMatch.group(1) ?? '0') ?? 0) * 60;
    }

    if (minutes > 0) {
      return Duration(minutes: minutes);
    }
    return null;
  }

  Widget _buildFloatingTimer() {
    return GestureDetector(
      onTap: () {
        // Tapping pauses or cancels? Let's just cancel for now or show options
        _showTimerOptions();
      },
      child: Consumer<TimerProvider>(
        builder: (context, timer, child) {
          if (!timer.isRunning) return const SizedBox.shrink();
          return Container(
            decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(30),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  )
                ]),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.timer, color: appPrimary, size: 20),
                const SizedBox(width: 8),
                Text(
                  timer.formattedTime,
                  style: GoogleFonts.outfit(
                    color: appPrimary,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ).animate().scale(duration: 300.ms, curve: Curves.easeOutBack);
        },
      ),
    );
  }

  void _showTimerOptions() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: cardColor,
        title: Text(AppLocalizations.of(context)!.timerLabel,
            style: GoogleFonts.outfit(color: textColor)),
        content: Text(AppLocalizations.of(context)!.stopTimerQuestion,
            style: GoogleFonts.outfit(color: textColor.withOpacity(0.7))),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(AppLocalizations.of(context)!.noLabel,
                style: GoogleFonts.outfit(color: Colors.grey)),
          ),
          TextButton(
            onPressed: () {
              _stopTimer();
              Navigator.pop(context);
            },
            child: Text(AppLocalizations.of(context)!.yesStop,
                style: GoogleFonts.outfit(color: appPrimary)),
          ),
        ],
      ),
    );
  }

  Widget _buildIngredientsSheet() {
    return DraggableScrollableSheet(
      initialChildSize: 0.1,
      minChildSize: 0.1,
      maxChildSize: 0.6,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 20,
                offset: Offset(0, -5),
              ),
            ],
          ),
          child: SingleChildScrollView(
            controller: scrollController,
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      const Icon(Icons.restaurant_menu,
                          color: appPrimary, size: 20),
                      const SizedBox(width: 10),
                      Text(
                        AppLocalizations.of(context)!.ingredients,
                        style: GoogleFonts.outfit(
                          color: textColor,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ...widget.recipe.ingredients.map((ingredient) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Row(
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: const BoxDecoration(
                              color: appPrimary,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              ingredient.name,
                              style: GoogleFonts.outfit(
                                color: textColor.withOpacity(0.8),
                                fontSize: 16,
                              ),
                            ),
                          ),
                          if (ingredient.quantity.isNotEmpty)
                            Text(
                              ingredient.quantity,
                              style: GoogleFonts.outfit(
                                color: textColor.withOpacity(0.5),
                                fontSize: 14,
                              ),
                            ),
                        ],
                      ),
                    );
                  }),
                  const SizedBox(height: 40), // Bottom padding for scroll
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  void _startTimer(Duration duration) {
    if (duration.inSeconds <= 0) return;

    final timerProvider = Provider.of<TimerProvider>(context, listen: false);
    timerProvider.startTimer(
      duration.inSeconds,
      widget.recipe.title,
      context,
    );
  }

  void _stopTimer() {
    final timerProvider = Provider.of<TimerProvider>(context, listen: false);
    timerProvider.stopTimer();
  }

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: ThemeData.light().copyWith(
        scaffoldBackgroundColor: appBackground,
        textTheme: GoogleFonts.outfitTextTheme(),
        primaryColor: appPrimary,
      ),
      child: Scaffold(
        backgroundColor: appBackground,
        body: Stack(
          children: [
            // No abstract background shapes, just clean background

            if (_steps.isEmpty ||
                _steps.length == 1 &&
                    _steps.first ==
                        AppLocalizations.of(context)!.recipesStepsNotLoaded)
              _buildEmptyState()
            else
              // Content
              Column(
                children: [
                  // Top Bar
                  SafeArea(
                    bottom: false,
                    child: _buildTopBar(context),
                  ),
                  _buildProgress(),
                  Expanded(
                    child: PageView.builder(
                      controller: _pageController,
                      onPageChanged: (index) {
                        setState(() => _currentStep = index);
                        Provider.of<RecipeProvider>(context, listen: false)
                            .setCookingStep(index);
                        if (_isAutoReadEnabled) _speakStep(index);
                      },
                      itemCount: _steps.length,
                      itemBuilder: (context, index) {
                        return _buildStepCard(index);
                      },
                    ),
                  ),
                  _buildBottomControls(),
                ],
              ),

            // Floating Timer
            // Timer check moved to TimerProvider
            Positioned(
              top: 100, // Adjust position as needed
              right: 20,
              child: _buildFloatingTimer(),
            ),

            // Ingredients Sheet (Draggable)
            _buildIngredientsSheet(),

            // Voice Feedback Indicator (Only for Voice command mode)
            if (_isListening)
              Positioned(
                bottom: 140, // Above controls
                left: 20,
                right: 20,
                child: Center(
                  child: _buildVoiceIndicator(),
                ),
              ),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: _showChatModal,
          backgroundColor: appPrimary,
          child: const Icon(Icons.chat_bubble_outline_rounded,
              color: Colors.white),
        ),
      ),
    );
  }

  void _showChatModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _buildChatSheet(),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: cardColor,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 20,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: const Icon(Icons.menu_book_rounded,
                size: 48, color: appPrimary),
          ),
          const SizedBox(height: 24),
          Text(
            AppLocalizations.of(context)!.stepsLoading,
            style: GoogleFonts.outfit(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            AppLocalizations.of(context)!.pleaseWaitOrRetry,
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(
              fontSize: 16,
              color: textColor.withOpacity(0.6),
            ),
          ),
          const SizedBox(height: 32),
          _buildCircleButton(
            icon: Icons.close_rounded,
            onTap: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  Widget _buildTopBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _buildCircleButton(
            icon: Icons.close_rounded,
            onTap: () => Navigator.pop(context),
          ),
          Expanded(
            child: Text(
              widget.recipe.title,
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                color: textColor,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          _buildCircleButton(
            icon: _isAutoReadEnabled
                ? Icons.volume_up_rounded
                : Icons.volume_off_rounded,
            color: _isAutoReadEnabled ? appPrimary : Colors.grey,
            onTap: () {
              setState(() => _isAutoReadEnabled = !_isAutoReadEnabled);
              if (!_isAutoReadEnabled) _cloudTts.stop();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCircleButton({
    required IconData icon,
    required VoidCallback onTap,
    Color? color,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Icon(
          icon,
          color: color ?? textColor,
          size: 24,
        ),
      ),
    );
  }

  Widget _buildProgress() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 40),
      child: Column(
        children: [
          // Step dots showing completion
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(_steps.length, (i) {
              final isCompleted = _completedSteps.contains(i);
              final isCurrent = i == _currentStep;
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: isCurrent ? 28 : 20,
                height: 8,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(4),
                  color: isCompleted
                      ? const Color(0xFF4CAF50)
                      : isCurrent
                          ? appPrimary
                          : Colors.grey.shade300,
                ),
              );
            }),
          ),
          const SizedBox(height: 8),
          Text(
            AppLocalizations.of(context)!.stepProgress(
                _currentStep + 1, _steps.length, _completedSteps.length),
            style: GoogleFonts.outfit(
              color: Colors.grey,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              letterSpacing: 1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepCard(int index) {
    String stepText =
        _steps[index].replaceAll(RegExp(r'^\d+[\.\)]\s*'), '').trim();
    final duration = _extractDuration(stepText);
    final isCompleted = _completedSteps.contains(index);

    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 20),
        decoration: BoxDecoration(
          color: isCompleted
              ? const Color(0xFFF1F8E9) // Light green tint for completed
              : Colors.white.withOpacity(0.95),
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: appPrimary.withOpacity(0.15), // Colored shadow
              blurRadius: 30,
              offset: const Offset(0, 15),
              spreadRadius: 0,
            ),
          ],
          border: Border.all(
            color: isCompleted ? const Color(0xFF4CAF50) : Colors.white,
            width: 2,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // Step Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: isCompleted
                          ? const Color(0xFF4CAF50).withOpacity(0.15)
                          : appPrimary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (isCompleted) ...[
                          const Icon(Icons.check_circle,
                              color: Color(0xFF4CAF50), size: 18),
                          const SizedBox(width: 6),
                        ],
                        Text(
                          isCompleted
                              ? AppLocalizations.of(context)!
                                  .stepCompletedLabel(index + 1)
                              : AppLocalizations.of(context)!
                                  .stepNumberLabel(index + 1),
                          style: GoogleFonts.outfit(
                            color: isCompleted
                                ? const Color(0xFF4CAF50)
                                : appPrimary,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (duration != null)
                    GestureDetector(
                      onTap: () => _startTimer(duration),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.orange.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                              color: Colors.orange.withOpacity(0.5), width: 1),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.timer_outlined,
                                color: Colors.orange, size: 16),
                            const SizedBox(width: 4),
                            Text(
                              "${duration.inMinutes} dk",
                              style: GoogleFonts.outfit(
                                color: Colors.orange,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 32),

              // Step Text
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  child: Text(
                    stepText,
                    textAlign: TextAlign.start,
                    style: GoogleFonts.outfit(
                      color: textColor,
                      fontSize: 22,
                      height: 1.6,
                      fontWeight: FontWeight.w500,
                    ),
                  ).animate().fadeIn(duration: 600.ms),
                ),
              ),

              const SizedBox(height: 20),

              // Read Aloud / Pause / Resume Button
              Center(
                child: Builder(builder: (context) {
                  final isPlaying =
                      _speakingStepIndex == index && _cloudTts.isPlaying;
                  final isPaused =
                      _speakingStepIndex == index && _cloudTts.isPaused;

                  IconData icon;
                  String label;
                  Color bgColor;

                  if (isPlaying) {
                    icon = Icons.pause_rounded;
                    label = AppLocalizations.of(context)!.pauseReading;
                    bgColor =
                        Colors.amber.withOpacity(0.2); // Orange/Amber tint
                  } else if (isPaused) {
                    icon = Icons.play_arrow_rounded;
                    label = AppLocalizations.of(context)!.resumeReading;
                    bgColor = const Color(0xFF4CAF50)
                        .withOpacity(0.2); // Green tint for resume
                  } else {
                    icon = Icons.volume_up_rounded;
                    label = AppLocalizations.of(context)!.readStepAloud;
                    bgColor = appPrimary.withOpacity(0.1);
                  }

                  return TextButton.icon(
                    onPressed: () => _speakStep(index),
                    icon: Icon(icon,
                        color: isPlaying ? Colors.amber[800] : appPrimary),
                    label: Text(
                      label,
                      style: GoogleFonts.outfit(
                        color: isPlaying ? Colors.amber[800] : appPrimary,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 24, vertical: 12),
                      backgroundColor: bgColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                  );
                }),
              ),

              const SizedBox(height: 20),

              // Action Button
              SizedBox(
                width: double.infinity,
                height: 56,
                child: isCompleted
                    ? ElevatedButton.icon(
                        onPressed: _nextPage,
                        icon: const Icon(Icons.check_circle_rounded, size: 22),
                        label: Text(
                          AppLocalizations.of(context)!.completedLabel,
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF4CAF50),
                          foregroundColor: Colors.white,
                          elevation: 4,
                          shadowColor: const Color(0xFF4CAF50).withOpacity(0.4),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                      )
                    : ElevatedButton(
                        onPressed: _nextPage,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: appPrimary,
                          foregroundColor: Colors.white,
                          elevation: 8,
                          shadowColor: appPrimary.withOpacity(0.4),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: Text(
                          index == _steps.length - 1
                              ? AppLocalizations.of(context)!
                                  .finishCookingAction
                              : AppLocalizations.of(context)!.nextStep,
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomControls() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 30, left: 20, right: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _buildCircleButton(
            icon: Icons.arrow_back_rounded,
            onTap: _prevPage,
            color: _currentStep > 0 ? textColor : Colors.grey.withOpacity(0.3),
          ),
          const SizedBox(width: 30),
          _buildCircleButton(
            icon: Icons.mic_none_rounded,
            onTap: _isListening ? () {} : _listenForCommands,
            color: _isListening ? appPrimary : textColor,
          ),
          const SizedBox(width: 30),
          _buildCircleButton(
              icon: Icons.arrow_forward_rounded,
              onTap: _nextPage,
              color: _currentStep < _steps.length - 1
                  ? textColor
                  : Colors.grey.withOpacity(0.3)),
        ],
      ),
    );
  }

  Widget _buildVoiceIndicator() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      decoration: BoxDecoration(
        color: appPrimary,
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: appPrimary.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.mic, color: Colors.white, size: 20),
          const SizedBox(width: 12),
          Text(
            _lastWords.isEmpty
                ? AppLocalizations.of(context)!.listeningLabel
                : _lastWords,
            style: GoogleFonts.outfit(
              color: Colors.white,
              fontWeight: FontWeight.w600,
              fontSize: 16,
            ),
          ),
        ],
      ),
    ).animate().fadeIn().slideY(begin: 0.2, end: 0, duration: 400.ms);
  }

  // Legacy methods removed.

  // Chat Sheet with internal state for correct UI updates
  Widget _buildChatSheet() {
    final provider = Provider.of<RecipeProvider>(context, listen: false);

    return Padding(
      // Move the entire sheet above the keyboard
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: DraggableScrollableSheet(
        initialChildSize: 0.6,
        minChildSize: 0.4,
        maxChildSize: 0.9,
        builder: (context, scrollController) {
          return StatefulBuilder(
              builder: (BuildContext context, StateSetter setSheetState) {
            // Re-read messages on rebuild to stay in sync
            final currentMessages = provider.cookingMessages;

            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
              ),
              child: Column(
                children: [
                  // Handle
                  Center(
                    child: Container(
                      margin: const EdgeInsets.only(top: 12),
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  // Header
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        const Icon(Icons.auto_awesome, color: appPrimary),
                        const SizedBox(width: 10),
                        Text(
                          AppLocalizations.of(context)!.chefAssistant,
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.close_rounded),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),
                  // Chat List
                  Expanded(
                    child: currentMessages.isEmpty && !_isProcessing
                        ? Center(
                            child: Text(
                              AppLocalizations.of(context)!.chatEmptyHint,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.outfit(
                                color: Colors.grey,
                              ),
                            ),
                          )
                        : ListView.builder(
                            controller: scrollController,
                            padding: const EdgeInsets.all(20),
                            itemCount: currentMessages.length +
                                (_isProcessing ? 1 : 0),
                            itemBuilder: (context, index) {
                              if (index == currentMessages.length) {
                                // Loading Indicator Bubble
                                return Align(
                                  alignment: Alignment.centerLeft,
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Colors.grey.shade100,
                                      borderRadius: const BorderRadius.only(
                                        topLeft: Radius.circular(16),
                                        topRight: Radius.circular(16),
                                        bottomRight: Radius.circular(16),
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const SizedBox(
                                            width: 16,
                                            height: 16,
                                            child: CircularProgressIndicator(
                                                strokeWidth: 2)),
                                        const SizedBox(width: 10),
                                        Text(
                                            AppLocalizations.of(context)!
                                                .thinkingLabel,
                                            style: GoogleFonts.outfit(
                                                color: Colors.grey)),
                                      ],
                                    ),
                                  ),
                                );
                              }

                              final msg = currentMessages[index];
                              return Align(
                                alignment: msg.isUser
                                    ? Alignment.centerRight
                                    : Alignment.centerLeft,
                                child: Container(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: msg.isUser
                                        ? appPrimary
                                        : Colors.grey.shade100,
                                    borderRadius: BorderRadius.only(
                                      topLeft: const Radius.circular(16),
                                      topRight: const Radius.circular(16),
                                      bottomLeft: msg.isUser
                                          ? const Radius.circular(16)
                                          : Radius.zero,
                                      bottomRight: msg.isUser
                                          ? Radius.zero
                                          : const Radius.circular(16),
                                    ),
                                  ),
                                  child: Text(
                                    msg.text,
                                    style: GoogleFonts.outfit(
                                      color:
                                          msg.isUser ? Colors.white : textColor,
                                      fontSize: 16,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
                  // Input Area — safe from keyboard
                  Container(
                    padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, -2),
                        ),
                      ],
                    ),
                    child: SafeArea(
                      top: false,
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _chatController,
                              decoration: InputDecoration(
                                hintText:
                                    AppLocalizations.of(context)!.askSomething,
                                hintStyle:
                                    GoogleFonts.outfit(color: Colors.grey),
                                filled: true,
                                fillColor: Colors.grey.shade100,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(30),
                                  borderSide: BorderSide.none,
                                ),
                                contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 20, vertical: 14),
                              ),
                              onSubmitted: (value) async {
                                if (value.isNotEmpty) {
                                  _chatController.clear();
                                  FocusScope.of(context).unfocus();

                                  setSheetState(() =>
                                      provider.addCookingMessage(ChatMessage(
                                        text: value,
                                        isUser: true,
                                        timestamp: DateTime.now(),
                                      )));

                                  setSheetState(() => _isProcessing = true);
                                  await _processVoiceAndSpeak(value);
                                  setSheetState(() => _isProcessing = false);
                                }
                              },
                            ),
                          ),
                          const SizedBox(width: 10),
                          CircleAvatar(
                            backgroundColor: appPrimary,
                            radius: 24,
                            child: IconButton(
                                icon: const Icon(Icons.send_rounded,
                                    color: Colors.white, size: 20),
                                onPressed: () async {
                                  if (_chatController.text.isNotEmpty) {
                                    final value = _chatController.text;
                                    _chatController.clear();
                                    FocusScope.of(context).unfocus();

                                    setSheetState(() =>
                                        provider.addCookingMessage(ChatMessage(
                                          text: value,
                                          isUser: true,
                                          timestamp: DateTime.now(),
                                        )));
                                    setSheetState(() => _isProcessing = true);
                                    await _processVoiceAndSpeak(value);
                                    setSheetState(() => _isProcessing = false);
                                  }
                                }),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          });
        },
      ),
    );
  }

  void _onCookingFinished() {
    Provider.of<RecipeProvider>(context, listen: false).clearCurrentRecipe();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) =>
            CookingCompletionScreen(recipeTitle: widget.recipe.title),
      ),
    );
  }
}
