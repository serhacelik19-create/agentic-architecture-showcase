"use client"

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Send, User as UserIcon, MessageSquare, Clock, CheckCheck, Loader2, MoreVertical, Phone, Shield, CreditCard, Lock, Calendar, AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, setDoc, getDoc, getDocs, QuerySnapshot, DocumentData, QueryDocumentSnapshot, writeBatch } from "firebase/firestore";
// import { toast } from "sonner"; // DISABLED FOR DEBUGGING
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { adminApi } from '@/lib/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// ... (existing code matches)



// Types
interface ChatRoom {
    id: string; // UserId
    lastMessage: string;
    lastMessageTime: any;
    unreadCount: number;
    userName?: string;
    userEmail?: string;
    userProfileImage?: string;
    subscriptionTier?: string;
    deviceInfo?: string; // Mobilden gelen cihaz bilgisi
    topic?: string; // Mobilden gelen konu
    status?: 'open' | 'resolved' | 'pending';
    updatedAt?: any;
}

interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: any;
}

interface UserProfile {
    id: number;
    email: string;
    name: string;
    is_pro: boolean;
    subscription_tier: string;
    subscription_expires_at: string;
    created_at: string;
    avatar_url?: string;
    recipe_count?: number;
    device_change_count?: number;
}

export default function SupportPage() {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Right Panel State
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    // Actions State
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    // Safe Toast Wrapper REPLACED with Console Log
    const safeToast = {
        success: (message: any) => {
            console.log("Toast Success (Disabled):", message);
            // toast.success(String(message));
        },
        error: (message: any) => {
            console.error("Toast Error (Disabled):", message);
            // toast.error("Bir hata oluştu");
        }
    };

    // 1. Fetch Chat Rooms (Real-time)
    useEffect(() => {
        // Updated sorting field to match mobile app's data
        const q = query(collection(db, "support_rooms"), orderBy("lastMessageTime", "desc"));

        const unsubscribe = onSnapshot(q, async (snapshot: QuerySnapshot<DocumentData>) => {
            const roomList: ChatRoom[] = [];
            snapshot.docs.forEach(doc => {
                const data = doc.data();

                // Safe Data Handling for Last Message
                let safeLastMsg = "";
                if (typeof data.lastMessage === 'string') {
                    safeLastMsg = data.lastMessage;
                } else if (data.lastMessage) {
                    // If it's an object (like a Pydantic Error), convert to string safely or ignore
                    console.warn("Invalid lastMessage format:", data.lastMessage);
                    safeLastMsg = "Görüntülenemeyen Mesaj";
                }

                roomList.push({
                    id: doc.id,
                    lastMessage: safeLastMsg,
                    lastMessageTime: data.lastMessageTime,
                    unreadCount: data.unreadCount || 0,
                    userName: (typeof data.userName === 'string') ? data.userName : "Kullanıcı",
                    userEmail: data.userEmail || "",
                    userProfileImage: data.userProfileImage,
                    subscriptionTier: data.subscriptionTier || "free",
                    deviceInfo: typeof data.deviceInfo === 'string' ? data.deviceInfo : "Android Cihaz", // Safe fallback
                    topic: data.topic,
                    status: data.status || 'open',
                    updatedAt: data.updatedAt
                });
            });
            setRooms(roomList);
            setLoadingRooms(false);
        }, (error) => {
            console.error("Error fetching rooms:", error);
            safeToast.error("Sohbet listesi yüklenemedi.");
            setLoadingRooms(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Fetch Messages & User Profile for Selected Room
    useEffect(() => {
        if (!selectedRoom) return;

        // Reset states
        setUserProfile(null);

        // Mark as read
        const markAsRead = async () => {
            try {
                const roomRef = doc(db, "support_rooms", selectedRoom.id);
                await updateDoc(roomRef, { unreadCount: 0 });
            } catch (e) {
                console.error("Error marking as read:", e);
            }
        };
        markAsRead();

        // Fetch User Profile from Backend (API)
        const fetchUserProfile = async () => {
            setLoadingProfile(true);
            try {
                let profileData: UserProfile | null = null;
                const userIdInt = parseInt(selectedRoom.id);

                // Strategy 1: Try by ID
                if (!isNaN(userIdInt)) {
                    try {
                        const data = await adminApi.getUserDetails(userIdInt);
                        if (data && typeof data === 'object' && 'id' in data) {
                            profileData = data;
                        }
                    } catch (e) {
                        console.warn("Fetch by ID failed, trying email fallback...");
                    }
                }

                // Strategy 2: Try by Email (Fallback)
                if (!profileData && selectedRoom.userEmail) {
                    try {
                        const searchResults = await adminApi.searchUsers(selectedRoom.userEmail);
                        // Find exact email match
                        const match = searchResults.find((u: any) => u.email.toLowerCase() === selectedRoom.userEmail!.toLowerCase());
                        if (match) {
                            // Search returns limited info, we might want full details:
                            const detailedData = await adminApi.getUserDetails(match.id);
                            if (detailedData) profileData = detailedData;
                        }
                    } catch (e) {
                        console.error("Fallback search failed", e);
                    }
                }

                if (profileData) {
                    setUserProfile(profileData);
                } else {
                    console.error("User profile not found via ID or Email.");
                    // safeToast.error("Kullanıcı profili bulunamadı.");
                }

            } catch (e) {
                console.error("Critical error in fetchUserProfile", e);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchUserProfile();

        // Listen for messages
        const q = query(
            collection(db, "support_rooms", selectedRoom.id, "messages"),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
            const messageList: Message[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id, // Doc ID is always string
                    text: typeof data.text === 'string' ? data.text : "Mesaj formatı geçersiz",
                    senderId: data.senderId,
                    timestamp: data.timestamp
                };
            }).reverse();

            setMessages(messageList);

            // Scroll to bottom
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        });

        return () => unsubscribe();
    }, [selectedRoom]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedRoom || !newMessage.trim()) return;

        setSending(true);
        try {
            const roomId = selectedRoom.id;
            const text = newMessage.trim();
            const timestamp = serverTimestamp();

            await addDoc(collection(db, "support_rooms", roomId, "messages"), {
                text: text,
                senderId: 'admin',
                timestamp: timestamp
            });

            await setDoc(doc(db, "support_rooms", roomId), {
                lastMessage: text,
                lastMessageTime: timestamp,
                updatedAt: timestamp,
                unreadCount: 0
            }, { merge: true });

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            safeToast.error("Mesaj gönderilemedi.");
        } finally {
            setSending(false);
        }
    };

    const handleResetPassword = async () => {
        if (!userProfile || !newPassword) return;
        try {
            await adminApi.resetUserPassword(userProfile.id, newPassword);
            safeToast.success("Şifre Başarıyla Sıfırlandı");
            setIsResetPasswordOpen(false);
            setNewPassword("");
        } catch (e) {
            console.error(e);
            safeToast.error("Şifre sıfırlama başarısız");
        }
    };

    const handleGiftPremium = async () => {
        if (!userProfile) return;
        try {
            await adminApi.updateUserSubscription(userProfile.id, {
                is_pro: true,
                tier: 'premium',
                duration_days: 7 // 7 Days Gift
            });
            safeToast.success("7 Gün Premium Hediye Edildi");
            // Refresh profile
            const data = await adminApi.getUserDetails(userProfile.id);
            if (data && 'id' in data) setUserProfile(data);
        } catch (e) {
            console.error(e);
            safeToast.error("İşlem başarısız");
        }
    };

    const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');

    const handleCloseRequest = async () => {
        if (!selectedRoom) return;
        if (!confirm("Talebi kapatmak istediğinize emin misiniz?")) return;

        try {
            await updateDoc(doc(db, "support_rooms", selectedRoom.id), {
                status: 'resolved',
                lastMessage: 'Talep admin tarafından kapatıldı.',
                updatedAt: serverTimestamp()
            });
        } catch (e) {
            console.error(e);
            safeToast.error("İşlem başarısız");
        }
    };

    const handleDeleteChatHistory = async () => {
        if (!selectedRoom) return;
        if (!confirm("BU İŞLEM GERİ ALINAMAZ! Sohbet geçmişini kalıcı olarak silmek istediğinize emin misiniz?")) return;

        try {
            const messagesRef = collection(db, "support_rooms", selectedRoom.id, "messages");
            const snapshot = await getDocs(messagesRef);

            if (!snapshot.empty) {
                const batch = writeBatch(db);
                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }

            // Update room to show it was cleared
            await updateDoc(doc(db, "support_rooms", selectedRoom.id), {
                lastMessage: 'Sohbet geçmişi yönetici tarafından silindi.',
                updatedAt: serverTimestamp()
            });

            safeToast.success("Sohbet geçmişi silindi.");
        } catch (e) {
            console.error(e);
            safeToast.error("Silme işlemi başarısız oldu.");
        }
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (statusFilter === 'all') return true;
        if (statusFilter === 'open') return room.status !== 'resolved';
        if (statusFilter === 'resolved') return room.status === 'resolved';

        return true;
    });

    return (
        <div className="flex h-[calc(100vh-2rem)] p-4 pt-2 gap-4 bg-slate-50/50 dark:bg-[#0f172a]">
            {/* 1. LEFT PANEL: Chats List */}
            <Card className="w-[320px] shrink-0 flex flex-col border-none shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none dark:bg-slate-900/50 rounded-2xl overflow-hidden">
                <CardHeader className="bg-white dark:bg-slate-900/50 p-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            Canlı Destek
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                {rooms.length}
                            </Badge>
                        </div>
                    </CardTitle>
                    <div className="relative mt-3 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                placeholder="Ara..."
                                className="pl-8 h-9 bg-slate-50 border-none dark:bg-slate-800 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={cn(
                                    "flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-colors border",
                                    statusFilter === 'all'
                                        ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                                )}
                            >
                                Tümü
                            </button>
                            <button
                                onClick={() => setStatusFilter('open')}
                                className={cn(
                                    "flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-colors border",
                                    statusFilter === 'open'
                                        ? "bg-emerald-600 text-white border-emerald-600"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                                )}
                            >
                                Açık
                            </button>
                            <button
                                onClick={() => setStatusFilter('resolved')}
                                className={cn(
                                    "flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-colors border",
                                    statusFilter === 'resolved'
                                        ? "bg-slate-500 text-white border-slate-500"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                                )}
                            >
                                Kapalı
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1 bg-white dark:bg-slate-900/30">
                    <div className="flex flex-col p-2 space-y-1">
                        {loadingRooms ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" /></div>
                        ) : filteredRooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                className={cn(
                                    "flex items-start gap-3 p-3 rounded-xl text-left transition-all border border-transparent",
                                    selectedRoom?.id === room.id
                                        ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800",
                                    room.status === 'resolved' && "opacity-60 grayscale"
                                )}
                            >
                                <Avatar className="h-10 w-10 border border-slate-200">
                                    <AvatarFallback className={cn(
                                        "font-bold text-white",
                                        room.topic === 'Teknik Destek' ? "bg-blue-500" :
                                            room.topic === 'Ödeme & Üyelik' ? "bg-green-500" :
                                                room.topic === 'Öneri & İstek' ? "bg-orange-500" : "bg-slate-400"
                                    )}>
                                        {room.userName?.substring(0, 1).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                            {room.userName || `User #${room.id}`}
                                        </span>
                                        {room.lastMessageTime && (
                                            <span className="text-[10px] text-slate-400">
                                                {formatDistanceToNow(room.lastMessageTime.toDate(), { addSuffix: false, locale: tr }).replace('yaklaşık ', '')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {room.topic && (
                                            <Badge variant="outline" className="h-4 px-1 text-[9px] border-slate-200 text-slate-500">
                                                {room.topic}
                                            </Badge>
                                        )}
                                        {room.subscriptionTier === 'premium' && (
                                            <Badge variant="default" className="h-4 px-1 text-[9px] bg-gradient-to-r from-indigo-500 to-purple-500 border-none">PREMIUM</Badge>
                                        )}
                                        {room.status === 'resolved' && (
                                            <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-slate-200 text-slate-600">KAPALI</Badge>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-xs truncate",
                                        room.unreadCount > 0 ? "font-bold text-slate-900" : "text-slate-500"
                                    )}>{room.lastMessage}</p>
                                </div>
                                {room.unreadCount > 0 && (
                                    <div className="h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                        {room.unreadCount}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* 2. CENTER PANEL: Chat Window */}
            <Card className="flex-1 flex flex-col border-none shadow-none dark:bg-slate-900/20 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                {selectedRoom ? (
                    <>
                        <CardHeader className="bg-white dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 hover:text-slate-900 -ml-2"
                                    onClick={() => setSelectedRoom(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">{selectedRoom.userName?.substring(0, 1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        {selectedRoom.userName}
                                        {selectedRoom.status !== 'resolved' ? (
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        ) : (
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">KAPALI</span>
                                        )}
                                    </CardTitle>
                                    <p className="text-xs text-slate-500">{selectedRoom.userEmail || `ID: ${selectedRoom.id}`}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors mr-2"
                                    onClick={handleDeleteChatHistory}
                                    title="Sohbet geçmişini kalıcı olarak sil"
                                >
                                    <AlertCircle className="h-4 w-4 mr-1" /> Sil
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                    onClick={handleCloseRequest}
                                    disabled={selectedRoom.status === 'resolved'}
                                >
                                    {selectedRoom.status === 'resolved' ? 'Talep Kapalı' : 'Talebi Kapat'}
                                </Button>
                            </div>
                        </CardHeader>

                        <div className="flex-1 overflow-hidden relative">
                            {/* Chat Area */}
                            <ScrollArea className="h-full p-4">
                                <div className="space-y-4 max-w-3xl mx-auto">
                                    {messages.map((message) => {
                                        const isAdmin = message.senderId === 'admin';
                                        return (
                                            <div key={message.id} className={cn("flex w-full", isAdmin ? "justify-end" : "justify-start")}>
                                                <div className={cn("flex flex-col max-w-[75%]", isAdmin ? "items-end" : "items-start")}>
                                                    <div className={cn(
                                                        "px-4 py-2 rounded-2xl text-sm shadow-sm",
                                                        isAdmin ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none"
                                                    )}>
                                                        {message.text}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                                                        {message.timestamp ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true, locale: tr }) : '...'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-3xl mx-auto">
                                <Input
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Bir mesaj yazın..."
                                    className="flex-1 bg-slate-50 border-slate-200 rounded-xl"
                                />
                                <Button type="submit" size="icon" disabled={!newMessage.trim() || sending} className="bg-indigo-600 rounded-xl hover:bg-indigo-700">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
                        <p>Bir görüşme seçin</p>
                    </div>
                )}
            </Card>

            {/* 3. RIGHT PANEL: User Profile & Actions */}
            {selectedRoom && (
                <Card className="w-[300px] shrink-0 border-none shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none dark:bg-slate-900/50 rounded-2xl overflow-hidden flex flex-col">
                    <CardHeader className="p-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Kullanıcı Profili</CardTitle>
                    </CardHeader>
                    {loadingProfile ? (
                        <div className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : userProfile ? (
                        <div className="flex-1 flex flex-col p-4 gap-6 overflow-y-auto bg-white dark:bg-slate-900/30">
                            {/* Profile Header */}
                            <div className="text-center">
                                <Avatar className="h-20 w-20 mx-auto mb-3 border-4 border-slate-50 dark:border-slate-800">
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold">
                                        {userProfile.name.substring(0, 1).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{userProfile.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{userProfile.email}</p>

                                <div className="flex justify-center gap-2">
                                    <Badge variant={(userProfile.is_pro || userProfile.subscription_tier === 'premium') ? 'default' : 'secondary'} className="uppercase text-[10px]">
                                        {userProfile.subscription_tier || 'FREE'}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] border-slate-200">
                                        ID: {userProfile.id}
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            {/* Details Grid */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-2"><CreditCard className="h-3.5 w-3.5" /> Üyelik</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                        {userProfile.subscription_expires_at ? new Date(userProfile.subscription_expires_at).toLocaleDateString() : 'Yok'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Kayıt</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                        {new Date(userProfile.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Cihaz</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]" title={selectedRoom.deviceInfo}>
                                        {selectedRoom.deviceInfo ? selectedRoom.deviceInfo.split('(')[0] : 'Web'}
                                        {userProfile.device_change_count !== undefined && (
                                            <span className={cn("ml-1 text-xs", (userProfile.device_change_count || 0) > 3 ? "text-red-500 font-bold" : "text-slate-400")}>
                                                ({userProfile.device_change_count})
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            {/* Actions */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hızlı Aksiyonlar</p>

                                <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start gap-2 h-9 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-600">
                                            <Lock className="h-3.5 w-3.5" /> Şifre Sıfırla
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Şifre Sıfırla</DialogTitle>
                                            <DialogDescription>Kullanıcı için yeni geçici şifre belirleyin.</DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4 space-y-3">
                                            <Input
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                placeholder="Yeni şifre..."
                                            />
                                            <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30">
                                                Dikkat: Bu işlem sadece yerel şifreyi değiştirir. Güvenlik gereği, kullanıcı bu işlemden sonra eski şifresiyle 24 saat boyunca giriş yapamaz.
                                            </p>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleResetPassword} className="bg-indigo-600 text-white">Kaydet ve Gönder</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2 h-9 text-xs font-semibold border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                                    onClick={handleGiftPremium}
                                >
                                    <CreditCard className="h-3.5 w-3.5" /> 7 Gün Hediye Et
                                </Button>

                                <Button variant="outline" className="w-full justify-start gap-2 h-9 text-xs font-semibold border-red-200 hover:bg-red-50 text-red-600">
                                    <Shield className="h-3.5 w-3.5" /> Hesabı Dondur
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2 h-9 text-xs font-semibold border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700"
                                    onClick={async () => {
                                        if (!confirm("Kullanıcının cihaz kilidini kaldırmak ve oturumunu sıfırlamak istiyor musunuz?")) return;
                                        try {
                                            await adminApi.resetDeviceLock(userProfile.id);
                                            safeToast.success("Cihaz kilidi kaldırıldı.");
                                            // Refresh
                                            const data = await adminApi.getUserDetails(userProfile.id);
                                            if (data && 'id' in data) setUserProfile(data);
                                        } catch (e) {
                                            console.error(e);
                                            safeToast.error("İşlem başarısız.");
                                        }
                                    }}
                                >
                                    <Lock className="h-3.5 w-3.5" /> Cihaz Kilidini Sıfırla
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
                            <AlertCircle className="h-10 w-10 opacity-30" />
                            <p className="text-sm">Kullanıcı profili bulunamadı veya anonim.</p>
                            <Button size="sm" variant="outline" onClick={() => {/* handle manual link */ }}>Manuel Ara</Button>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
