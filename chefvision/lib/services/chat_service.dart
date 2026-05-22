import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'dart:io';
import 'package:flutter/foundation.dart';

class ChatMessage {
  final String id;
  final String senderId;
  final String text;
  final DateTime timestamp;
  final bool isRead;

  ChatMessage({
    required this.id,
    required this.senderId,
    required this.text,
    required this.timestamp,
    this.isRead = false,
  });

  factory ChatMessage.fromFirestore(DocumentSnapshot doc) {
    Map data = doc.data() as Map<String, dynamic>;
    return ChatMessage(
      id: doc.id,
      senderId: data['senderId'] ?? '',
      text: data['text'] ?? '',
      timestamp: (data['timestamp'] as Timestamp?)?.toDate() ?? DateTime.now(),
      isRead: data['isRead'] ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'senderId': senderId,
      'text': text,
      'timestamp': Timestamp.fromDate(timestamp),
      'isRead': isRead,
    };
  }
}

class ChatService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Sohbet odası oluştur veya getir ve kullanıcı bilgilerini güncelle
  Future<String> getChatRoomId(String userId,
      {dynamic user, String? topic}) async {
    // Basitlik için userId'yi oda ID'si olarak kullanalım
    final roomRef = _firestore.collection('support_rooms').doc(userId);

    // Cihaz Bilgisi Al
    String deviceInfoStr = 'Bilinmiyor';
    try {
      final deviceInfo = DeviceInfoPlugin();
      if (!kIsWeb && Platform.isAndroid) {
        final androidInfo = await deviceInfo.androidInfo;
        deviceInfoStr =
            '${androidInfo.brand} ${androidInfo.model} (Android ${androidInfo.version.release})';
      } else if (!kIsWeb && Platform.isIOS) {
        final iosInfo = await deviceInfo.iosInfo;
        deviceInfoStr =
            '${iosInfo.name} ${iosInfo.systemName} ${iosInfo.systemVersion}';
      }
    } catch (e) {
      print('Device info error: $e');
    }

    final docSnapshot = await roomRef.get();

    final Map<String, dynamic> roomData = {
      'userId': userId,
      'deviceInfo': deviceInfoStr,
      'updatedAt': FieldValue.serverTimestamp(), // Dashboard sıralaması için
    };

    // Eğer kullanıcı objesi geldiyse (User model)
    if (user != null) {
      roomData['userName'] = user.name;
      roomData['userEmail'] = user.email;
      roomData['subscriptionTier'] = user.subscriptionTier;
      roomData['recipeCount'] = user.recipeGenerationCount; // Ekstra bilgi
    }

    // Eğer konu seçildiyse güncelle
    if (topic != null && topic.isNotEmpty) {
      roomData['topic'] = topic;
      roomData['status'] = 'open'; // Konu seçildiğinde durumu açık yap
    }

    if (!docSnapshot.exists) {
      // Yeni oda
      roomData['createdAt'] = FieldValue.serverTimestamp();
      roomData['lastMessage'] = 'Talep oluşturuldu.';
      roomData['lastMessageTime'] = FieldValue.serverTimestamp();
      roomData['unreadCount'] = 1; // Admin görsün diye
      await roomRef.set(roomData);
    } else {
      // Mevcut oda güncelleniyor
      await roomRef.update(roomData);
    }

    return userId;
  }

  // Mesaj Gönder
  Future<void> sendMessage(String userId, String text, String senderId,
      {bool isAdmin = false}) async {
    final roomId = await getChatRoomId(userId);

    await _firestore
        .collection('support_rooms')
        .doc(roomId)
        .collection('messages')
        .add({
      'senderId': senderId,
      'text': text,
      'timestamp': FieldValue.serverTimestamp(),
      'isRead': false,
    });

    // Oda bilgilerini güncelle (Son mesaj vs.)
    await _firestore.collection('support_rooms').doc(roomId).update({
      'lastMessage': text,
      'lastMessageTime': FieldValue.serverTimestamp(),
      'unreadCount': isAdmin
          ? 0
          : FieldValue.increment(1), // Kullanıcı attıysa adminin sayacını artır
    });
  }

  // Mesajları Dinle (Stream)
  Stream<List<ChatMessage>> getMessages(String userId) {
    return _firestore
        .collection('support_rooms')
        .doc(userId)
        .collection('messages')
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => ChatMessage.fromFirestore(doc))
          .toList();
    });
  }

  // Oda Bilgilerini Getir (Stream)
  Stream<DocumentSnapshot> getChatRoom(String userId) {
    return _firestore.collection('support_rooms').doc(userId).snapshots();
  }

  // Admin: Tüm Sohbetleri Getir
  Stream<QuerySnapshot> getAllChatRooms() {
    return _firestore
        .collection('support_rooms')
        .orderBy('lastMessageTime', descending: true)
        .snapshots();
  }

  // Mesajları Okundu Olarak İşaretle
  Future<void> markAsRead(String userId) async {
    await _firestore.collection('support_rooms').doc(userId).update({
      'unreadCount': 0,
    });
  }

  // Sohbeti Temizle (Kullanıcı Tarafı - Soft Delete)
  Future<void> clearChat(String userId) async {
    final roomRef = _firestore.collection('support_rooms').doc(userId);

    // Mesajları silmek yerine, kullanıcının "temizleme zamanını" güncelliyoruz.
    // Böylece admin eski mesajları görmeye devam edebilir.
    await roomRef.update({
      'status': 'resolved',
      'lastMessage': 'Sohbet sonlandırıldı.',
      'updatedAt': FieldValue.serverTimestamp(),
      'userLastClearedAt': FieldValue.serverTimestamp(), // Yeni alan
      'unreadCount': 0,
    });
  }
}
