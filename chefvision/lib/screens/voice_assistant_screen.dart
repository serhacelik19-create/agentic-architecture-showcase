import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../config/theme.dart';
import '../widgets/app_snackbar.dart';
import '../services/voice_service.dart';

class VoiceAssistantScreen extends StatefulWidget {
  const VoiceAssistantScreen({super.key});

  @override
  State<VoiceAssistantScreen> createState() => _VoiceAssistantScreenState();
}

class _VoiceAssistantScreenState extends State<VoiceAssistantScreen>
    with TickerProviderStateMixin {
  final stt.SpeechToText _speech = stt.SpeechToText();
  final FlutterTts _tts = FlutterTts();

  bool _isListening = false;
  bool _isProcessing = false;
  bool _isSpeaking = false;
  final String _recognizedText = '';

  final List<ChatMessage> _messages = [];
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _initializeSpeech();
    _initializeTts();
  }

  bool _welcomeShown = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_welcomeShown) {
      _welcomeShown = true;
      _addBotMessage(AppLocalizations.of(context)!.welcomeMessage);
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _speech.stop();
    _tts.stop();
    super.dispose();
  }

  Future<void> _initializeSpeech() async {
    // Feature temporarily disabled
    // await _speech.initialize();
  }

  Future<void> _initializeTts() async {
    await _tts.setLanguage('tr-TR');
    await _tts.setSpeechRate(0.5);
    await _tts.setVolume(1.0);
    await _tts.setPitch(1.0);

    _tts.setCompletionHandler(() {
      setState(() => _isSpeaking = false);
    });
  }

  void _addBotMessage(String text, {String? emotion}) {
    setState(() {
      _messages.add(ChatMessage(
        text: text,
        isUser: false,
        emotion: emotion ?? 'helpful',
      ));
    });
  }

  void _addUserMessage(String text) {
    setState(() {
      _messages.add(ChatMessage(text: text, isUser: true));
    });
  }

  Future<void> _startListening() async {
    AppSnackBar.info(context,
        "Sesli asistan mikrofon özelliği şu anda devre dışıdır, yakında eklenecektir.");
    return;
  }

  Future<void> _stopListening() async {
    await _speech.stop();
    setState(() => _isListening = false);

    if (_recognizedText.isNotEmpty) {
      _processVoiceInput(_recognizedText);
    }
  }

  Future<void> _processVoiceInput(String text) async {
    if (_isProcessing) return;
    if (text.trim().isEmpty) return;

    setState(() {
      _isProcessing = true;
      _isListening = false;
    });

    _addUserMessage(text);

    try {
      final response = await voiceService.chat(text);

      _addBotMessage(response.response, emotion: response.emotion);

      // Speak the response
      setState(() => _isSpeaking = true);
      await _tts.speak(response.response);

      // Handle actions
      if (response.action != null) {
        _handleAction(response.action!, response.actionData);
      }
    } catch (e) {
      _addBotMessage(AppLocalizations.of(context)!.errorOccurred);
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
  }

  void _handleAction(String action, Map<String, dynamic>? data) {
    // TODO: Handle different actions
    // suggest_recipe, show_recipe_detail, add_to_pantry, add_to_shopping
  }

  String _getEmoji(String emotion) {
    switch (emotion) {
      case 'happy':
        return '😊';
      case 'excited':
        return '🎉';
      case 'curious':
        return '🤔';
      default:
        return '👨‍🍳';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightBg,
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.voiceAssistantTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: AppLocalizations.of(context)!.clearChat,
            onPressed: () {
              voiceService.clearHistory();
              setState(() {
                _messages.clear();
                _addBotMessage(AppLocalizations.of(context)!.chatCleared);
              });
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Chat messages
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              reverse: true,
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[_messages.length - 1 - index];
                return _buildMessageBubble(message, index);
              },
            ),
          ),

          // Voice input section
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.lightCardBg,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(30),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 20,
                  offset: const Offset(0, -5),
                ),
              ],
            ),
            child: Column(
              children: [
                // Status text
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: Text(
                    _isListening
                        ? _recognizedText.isEmpty
                            ? AppLocalizations.of(context)!.listeningLabel
                            : _recognizedText
                        : _isProcessing
                            ? AppLocalizations.of(context)!.thinkingLabel
                            : _isSpeaking
                                ? AppLocalizations.of(context)!.speakingLabel
                                : AppLocalizations.of(context)!.tapMicAndSpeak,
                    key: ValueKey('$_isListening$_isProcessing$_isSpeaking'),
                    style: const TextStyle(
                      color: AppTheme.lightTextSecondary,
                      fontSize: 14,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),

                const SizedBox(height: 20),

                // Mic button
                GestureDetector(
                  onTap: _isListening ? _stopListening : _startListening,
                  child: AnimatedBuilder(
                    animation: _pulseController,
                    builder: (context, child) {
                      return Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: _isListening
                              ? const LinearGradient(
                                  colors: [
                                    Color(0xFFEF4444),
                                    Color(0xFFF87171)
                                  ],
                                )
                              : AppTheme.primaryGradient,
                          boxShadow: [
                            BoxShadow(
                              color: (_isListening
                                      ? const Color(0xFFEF4444)
                                      : AppTheme.primaryColor)
                                  .withOpacity(
                                      0.3 + _pulseController.value * 0.2),
                              blurRadius: 20 + _pulseController.value * 10,
                              spreadRadius: _pulseController.value * 5,
                            ),
                          ],
                        ),
                        child: Icon(
                          _isListening ? Icons.stop : Icons.mic,
                          color: Colors.white,
                          size: 36,
                        ),
                      );
                    },
                  ),
                ).animate(target: _isListening ? 1 : 0).scale(
                    begin: const Offset(1, 1), end: const Offset(1.1, 1.1)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage message, int index) {
    return Align(
      alignment: message.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        decoration: BoxDecoration(
          color: message.isUser ? AppTheme.primaryColor : AppTheme.lightCardBg,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(20),
            topRight: const Radius.circular(20),
            bottomLeft: Radius.circular(message.isUser ? 20 : 4),
            bottomRight: Radius.circular(message.isUser ? 4 : 20),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!message.isUser) ...[
              Text(
                _getEmoji(message.emotion ?? 'helpful'),
                style: const TextStyle(fontSize: 20),
              ),
              const SizedBox(width: 8),
            ],
            Flexible(
              child: Text(
                message.text,
                style: TextStyle(
                  color:
                      message.isUser ? Colors.white : AppTheme.lightTextPrimary,
                  fontSize: 15,
                ),
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.1, end: 0);
  }
}

class ChatMessage {
  final String text;
  final bool isUser;
  final String? emotion;

  ChatMessage({
    required this.text,
    required this.isUser,
    this.emotion,
  });
}
