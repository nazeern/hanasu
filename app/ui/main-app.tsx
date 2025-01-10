"use client";

import { User } from "@supabase/auth-js";
import { BlurBottom, BlurTop } from "@/app/ui/blur";
import Chat, { ChatMessageData, sampleChatMessages } from "@/app/ui/chat"; // eslint-disable-line
import ProfileIcon from "@/app/ui/profile-icon";
import { useState } from "react";
import IconButton from "@/app/ui/icon-button";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { LogoTitle } from "./logo";

export default function MainApp({
  user,
  lang,
  loadedChatMessages,
}: {
  user: User;
  lang: string;
  loadedChatMessages: ChatMessageData[];
}) {
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>(
    loadedChatMessages.map((msg) => ({
      ...msg,
      content: msg.content.replace("～", ""),
    }))
  );

  return (
    <div className="flex flex-col h-dvh w-screen px-1 py-2">
      <BlurTop />
      <BlurBottom />
      <div className="flex items-center justify-between px-2 py-2">
        <IconButton
          className="py-1"
          href="/dashboard"
          text="Back"
          icon={ChevronLeftIcon}
        />
        <LogoTitle />
        <ProfileIcon initial={user.user_metadata?.name[0]} />
      </div>
      <Chat
        user={user}
        lang={lang}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />
    </div>
  );
}
