"use client";

import { BlurBottom, BlurTop } from "@/app/ui/blur";
import { User } from "@supabase/auth-js";
import ProfileIcon from "./profile-icon";
import Topics from "@/app/ui/topics";
import { Entry } from "@/app/lib/ja_dict";
import { LogoTitle } from "./logo";
import LangSelect from "@/app/ui/lang-select";
import { Tables } from "@/database.types";

const topics = [
  "What is your favorite food?",
  "Do you have any hobbies?",
  "Tell me about your day.",
];

export default function DashboardPage({
  user,
  profile,
  entry,
}: {
  user: User;
  profile: Tables<"profiles">;
  entry: Entry | null;
}) {
  return (
    <div className="flex flex-col h-screen w-screen px-1 py-2">
      <BlurTop />
      <BlurBottom />
      <div className="flex items-start justify-between px-2 py-2">
        <LangSelect profile={profile} lang={profile.lang} />
        <LogoTitle />
        <ProfileIcon initial={user.user_metadata?.name[0]} />
      </div>
      <Topics user={user} topics={topics} entry={entry} />
    </div>
  );
}
