import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notification.dart';

class NotificationProvider with ChangeNotifier {
  final List<AppNotification> _notifications = [];
  final List<AppNotification> _dismissedNotifications =
      []; // Silinenleri takip et
  static const String _storageKey = 'chefvision_notifications';
  static const String _dismissedStorageKey =
      'chefvision_dismissed_notifications';

  List<AppNotification> get notifications => List.unmodifiable(_notifications);

  List<AppNotification> get unreadNotifications =>
      _notifications.where((n) => !n.isRead).toList();

  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  NotificationProvider() {
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      // Aktif bildirimleri yükle
      final String? notificationsJson = prefs.getString(_storageKey);
      if (notificationsJson != null) {
        final List<dynamic> decodedList = json.decode(notificationsJson);
        _notifications.clear();
        _notifications.addAll(
          decodedList.map((item) => AppNotification.fromJson(item)).toList(),
        );
      }

      // Silinen (dismissed) bildirimleri yükle
      final String? dismissedJson = prefs.getString(_dismissedStorageKey);
      if (dismissedJson != null) {
        final List<dynamic> decodedList = json.decode(dismissedJson);
        _dismissedNotifications.clear();
        _dismissedNotifications.addAll(
          decodedList.map((item) => AppNotification.fromJson(item)).toList(),
        );
      }

      // 24 saatten eski silinenleri temizle (hafıza yönetimi)
      _cleanupOldDismissed();

      notifyListeners();
    } catch (e) {
      debugPrint('Error loading notifications: $e');
    }
  }

  Future<void> _saveNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      // Aktifleri kaydet
      final String encodedList = json.encode(
        _notifications.map((n) => n.toJson()).toList(),
      );
      await prefs.setString(_storageKey, encodedList);

      // Silinenleri kaydet
      final String encodedDismissed = json.encode(
        _dismissedNotifications.map((n) => n.toJson()).toList(),
      );
      await prefs.setString(_dismissedStorageKey, encodedDismissed);
    } catch (e) {
      debugPrint('Error saving notifications: $e');
    }
  }

  void _cleanupOldDismissed() {
    final now = DateTime.now();
    _dismissedNotifications
        .removeWhere((n) => now.difference(n.timestamp).inHours > 24);
  }

  void addNotification({
    required String title,
    required String message,
    required NotificationType type,
  }) {
    // 24 saat kontrolü için zaman
    final threshold = DateTime.now().subtract(const Duration(hours: 24));

    // 1. Aktif bildirimlerde var mı?
    final existsInActive = _notifications.any((n) =>
        n.title == title &&
        n.message == message &&
        n.timestamp.isAfter(threshold));

    // 2. Silinen bildirimlerde var mı?
    final existsInDismissed = _dismissedNotifications.any((n) =>
        n.title == title &&
        n.message == message &&
        n.timestamp.isAfter(threshold));

    // Eğer ikisinde de yoksa ekle
    if (!existsInActive && !existsInDismissed) {
      final notification = AppNotification(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: title,
        message: message,
        type: type,
        timestamp: DateTime.now(),
      );

      _notifications.insert(0, notification);
      notifyListeners();
      _saveNotifications();
    }
  }

  void markAsRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1 && !_notifications[index].isRead) {
      _notifications[index].isRead = true;
      notifyListeners();
      _saveNotifications();
    }
  }

  void markAllAsRead() {
    for (var n in _notifications) {
      n.isRead = true;
    }
    notifyListeners();
    _saveNotifications();
  }

  void clearNotifications() {
    // Hepsini silinenlere taşı
    _dismissedNotifications.addAll(_notifications);
    _notifications.clear();

    notifyListeners();
    _saveNotifications();
  }

  void removeNotification(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1) {
      // Silinenler listesine ekle
      _dismissedNotifications.add(_notifications[index]);
      // Aktif listeden çıkar
      _notifications.removeAt(index);

      notifyListeners();
      _saveNotifications();
    }
  }
}
