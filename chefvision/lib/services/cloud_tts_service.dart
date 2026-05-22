import 'package:flutter_tts/flutter_tts.dart';
import 'package:flutter/foundation.dart';

/// Native TTS Service using device's text-to-speech engine
/// Supports resume-from-position using word progress tracking.
class CloudTtsService {
  final FlutterTts _flutterTts;
  bool _isPlaying = false;
  bool _isPaused = false;
  VoidCallback? onStart;
  VoidCallback? onPause;
  VoidCallback? onComplete;
  VoidCallback? onError;

  // --- Resume-from-position tracking ---
  String _currentText = '';
  int _currentWordStart = 0;

  bool get isPlaying => _isPlaying;
  bool get isPaused => _isPaused;

  CloudTtsService() : _flutterTts = FlutterTts() {
    _initTts();
  }

  Future<void> _initTts() async {
    try {
      // Set language to Turkish
      await _flutterTts.setLanguage("tr-TR");

      // Configure audio session (important for iOS)
      await _flutterTts.setIosAudioCategory(
          IosTextToSpeechAudioCategory.playback,
          [
            IosTextToSpeechAudioCategoryOptions.allowBluetooth,
            IosTextToSpeechAudioCategoryOptions.allowBluetoothA2DP,
            IosTextToSpeechAudioCategoryOptions.mixWithOthers,
            IosTextToSpeechAudioCategoryOptions.defaultToSpeaker
          ],
          IosTextToSpeechAudioMode.defaultMode);

      // Handlers
      _flutterTts.setStartHandler(() {
        _isPlaying = true;
        onStart?.call();
        debugPrint("TTS Started");
      });

      _flutterTts.setCompletionHandler(() {
        _isPlaying = false;
        _isPaused = false;
        _currentWordStart = 0;
        onComplete?.call();
        debugPrint("TTS Completed");
      });

      _flutterTts.setPauseHandler(() {
        _isPlaying = false;
        _isPaused = true;
        onPause?.call();
        debugPrint("TTS Paused");
      });

      _flutterTts.setContinueHandler(() {
        _isPlaying = true;
        _isPaused = false;
        onStart?.call();
        debugPrint("TTS Continued");
      });

      _flutterTts.setErrorHandler((msg) {
        _isPlaying = false;
        _isPaused = false;
        onError?.call();
        debugPrint("TTS Error: $msg");
      });

      // Track word-level progress for resume-from-position.
      // The callback provides (text, start, end, word) on supported platforms.
      _flutterTts
          .setProgressHandler((String text, int start, int end, String word) {
        _currentWordStart = start;
      });
    } catch (e) {
      debugPrint("TTS Init Error: $e");
    }
  }

  /// Speak text using device's native TTS
  Future<void> speak(String text) async {
    try {
      await stop();

      // Reset tracking state
      _currentText = text;
      _currentWordStart = 0;

      // Ensure language is set (sometimes it resets)
      await _flutterTts.setLanguage("tr-TR");
      await _flutterTts.setPitch(1.0);
      await _flutterTts
          .setSpeechRate(0.5); // 0.5 is usually normal speed in flutter_tts

      if (text.isNotEmpty) {
        await _flutterTts.speak(text);
      }
    } catch (e) {
      debugPrint('❌ Native TTS error: $e');
      _isPlaying = false;
      onError?.call();
    }
  }

  /// Pause playback
  Future<void> pause() async {
    await _flutterTts.pause();
    _isPlaying = false;
    _isPaused = true;
  }

  /// Resume playback from the last known word position.
  /// If progress tracking is not supported on the device, falls back to
  /// replaying from the beginning.
  Future<void> resume() async {
    if (_currentText.isEmpty) return;

    _isPaused = false;

    // Calculate remaining text from the last tracked word position.
    final remaining =
        (_currentWordStart > 0 && _currentWordStart < _currentText.length)
            ? _currentText.substring(_currentWordStart).trimLeft()
            : _currentText;

    debugPrint(
        "TTS Resuming from position $_currentWordStart / ${_currentText.length}");

    // Reset tracking relative to new substring
    _currentText = remaining;
    _currentWordStart = 0;

    try {
      await _flutterTts.stop(); // stop old utterance before starting new one
      await _flutterTts.setLanguage("tr-TR");
      await _flutterTts.setPitch(1.0);
      await _flutterTts.setSpeechRate(0.5);

      if (remaining.isNotEmpty) {
        await _flutterTts.speak(remaining);
      }
    } catch (e) {
      debugPrint('❌ TTS Resume error: $e');
      _isPlaying = false;
      onError?.call();
    }
  }

  /// Stop playing
  Future<void> stop() async {
    await _flutterTts.stop();
    _isPlaying = false;
    _isPaused = false;
    _currentText = '';
    _currentWordStart = 0;
  }

  /// Dispose resources
  void dispose() {
    _flutterTts.stop();
  }
}
