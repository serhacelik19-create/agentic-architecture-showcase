"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, Minimize2, Bot } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { AnimatePresence, motion } from "framer-motion";
import { getChatBotResponse } from "@/app/actions/chatbot";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
    actions?: { label: string; url: string }[];
    payload?: any;
};

export function SmartAssistant() {
    const { t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init-1', text: t("bot.greeting"), sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const SUGGESTIONS = [
        { label: `🍽️ ${t("bot.food")}`, query: "Yemek menüsü" },
        { label: `📅 ${t("bot.calendar")}`, query: "Akademik takvim" },
        { label: `🚌 ${t("bot.transport")}`, query: "Kampüse ulaşım" },
    ];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleSend = async (textOffset?: string) => {
        const textToSend = textOffset || input;
        if (!textToSend.trim()) return;

        const userMsg: Message = { id: `user-${Date.now()}`, text: textToSend, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(async () => {
            const botResponse = await getChatBotResponse(textToSend);

            setMessages(prev => [...prev, {
                id: `bot-${Date.now()}`,
                text: botResponse.text,
                sender: "bot",
                actions: botResponse.actions,
            }]);

            setIsTyping(false);
        }, 600 + Math.random() * 400);
    };

    const pathname = usePathname();
    const isHidden = pathname?.startsWith("/admin");

    if (!isMounted || isHidden) return null;

    return (
        <>
            <AnimatePresence>
                {/* Floating Action Button */}
                <motion.div
                    key="fab"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="fixed bottom-6 right-6 z-50"
                >
                    <Button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-white/20",
                            isOpen
                                ? "bg-slate-800 hover:bg-slate-900 rotate-90"
                                : "bg-gradient-to-tr from-blue-600 to-indigo-600 hover:shadow-blue-500/50"
                        )}
                    >
                        {isOpen ? <X className="h-8 w-8 text-white" /> : <Sparkles className="h-8 w-8 text-white animate-pulse" />}
                    </Button>
                </motion.div>

                {/* Chat Interface */}
                {isOpen && (
                    <motion.div
                        key="chat-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-28 right-4 md:right-6 w-[92vw] md:w-[400px] bg-white opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ring-1 ring-black/5 z-50 overflow-hidden flex flex-col max-h-[700px] h-[80vh] md:h-[600px]"
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-4 pt-5 pb-16 overflow-hidden shrink-0">
                            {/* Decorative Circles */}
                            <div className="absolute top-[-50%] left-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-indigo-400/20 rounded-full blur-xl"></div>

                            <div className="relative z-10 flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg tracking-tight">DÜ Asistan</h3>
                                        <div className="flex items-center gap-1.5 opacity-90">
                                            <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse"></span>
                                            <span className="text-xs font-medium text-blue-50">{t("bot.online")}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-5 -mt-8 pt-10 bg-gradient-to-b from-transparent to-slate-50">
                            {messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} />
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 w-full"
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-600/90 border border-blue-500 text-white shadow-md">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions */}
                        {messages.length < 3 && (
                            <div className="px-4 pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2">
                                {SUGGESTIONS.map((s, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(s.query)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100/80 text-slate-600 border border-slate-200 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[1.25rem] border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={t("bot.placeholder")}
                                    className="flex-1 bg-transparent border-none px-4 text-sm focus:outline-none text-slate-800 placeholder:text-slate-400"
                                />
                                <Button
                                    size="icon"
                                    className={cn(
                                        "rounded-full h-10 w-10 transition-all shadow-sm",
                                        input.trim()
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : "bg-white text-slate-300 hover:bg-white pointer-events-none"
                                    )}
                                    onClick={() => handleSend()}
                                    disabled={!input.trim()}
                                >
                                    {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                                </Button>
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                                    Dicle Üniversitesi Yapay Zeka Destekli Asistan
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
