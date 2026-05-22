import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../config/theme.dart';

class EngagingLoadingView extends StatefulWidget {
  final List<String>? messages;
  final Duration interval;

  const EngagingLoadingView({
    super.key,
    this.messages,
    this.interval = const Duration(seconds: 2),
  });

  @override
  State<EngagingLoadingView> createState() => _EngagingLoadingViewState();
}

class _EngagingLoadingViewState extends State<EngagingLoadingView> {
  int _currentIndex = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(widget.interval, (timer) {
      if (mounted) {
        setState(() {
          final msgs = widget.messages ?? _getDefaultMessages(context);
          _currentIndex = (_currentIndex + 1) % msgs.length;
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Animated Icon
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.restaurant_menu_rounded,
              size: 48,
              color: AppTheme.primaryColor,
            )
                .animate(onPlay: (c) => c.repeat())
                .rotate(duration: 2000.ms)
                .shimmer(
                    duration: 1500.ms, color: Colors.white.withOpacity(0.5)),
          ).animate().scale(duration: 600.ms, curve: Curves.easeOutBack),

          const SizedBox(height: 32),

          // Message
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 500),
            transitionBuilder: (Widget child, Animation<double> animation) {
              return FadeTransition(
                opacity: animation,
                child: SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0.0, 0.2),
                    end: Offset.zero,
                  ).animate(animation),
                  child: child,
                ),
              );
            },
            child: Text(
              (widget.messages ?? _getDefaultMessages(context))[_currentIndex],
              key: ValueKey<int>(_currentIndex),
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                  ),
              textAlign: TextAlign.center,
            ),
          ),

          const SizedBox(height: 12),

          // Subtitle
          Text(
            AppLocalizations.of(context)!.loadingAI,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).hintColor,
                ),
          ),
        ],
      ),
    );
  }

  List<String> _getDefaultMessages(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return [
      l10n.loadingMixing,
      l10n.loadingChef,
      l10n.loadingSelecting,
      l10n.loadingIngredients,
      l10n.loadingSecret,
    ];
  }
}
