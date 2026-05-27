"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Smartphone, MessageSquare } from "lucide-react";
import { Conversation, QuickTemplate } from "@/lib/types";
import { QUICK_TEMPLATES } from "@/lib/constants";
import MessageBubble from "./MessageBubble";
import QuickReplies from "./QuickReplies";
import ChatInput from "./ChatInput";
import TypingIndicator from "@/components/ui/TypingIndicator";
import { useToast } from "@/components/ui/Toast";

interface ChatPanelProps {
  activeTicket: Conversation | null;
  isGenerating: boolean;
  showSimulator: boolean;
  draftToApply?: string;
  onDraftApplied?: () => void;
  onToggleSimulator: () => void;
  onSendMessage: (conversationId: string, content: string) => void;
  onResolveTicket: (conversationId: string) => void;
}

export default function ChatPanel({
  activeTicket,
  isGenerating,
  showSimulator,
  draftToApply,
  onDraftApplied,
  onToggleSimulator,
  onSendMessage,
  onResolveTicket,
}: ChatPanelProps) {
  const [replyContent, setReplyContent] = useState("");
  const messageLogRef = useRef<HTMLDivElement | null>(null);
  const { addToast } = useToast();

  // Auto-scroll on new messages
  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight;
    }
  }, [activeTicket?.messages, isGenerating]);

  // Apply draft from CopilotPanel's "Apply to Input" button
  useEffect(() => {
    if (draftToApply) {
      setReplyContent(draftToApply);
      onDraftApplied?.();
    }
  }, [draftToApply, onDraftApplied]);

  const handleSend = () => {
    if (!activeTicket || !replyContent.trim()) return;
    onSendMessage(activeTicket.id, replyContent);
    setReplyContent("");
    addToast("Message sent", "success");
  };

  const handleResolve = () => {
    if (!activeTicket) return;
    onResolveTicket(activeTicket.id);
    addToast("Ticket marked as resolved", "success");
  };

  const handleApplyTemplate = (text: string) => {
    if (!activeTicket) return;
    const populated = text.replace("{name}", activeTicket.customer.name);
    setReplyContent(populated);
  };

  // Build quick templates with customer name
  const templates: QuickTemplate[] = QUICK_TEMPLATES.map((t) => ({
    label: t.label,
    text: activeTicket ? t.text.replace("{name}", activeTicket.customer.name) : t.text,
  }));

  if (!activeTicket) {
    return (
      <section className="chat-area">
        <div className="empty-state">
          <MessageSquare className="w-14 h-14 empty-state-icon" />
          <h3 className="empty-state-title">No Active Ticket</h3>
          <p className="empty-state-text">
            Select a ticket from the sidebar or trigger a mock ticket to get started.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="chat-area">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-user">
          <div className="chat-header-avatar-wrapper">
            <img
              src={activeTicket.customer.avatar}
              alt={activeTicket.customer.name}
              className="chat-header-avatar"
            />
            <div className={`chat-header-indicator ${activeTicket.customer.channel === "whatsapp" ? "whatsapp" : "web"}`} />
          </div>
          <div>
            <h3 className="chat-header-name">{activeTicket.customer.name}</h3>
            <div className="chat-header-meta">
              <span className="notranslate">
                {activeTicket.customer.channel === "whatsapp" ? "WhatsApp" : "Web Chat"}
              </span>
              <span className="meta-divider">•</span>
              <span className="capitalize">{activeTicket.status}</span>
            </div>
          </div>
        </div>

        <div className="chat-actions">
          {activeTicket.status !== "resolved" && (
            <button onClick={handleResolve} className="btn-resolve">
              <CheckCircle className="w-4 h-4" />
              Resolve
            </button>
          )}
          <button
            onClick={onToggleSimulator}
            className={`btn-secondary ${showSimulator ? "active" : ""}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="message-log" ref={messageLogRef}>
        <div className="message-bubble-wrapper system">
          <div className="message-bubble notranslate">
            Conversation started • AI Copilot Online
          </div>
        </div>

        {activeTicket.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} customer={activeTicket.customer} />
        ))}

        {isGenerating && (
          <div className="message-bubble-wrapper customer">
            <div className="message-avatar-container">
              <img
                src={activeTicket.customer.avatar}
                alt={activeTicket.customer.name}
                className="chat-bubble-avatar"
              />
            </div>
            <div className="message-content-wrapper">
              <span className="message-sender-name">AI is generating draft...</span>
              <div className="message-bubble" style={{ padding: "4px" }}>
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Replies */}
      {activeTicket.status !== "resolved" && (
        <QuickReplies templates={templates} onApply={handleApplyTemplate} />
      )}

      {/* Input */}
      <ChatInput
        value={replyContent}
        onChange={setReplyContent}
        onSend={handleSend}
        isResolved={activeTicket.status === "resolved"}
        customerName={activeTicket.customer.name}
      />
    </section>
  );
}
