import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class VoiceAssistantButton extends StatefulWidget {
  final VoidCallback onPressed;
  final bool isListening;

  const VoiceAssistantButton({
    super.key,
    required this.onPressed,
    this.isListening = false,
  });

  @override
  State<VoiceAssistantButton> createState() => _VoiceAssistantButtonState();
}

class _VoiceAssistantButtonState extends State<VoiceAssistantButton> {
  @override
  Widget build(BuildContext context) {
    const Color paperColor = Color(0xFFFDFCF2);
    const Color inkColor = Color(0xFF2C1810);

    return GestureDetector(
      onTap: widget.onPressed,
      child: Container(
        width: 56,
        height: 56,
        decoration: BoxDecoration(
          color: paperColor,
          shape: BoxShape.circle,
          border: Border.all(
            color: inkColor.withOpacity(0.2),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: inkColor.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Icon(
          widget.isListening ? Icons.mic : Icons.mic_none_rounded,
          color: inkColor.withOpacity(0.7),
          size: 24,
        ),
      ).animate(target: widget.isListening ? 1 : 0).scale(
          begin: const Offset(1, 1),
          end: const Offset(1.1, 1.1),
          duration: 400.ms,
          curve: Curves.easeOutBack),
    );
  }
}
