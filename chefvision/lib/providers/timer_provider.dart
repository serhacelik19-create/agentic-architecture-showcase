import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:provider/provider.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:chefvision_app/l10n/app_localizations.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/notification_provider.dart';
import '../models/notification.dart' as model;
import '../services/notification_service.dart';

class TimerProvider extends ChangeNotifier {
  Timer? _timer;
  int _secondsRemaining = 0;
  bool _isRunning = false;
  String? _recipeTitle;
  DateTime? _endTime;

  // Notification IDs
  static const int _ongoingNotificationId = 888;
  static const int _finishedNotificationId = 999;

  // To show notification, we need access to a Context (for l10n)
  // or use a global notification service.
  final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  int get secondsRemaining => _secondsRemaining;
  bool get isRunning => _isRunning;
  String? get recipeTitle => _recipeTitle;

  TimerProvider() {
    _initNotifications();
    _restoreTimerState();
  }

  Future<void> _restoreTimerState() async {
    final prefs = await SharedPreferences.getInstance();
    final endTimeStr = prefs.getString('timer_end_time');
    final recipeTitle = prefs.getString('timer_recipe_title');

    if (endTimeStr != null) {
      final endTime = DateTime.parse(endTimeStr);
      final now = DateTime.now();

      if (endTime.isAfter(now)) {
        // Özeti (Kalan Süreyi) hesapla ve state'i güncelle
        _endTime = endTime;
        _recipeTitle = recipeTitle;
        _secondsRemaining = endTime.difference(now).inSeconds;
        _isRunning = true;
        notifyListeners();

        // Sayacı yeniden başlat
        _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
          if (_endTime == null) {
            _stopTimerInternal();
            return;
          }
          final currentNow = DateTime.now();
          final diff = _endTime!.difference(currentNow).inSeconds;

          if (diff > 0) {
            _secondsRemaining = diff;
            notifyListeners();
          } else {
            _secondsRemaining = 0;
            _stopTimerInternal();
            notifyListeners();
            // Context olmadığı için l10n ile bildirim gösteremiyoruz,
            // ancak işletim sistemi zaten bildirimi atacaktır.
          }
        });
      } else {
        // Süre uygulama kapalıyken dolmuş
        _clearTimerState();
      }
    }
  }

  Future<void> _saveTimerState(DateTime endTime, String title) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('timer_end_time', endTime.toIso8601String());
    if (title.isNotEmpty) {
      await prefs.setString('timer_recipe_title', title);
    }
  }

  Future<void> _clearTimerState() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('timer_end_time');
    await prefs.remove('timer_recipe_title');
  }

  Future<void> _initNotifications() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings initializationSettingsDarwin =
        DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings initializationSettings =
        InitializationSettings(
            android: initializationSettingsAndroid,
            iOS: initializationSettingsDarwin);

    await _notificationsPlugin.initialize(initializationSettings);
  }

  void startTimer(int seconds, String recipeTitle, BuildContext context) async {
    _stopTimerInternal();

    // Capture l10n before async gap to avoid use_build_context_synchronously
    final l10n = AppLocalizations.of(context);

    // Tactical Notification Permission: ask permission only when user actually
    // starts a timer, so they understand why notifications are needed.
    final notificationService = NotificationService();
    await notificationService.requestPermissions();
    _endTime = DateTime.now().add(Duration(seconds: seconds));
    _secondsRemaining = seconds;
    _recipeTitle = recipeTitle;
    _isRunning = true;
    _saveTimerState(_endTime!, recipeTitle); // App kapanmasına karşı kaydet
    notifyListeners();

    if (l10n != null) {
      // 1. Devam Eden Bildirimi Başlat (Arka Planda Sayan Sayaç)
      _showOngoingNotification(l10n, recipeTitle, _endTime!);

      // 2. Tamamlanma Anı İçin Bildirimi Planla (App Kapansa Bile Çalar)
      _scheduleFinishedNotification(l10n, recipeTitle, _endTime!);
    }

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_endTime == null) {
        _stopTimerInternal();
        return;
      }

      final now = DateTime.now();
      final diff = _endTime!.difference(now).inSeconds;

      if (diff > 0) {
        _secondsRemaining = diff;
        notifyListeners();
      } else {
        _secondsRemaining = 0;
        _stopTimerInternal();
        // Bildirim işletim sistemi tarafından otomatik gösterilir (zonedSchedule).
        // Ancak uygulama içi bildirim merkezini güncellemek için fonksiyonumuzu da çağırıyoruz.
        _onTimerFinished(context, l10n);
        notifyListeners();
      }
    });
  }

  void stopTimer() {
    _stopTimerInternal();
    _cancelNotifications();
    notifyListeners();
  }

  void _stopTimerInternal() {
    _timer?.cancel();
    _timer = null;
    _isRunning = false;
    _endTime = null;
    _clearTimerState(); // Kaydedilmiş state'i temizle
  }

  void _cancelNotifications() async {
    await _notificationsPlugin.cancel(_ongoingNotificationId);
    await _notificationsPlugin.cancel(_finishedNotificationId);
  }

  Future<void> _showOngoingNotification(
      AppLocalizations l10n, String title, DateTime endTime) async {
    // Android chronometer requires API 24+ for chronometerCountDown.
    // It shows a live countdown in the notification shade.

    // YENİ ÖZEL TASARIM (CUSTOM LAYOUT) KULLANIMI
    // Android tarafında yazdığımız "custom_timer_notification" adlı XML tasarımını kullanıyoruz.
    final androidDetails = AndroidNotificationDetails(
      'timer_ongoing_custom_channel',
      l10n.customTimerChannelName,
      channelDescription: l10n.customTimerChannelDescription,
      importance: Importance.low,
      priority: Priority.low,
      ongoing: true,
      autoCancel: false,
      showWhen: true,
      when: endTime.millisecondsSinceEpoch,
      usesChronometer: true,
      chronometerCountDown: true,

      // Standart üst bar (status bar) ikonu
      icon: '@drawable/ic_cooking_pot',
      // Arka planı projenizin vurgu rengi (Mor) yapıyoruz
      color: const Color(0xFF6C63FF),

      // Standart büyük resimli "Custom" hissi veren layout
      styleInformation: BigTextStyleInformation(
        l10n.timerCookingDescription,
        htmlFormatBigText: true,
        contentTitle: '<b>$title</b>',
        htmlFormatContentTitle: true,
        summaryText: l10n.chefVisionActiveTimer,
        htmlFormatSummaryText: true,
      ),
      largeIcon: const DrawableResourceAndroidBitmap('ic_cooking_pot'),
    );

    // iOS İçin Bildirim Ayarları
    const darwinDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentSound: false,
      interruptionLevel: InterruptionLevel.active,
    );

    final details = NotificationDetails(
      android: androidDetails,
      iOS: darwinDetails,
    );

    await _notificationsPlugin.show(
      _ongoingNotificationId,
      l10n.timerLabel, // "Sayaç"
      l10n.timerCookingTitle(title),
      details,
    );
  }

  Future<void> _scheduleFinishedNotification(
      AppLocalizations l10n, String title, DateTime endTime) async {
    const androidDetails = AndroidNotificationDetails(
      'timer_channel',
      'Cooking Timer',
      channelDescription: 'Notifications for recipe timers',
      importance: Importance.max,
      priority: Priority.high,
      playSound: true,
      fullScreenIntent: true, // Kilit ekranında uyandırmak için
    );

    const darwinDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentSound: true,
      presentBadge: true,
      interruptionLevel: InterruptionLevel.timeSensitive,
    );

    final details = NotificationDetails(
      android: androidDetails,
      iOS: darwinDetails,
    );

    try {
      await _notificationsPlugin.zonedSchedule(
        _finishedNotificationId,
        l10n.timerFinishedTitle,
        l10n.timerFinishedMessage(title),
        tz.TZDateTime.from(endTime, tz.local),
        details,
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
        uiLocalNotificationDateInterpretation:
            UILocalNotificationDateInterpretation.absoluteTime,
      );
    } catch (e) {
      debugPrint('Error scheduling notification: $e');
      // If exact alarm permission is missing on Android 14+, this might fail.
    }
  }

  void _onTimerFinished(BuildContext context, AppLocalizations? l10n) {
    if (l10n == null) return;

    // İşi bittiğinde ongoing timer bildirimini iptal et
    _notificationsPlugin.cancel(_ongoingNotificationId);

    final title = l10n.timerFinishedTitle;
    final message = l10n.timerFinishedMessage(_recipeTitle ?? '');

    // Local notification is already handled by zonedSchedule,
    // we only need to update the in-app state here if the app is open.

    // 2. App Notification Center
    // We need to access NotificationProvider. Since we have context here, we can.
    try {
      final notificationProvider = context.read<NotificationProvider>();
      notificationProvider.addNotification(
        title: title,
        message: message,
        type: model.NotificationType.info,
      );
    } catch (e) {
      debugPrint('Could not add to App Notification Center: $e');
    }
  }

  String get formattedTime {
    final minutes = (_secondsRemaining / 60).floor();
    final seconds = _secondsRemaining % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  void dispose() {
    _stopTimerInternal();
    _cancelNotifications();
    super.dispose();
  }
}
