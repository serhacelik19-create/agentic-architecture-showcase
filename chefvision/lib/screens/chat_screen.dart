import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import '../providers/auth_provider.dart';
import '../services/chat_service.dart';

class ChatScreen extends StatefulWidget {
  final String userId;
  final bool isAdmin;
  final String? topic; // Konu başlığı

  const ChatScreen(
      {super.key, required this.userId, this.isAdmin = false, this.topic});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ChatService _chatService = ChatService();
  String? currentUserId;

  @override
  void initState() {
    super.initState();
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    currentUserId = widget.isAdmin ? 'admin' : authProvider.user?.id.toString();

    // Kullanıcı bilgilerini ve konuyu güncelle
    if (!widget.isAdmin && authProvider.user != null) {
      _chatService.getChatRoomId(widget.userId,
          user: authProvider.user, topic: widget.topic);
    }
  }

  void _sendMessage() async {
    if (_messageController.text.trim().isEmpty || currentUserId == null) return;

    await _chatService.sendMessage(
        widget.userId, // Oda ID'si (Kullanıcı ID'si)
        _messageController.text.trim(),
        widget.isAdmin ? 'admin' : currentUserId!, // Gönderen
        isAdmin: widget.isAdmin);

    _messageController.clear();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text(
            widget.isAdmin ? l10n.chatUserTitle : l10n.chatLiveSupportTitle,
            style: GoogleFonts.outfit(color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
        actions: [
          if (!widget.isAdmin)
            IconButton(
              icon: Icon(Icons.power_settings_new_rounded, color: Colors.red),
              tooltip: l10n.chatEndButtonTooltip,
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: Text(l10n.chatEndDialogTitle,
                        style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
                    content: Text(l10n.chatEndDialogContext,
                        style: GoogleFonts.outfit()),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx),
                        child: Text(l10n.chatEndDialogCancel,
                            style: GoogleFonts.outfit(color: Colors.grey)),
                      ),
                      TextButton(
                        onPressed: () async {
                          Navigator.pop(ctx); // Dialog'u kapat
                          // Odayı kapat (Firestore update)
                          // Odayı kapat ve mesajları temizle
                          await _chatService.clearChat(widget.userId);
                          if (context.mounted) {
                            Navigator.pop(context); // Ekrandan çık
                          }
                        },
                        child: Text(l10n.chatEndDialogConfirm,
                            style: GoogleFonts.outfit(
                                color: Colors.red,
                                fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: StreamBuilder<DocumentSnapshot>(
              stream: _chatService.getChatRoom(widget.userId),
              builder: (context, roomSnapshot) {
                DateTime? userLastClearedAt;
                if (roomSnapshot.hasData && roomSnapshot.data!.exists) {
                  final data =
                      roomSnapshot.data!.data() as Map<String, dynamic>;
                  if (data['userLastClearedAt'] != null) {
                    userLastClearedAt =
                        (data['userLastClearedAt'] as Timestamp).toDate();
                  }
                }

                return StreamBuilder<List<ChatMessage>>(
                  stream: _chatService.getMessages(widget.userId),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return Center(child: CircularProgressIndicator());
                    }

                    if (!snapshot.hasData || snapshot.data!.isEmpty) {
                      return Center(
                          child: Text(l10n.chatNoMessagesHello,
                              style: GoogleFonts.outfit(color: Colors.grey)));
                    }

                    // Mesajları Filtrele
                    final messages = snapshot.data!.where((msg) {
                      if (widget.isAdmin) return true; // Admin hepsini görür
                      if (userLastClearedAt == null) return true;
                      return msg.timestamp.isAfter(userLastClearedAt);
                    }).toList();

                    if (messages.isEmpty) {
                      return Center(
                          child: Text(l10n.chatHistoryClearedInfo,
                              style: GoogleFonts.outfit(color: Colors.grey)));
                    }

                    return ListView.builder(
                      reverse: true, // Mesajlar aşağıdan yukarı gelsin
                      itemCount: messages.length,
                      itemBuilder: (context, index) {
                        final message = messages[index];
                        final isMe = widget.isAdmin
                            ? message.senderId == 'admin'
                            : message.senderId == currentUserId;

                        return Align(
                          alignment: isMe
                              ? Alignment.centerRight
                              : Alignment.centerLeft,
                          child: Container(
                            margin: const EdgeInsets.symmetric(
                                vertical: 4, horizontal: 8),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                                color: isMe ? Colors.orange : Colors.white,
                                borderRadius: BorderRadius.only(
                                  topLeft: const Radius.circular(12),
                                  topRight: const Radius.circular(12),
                                  bottomLeft: isMe
                                      ? const Radius.circular(12)
                                      : const Radius.circular(0),
                                  bottomRight: isMe
                                      ? const Radius.circular(0)
                                      : const Radius.circular(12),
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  )
                                ]),
                            child: Text(
                              message.text,
                              style: GoogleFonts.outfit(
                                color: isMe ? Colors.white : Colors.black87,
                              ),
                            ),
                          ),
                        );
                      },
                    );
                  },
                );
              },
            ),
          ),
          Container(
            padding: EdgeInsets.all(16),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: l10n.chatInputHint,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                      contentPadding:
                          EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    ),
                  ),
                ),
                SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: Colors.orange,
                  child: IconButton(
                    icon: Icon(Icons.send, color: Colors.white),
                    onPressed: _sendMessage,
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
