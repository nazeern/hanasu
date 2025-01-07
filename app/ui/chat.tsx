"use client";

import ChatMessage from "@/app/ui/chat-message";
import { Dispatch, SetStateAction } from "react";
import { User } from "@supabase/auth-js";

export type ChatMessageData = {
  id: string;
  from: "user" | "assistant";
  content: string;
  hidden?: boolean;
  translated?: string;
  romanized?: string;
};

export const sampleChatMessages: ChatMessageData[] = [
  {
    id: "SG_e4b9f7d98311",
    from: "user",
    content: "Hello",
    hidden: true,
  },
  {
    id: "SG_f4b9f7d98311",
    from: "assistant",
    content: " \u4f55\u304b\u304a\u624b\u4f1d\u3044\u3057\u307e",
    hidden: true,
    // romanized: "nanka otetsudai shimasu ka",
    // translated: "How can I help you?",
  },
];

export default function Chat({
  user,
  lang,
  chatMessages,
  setChatMessages,
}: {
  user: User;
  lang: string;
  chatMessages: ChatMessageData[];
  setChatMessages: Dispatch<SetStateAction<ChatMessageData[]>>;
}) {
  return (
    <div className="grow flex flex-col-reverse gap-3 overflow-y-scroll">
      {chatMessages.toReversed().map((msg) => (
        <ChatMessage
          user={user}
          key={msg.id}
          lang={lang}
          message={msg}
          setChatMessages={setChatMessages}
        />
      ))}
    </div>
  );
}
