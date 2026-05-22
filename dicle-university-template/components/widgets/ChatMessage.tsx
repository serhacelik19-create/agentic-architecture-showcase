"use client";

import { motion } from "framer-motion";
import { User, Bot, Utensils, MapPin, Calendar, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface ChatMessageProps {
    message: {
        id: string;
        text: string;
        sender: "user" | "bot";
        actions?: { label: string; url: string }[];
        payload?: any;
    };
}

// Helper to parsing basic bold markdown
const renderMarkdown = (text: string) => {
    // Regex for **bold**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
};

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.sender === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
                "flex gap-3 w-full",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md backdrop-blur-sm border",
                    isUser
                        ? "bg-slate-200/80 border-slate-300 text-slate-700"
                        : "bg-blue-600/90 border-blue-500 text-white shadow-blue-500/20"
                )}
            >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="flex flex-col gap-2 max-w-[85%]">
                <div
                    className={cn(
                        "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-md break-words whitespace-pre-wrap",
                        isUser
                            ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-tr-sm"
                            : "bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 rounded-tl-sm shadow-sm"
                    )}
                >
                    {renderMarkdown(message.text)}

                    {/* Rich Payload: Food Menu */}
                    {!isUser && message.payload?.type === 'food_menu' && (
                        <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-400 font-medium text-xs uppercase tracking-wider">
                                <Utensils className="w-3 h-3" />
                                <span>Günün Menüsü ({message.payload.date})</span>
                            </div>
                            <ul className="space-y-1.5 text-xs">
                                {message.payload.items.map((item: any, idx: number) => (
                                    <li key={idx} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                                        <span>{item.name}</span>
                                        <span className="text-slate-400 font-mono text-[10px]">{item.cal} cal</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Rich Payload: Info Card */}
                    {!isUser && message.payload?.type === 'info_card' && (
                        <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300 font-semibold text-sm">
                                {message.payload.title.includes("Ulaşım") ? <MapPin className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                                <span>{message.payload.title}</span>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                {message.payload.content}
                            </div>
                        </div>
                    )}

                    {/* Rich Payload: List */}
                    {!isUser && message.payload?.type === 'list' && (
                        <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                                <Calendar className="w-3 h-3" />
                                <span>{message.payload.title}</span>
                            </div>
                            <ul className="space-y-2">
                                {message.payload.items.map((item: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Actions (Only for Bot) */}
                {!isUser && message.actions && (
                    <div className="flex flex-wrap gap-2">
                        {message.actions.map((action, idx) => (
                            <Link
                                key={idx}
                                href={action.url}
                                className="text-xs bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors shadow-sm font-medium"
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
