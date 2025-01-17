"use client";

import IconButton from "@/app/ui/icon-button";
import Divider from "@/app/ui/divider";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { Entry } from "@/app/lib/data";
import EntryTile from "@/app/ui/entry-tile";
import { User } from "@supabase/auth-js";

export default function Topics({
  user,
  topics,
  entry,
  lang,
}: {
  user: User;
  topics: string[];
  entry: Entry | null;
  lang: string;
}) {
  return (
    <div className="grow flex flex-col gap-8 items-center justify-center pt-12 pb-48 px-4">
      <p className="text-lg">PRACTICE CONVERSATION</p>
      {topics.map((topic, i) => {
        const searchParams = new URLSearchParams();
        searchParams.set("topic", topic);
        return (
          <IconButton
            className="px-4 py-2 bg-primary text-onprimary rounded-full"
            key={`topic-${i}`}
            href={`/chat?${searchParams.toString()}`}
            text={topic + " →"}
          />
        );
      })}
      {entry && (
        <>
          <Divider />
          <EntryTile
            user={user}
            entry={entry}
            includeDefinitions={false}
            lang={lang}
          />
          <IconButton
            icon={BookOpenIcon}
            text="Review your Vocabulary"
            className="px-4 py-2 bg-primary text-onprimary rounded-full"
            href="/review"
          />
        </>
      )}
    </div>
  );
}
