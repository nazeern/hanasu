"use client";

import { ChatMessageData } from "@/app/ui/chat";
import { cn } from "@/app/lib/utils";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { romanizeText, translateText } from "@/app/lib/chat";
import { User } from "@supabase/auth-js";
import { PopupWrapper } from "@/app/ui/popup-wrapper";
import DictionaryModal, {
  DictionaryModalData,
} from "@/app/ui/dictionary-modal";
import { selectVocabulary } from "@/app/lib/vocabulary";
import { langInfo, selectDict } from "@/app/lib/data";
import GrammarAssist from "@/app/ui/grammar-assist";

let timeout: ReturnType<typeof setTimeout> | null = null;

export default function ChatMessage({
  id,
  user,
  lang,
  message,
  setChatMessages,
}: {
  id?: string;
  user: User;
  lang: string;
  message: ChatMessageData;
  setChatMessages: Dispatch<SetStateAction<ChatMessageData[]>>;
}) {
  const p = useRef<HTMLParagraphElement | null>(null);
  const [modal, setModal] = useState<DictionaryModalData | null>(null);
  const content = message.hidden ? "●".repeat(5) : message.content;
  const info = langInfo.find((info) => info.lang == lang);

  function render(value: string | undefined) {
    if (value == "loading") {
      return (
        <div>
          <div className="bg-slate-400/50 my-2 h-2 w-32 rounded-full animate-pulse"></div>
        </div>
      );
    } else if (value) {
      return <p className="py-1">{value}</p>;
    } else {
      return null;
    }
  }

  return (
    <>
      {message.grammar && <GrammarAssist message={message.grammar} />}
      <div
        id={id}
        onClick={handleClick}
        className={cn(
          "flex flex-col py-1 px-4 rounded-xl max-w-11/12 divide-y",
          {
            "self-start bg-gray-300 text-black": message.from == "assistant",
            "self-end bg-primary text-onprimary": message.from == "user",
          }
        )}
      >
        {modal && (
          <PopupWrapper hideModal={() => setModal(null)}>
            <DictionaryModal
              user={user}
              word={modal.word}
              entries={modal.entries}
              setModal={setModal}
              lang={lang}
            />
          </PopupWrapper>
        )}
        {content && (
          <p ref={p} className="py-1">
            {content}
          </p>
        )}
        {render(message.romanized)}
        {render(message.translated)}
      </div>
    </>
  );

  /** Detect two clicks within milliseconds, else treat as single click.
   * The tapped text should match the main message content.
   */
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!timeout) {
      timeout = setTimeout(() => {
        if ((e.target as HTMLDivElement).textContent == message.content) {
          onSingleTap();
        }
        timeout = null;
      }, 300);
    } else {
      clearTimeout(timeout);
      timeout = null;
      onDoubleTap();
    }
  }

  async function onSingleTap() {
    if (!info?.supportsDict) {
      return;
    }
    // Show dictionary loading UI
    setModal({ entries: null, word: null });

    // Parse word and fetch dictionary entries
    const selection = getSelection();
    const tap = selection?.focusOffset;
    if (tap == undefined) {
      return;
    }
    const [entries, parsed] = await selectDict(lang, message.content, tap);

    // Check which entries users already saved
    const wordIds = entries?.map((e) => e.id) ?? [];
    const vocab = await selectVocabulary(user.id, wordIds, lang);
    const savedIds = vocab.map((v) => v.word_id);
    entries?.forEach((e) => {
      if (savedIds.includes(e.id)) {
        e.saved = true;
      } else {
        e.saved = false;
      }
    });

    // Highlight the parsed word
    if (p.current && parsed) {
      const range = document.createRange();
      range.setStart(p.current.firstChild!, parsed.start!);
      range.setEnd(p.current.firstChild!, parsed.end!);

      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    // Open dictionary modal
    const word = parsed
      ? message.content.slice(parsed.start, parsed.end)
      : null;
    setModal({
      entries: entries,
      word: word,
    });
    return;
  }

  async function onDoubleTap() {
    if (message.hidden) {
      revealChatMessage();
    } else if (info?.canRomanize && !message.romanized) {
      romanizeChatMessage();
    } else if (!message.translated) {
      translateChatMessage();
    }
  }

  function revealChatMessage() {
    setChatMessages((chat) =>
      chat.map((msg) =>
        msg.id != message.id ? msg : { ...msg, hidden: false }
      )
    );
  }

  async function romanizeChatMessage() {
    const text = message.content;
    setChatMessages((chatMessages) =>
      chatMessages.map((msg) =>
        msg.id == message.id ? { ...msg, romanized: "loading" } : msg
      )
    );

    const romanized = await romanizeText(text, user.id, lang);

    setChatMessages((chatMessages) =>
      chatMessages.map((msg) =>
        msg.id == message.id ? { ...msg, romanized: romanized } : msg
      )
    );
  }

  async function translateChatMessage() {
    const text = message.content;
    setChatMessages((chatMessages) =>
      chatMessages.map((msg) =>
        msg.id == message.id ? { ...msg, translated: "loading" } : msg
      )
    );

    const translated = await translateText(text, lang);

    setChatMessages((chatMessages) =>
      chatMessages.map((msg) =>
        msg.id == message.id ? { ...msg, translated: translated } : msg
      )
    );
  }
}
