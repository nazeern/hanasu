"use client";

import { BlurBottom, BlurTop } from "@/app/ui/blur";
import { User } from "@supabase/auth-js";
import ProfileIcon from "./profile-icon";
import Topics from "@/app/ui/topics";
import { Entry } from "@/app/lib/ja_dict";
import { LogoTitle } from "./logo";
import LangSelect from "@/app/ui/lang-select";
import { Tables } from "@/database.types";
import IconButton from "./icon-button";
import { useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";

const topics = [
  "What is your favorite food?",
  "Do you have any hobbies?",
  "Tell me about your day.",
];

export default function DashboardPage({
  user,
  profile,
  entry,
  message,
}: {
  user: User;
  profile: Tables<"profiles">;
  entry: Entry | null;
  message?: string;
}) {
  const [msg, setMsg] = useState<string>(message ?? "");

  return (
    <div className="flex flex-col h-dvh w-screen px-1 py-2">
      <BlurTop />
      <BlurBottom />
      <div className="flex items-start justify-between px-2 py-2">
        <LangSelect profile={profile} lang={profile.lang} />
        <LogoTitle />
        <ProfileIcon initial={user.user_metadata?.name[0]} />
      </div>
      {msg && (
        <IconButton
          icon={XCircleIcon}
          text={msg}
          onClick={() => setMsg("")}
          className="mx-auto px-2 py-1 rounded-lg bg-primarybg text-primary border border-primary"
        />
      )}
      <Topics user={user} topics={topics} entry={entry} />
    </div>
  );
}
