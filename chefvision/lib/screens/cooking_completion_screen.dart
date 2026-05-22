import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';

class CookingCompletionScreen extends StatelessWidget {
  final String recipeTitle;

  const CookingCompletionScreen({
    super.key,
    required this.recipeTitle,
  });

  @override
  Widget build(BuildContext context) {
    const Color paperColor = Color(0xFFFDFCF2);
    const Color inkColor = Color(0xFF2C1810);

    return Scaffold(
      backgroundColor: paperColor,
      body: Stack(
        children: [
          // Subtle Paper Texture Gradient
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  colors: [paperColor, inkColor.withOpacity(0.05)],
                  radius: 1.5,
                ),
              ),
            ),
          ),

          SafeArea(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Classic Ornament
                    const Text(
                      '~',
                      style: TextStyle(
                        fontSize: 60,
                        color: inkColor,
                        fontFamily: 'Serif',
                      ),
                    )
                        .animate()
                        .fadeIn(duration: 600.ms)
                        .slideY(begin: 0.5, end: 0),

                    const SizedBox(height: 20),

                    Text(
                      AppLocalizations.of(context)!.bonAppetit,
                      style: GoogleFonts.lora(
                        color: inkColor,
                        fontSize: 42,
                        fontWeight: FontWeight.bold,
                        fontStyle: FontStyle.italic,
                      ),
                    )
                        .animate()
                        .fadeIn(delay: 300.ms)
                        .scale(duration: 600.ms, curve: Curves.easeOutBack),

                    const SizedBox(height: 20),

                    Container(
                      height: 1,
                      width: 100,
                      color: inkColor.withOpacity(0.2),
                    ).animate().scaleX(delay: 500.ms),

                    const SizedBox(height: 30),

                    Text(
                      recipeTitle,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.lora(
                        color: inkColor.withOpacity(0.7),
                        fontSize: 20,
                        letterSpacing: 1.2,
                      ),
                    ).animate().fadeIn(delay: 700.ms),

                    const SizedBox(height: 80),

                    // Elegant Finish Button
                    OutlinedButton(
                      onPressed: () => Navigator.of(context)
                          .popUntil((route) => route.isFirst),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: inkColor, width: 1),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 40, vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(0), // Sharp classic edges
                        ),
                      ),
                      child: Text(
                        AppLocalizations.of(context)!.backToHomeCaps,
                        style: GoogleFonts.lora(
                          color: inkColor,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 2,
                        ),
                      ),
                    ).animate().fadeIn(delay: 1000.ms),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
