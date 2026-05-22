import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:chefvision_app/l10n/app_localizations.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/chat_service.dart';
import 'chat_screen.dart';
import 'package:timeago/timeago.dart' as timeago;

class AdminChatListScreen extends StatefulWidget {
  const AdminChatListScreen({super.key});

  @override
  State<AdminChatListScreen> createState() => _AdminChatListScreenState();
}

class _AdminChatListScreenState extends State<AdminChatListScreen> {
  final ChatService _chatService = ChatService();

  @override
  void initState() {
    super.initState();
    timeago.setLocaleMessages('tr', timeago.TrMessages());
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.adminSupportRequestsTitle,
            style: GoogleFonts.outfit(color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: _chatService.getAllChatRooms(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return Center(child: Text(l10n.adminNoSupportRequests));
          }

          return ListView.builder(
            itemCount: snapshot.data!.docs.length,
            itemBuilder: (context, index) {
              final doc = snapshot.data!.docs[index];
              final data = doc.data() as Map<String, dynamic>;
              final String userId = doc.id;
              final String lastMessage = data['lastMessage'] ?? '';
              final Timestamp? timestamp =
                  data['lastMessageTime'] as Timestamp?;
              final int unreadCount = data['unreadCount'] ?? 0;

              return ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.orange.withOpacity(0.2),
                  child: const Icon(Icons.person, color: Colors.orange),
                ),
                title: Text(
                    '${l10n.adminUserPrefix}${userId.substring(0, 5)}...',
                    style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
                subtitle: Text(lastMessage,
                    maxLines: 1, overflow: TextOverflow.ellipsis),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    if (timestamp != null)
                      Text(timeago.format(timestamp.toDate(), locale: 'tr'),
                          style: const TextStyle(
                              fontSize: 12, color: Colors.grey)),
                    if (unreadCount > 0)
                      Container(
                        margin: const EdgeInsets.only(top: 4),
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          unreadCount.toString(),
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold),
                        ),
                      ),
                  ],
                ),
                onTap: () {
                  // Mesajları okundu say
                  _chatService.markAsRead(userId);

                  // Sohbete git (Admin modunda)
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>
                          ChatScreen(userId: userId, isAdmin: true),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
