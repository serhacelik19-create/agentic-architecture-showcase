"use client";

import React, { useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useSearch } from "@/hooks/useSearch";
import { SidebarTab } from "@/lib/types";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatPanel from "@/components/chat/ChatPanel";
import CopilotPanel from "@/components/copilot/CopilotPanel";
import MobileSimulator from "@/components/simulator/MobileSimulator";
import { useToast } from "@/components/ui/Toast";

export default function DashboardPage() {
  const {
    isConnected,
    conversations,
    selectedId,
    setSelectedId,
    isGenerating,
    sendMessage,
    resolveTicket,
    triggerSimulator,
    redraft,
    sendSimulatorMsg,
  } = useSocket();

  const { searchQuery, setSearchQuery, filteredConversations } = useSearch(conversations);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("open");
  const [showSimulator, setShowSimulator] = useState(true);
  const [replyFromDraft, setReplyFromDraft] = useState("");
  const { addToast } = useToast();

  const activeTicket = conversations.find((c) => c.id === selectedId) || null;
  const isLoading = !isConnected && conversations.length === 0;

  const handleApplyDraft = (draft: string) => {
    setReplyFromDraft(draft);
  };

  const handleSendDirect = (conversationId: string, content: string) => {
    sendMessage(conversationId, content);
    addToast("AI draft sent directly", "success");
  };

  const handleSimulatorSend = (content: string) => {
    if (!selectedId) return;
    sendSimulatorMsg(selectedId, content);
  };

  return (
    <div className="app-container">
      <Sidebar
        conversations={filteredConversations}
        selectedId={selectedId}
        sidebarTab={sidebarTab}
        isConnected={isConnected}
        searchQuery={searchQuery}
        onSelectTicket={setSelectedId}
        onTabChange={setSidebarTab}
        onTriggerSimulator={triggerSimulator}
        onSearchChange={setSearchQuery}
        isLoading={isLoading}
      />

      <ChatPanel
        activeTicket={activeTicket}
        isGenerating={isGenerating}
        showSimulator={showSimulator}
        draftToApply={replyFromDraft}
        onDraftApplied={() => setReplyFromDraft("")}
        onToggleSimulator={() => setShowSimulator(!showSimulator)}
        onSendMessage={sendMessage}
        onResolveTicket={resolveTicket}
      />

      <section className="copilot-panel-wrapper">
        <CopilotPanel
          activeTicket={activeTicket}
          conversations={conversations}
          isGenerating={isGenerating}
          onRedraft={redraft}
          onApplyDraft={handleApplyDraft}
          onSendDirect={handleSendDirect}
        />

        {activeTicket && showSimulator && (
          <MobileSimulator
            customer={activeTicket.customer}
            onSendMessage={handleSimulatorSend}
          />
        )}
      </section>
    </div>
  );
}
