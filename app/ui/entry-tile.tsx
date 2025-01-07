"use client";

import { Entry } from "@/app/lib/ja_dict";
import { featureDisplay } from "@/app/ui/dictionary-row";
import { User } from "@supabase/auth-js";
import IconButton from "./icon-button";
import { useState } from "react";
import { deleteVocabulary, insertVocabulary } from "@/app/lib/vocabulary";
import { BookmarkSlashIcon, BookOpenIcon } from "@heroicons/react/24/outline";

export default function EntryTile({
  user,
  entry,
  includeDefinitions = true,
}: {
  user: User;
  entry: Entry;
  includeDefinitions?: boolean;
}) {
  const [saved, setSaved] = useState<boolean>(true);
  return (
    <div className="relative w-5/6 flex justify-center gap-6 p-4 border border-primary rounded-xl">
      <IconButton
        icon={saved ? BookmarkSlashIcon : BookOpenIcon}
        text={saved ? "Unsave" : "Save"}
        onClick={handleVocab}
        className={
          saved
            ? "absolute top-1 right-0 text-primary rounded-full px-2"
            : "absolute top-1 right-0 bg-primary text-onprimary rounded-full px-2"
        }
      />
      <div className="flex flex-col items-center shrink-0 pt-2">
        <p className="font-light text-xs text-gray-800">
          {entry.readings.at(-1)}
        </p>
        <div className="px-2 rounded-full border border-primary text-xl mb-1">
          {entry.word}
        </div>
        {entry.featured.map((feature, i) => (
          <div
            key={`feature-${i}`}
            className="px-2 rounded-full bg-green-700 text-white text-sm"
          >
            {featureDisplay(feature)}
          </div>
        ))}
        <div>
          {entry.readings.slice(1, -1).map((reading, i) => (
            <p
              key={`reading-${i}`}
              className="font-light text-sm text-gray-800"
            >
              {reading}
            </p>
          ))}
        </div>
      </div>
      {/* Right side, definitions */}
      {includeDefinitions && (
        <div className="pt-6">
          <div className="w-fit px-2 rounded-full bg-gray-300 text-xs">
            {entry.definitions[0].tags[0]}
          </div>
          <ol>
            {entry.definitions.map((dfn, i) => {
              return (
                <li key={`definition-${i}`} className="list-decimal">
                  {dfn.meanings.join("; ")}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );

  /** Insert/Delete vocab record. Update local state if successful */
  async function handleVocab() {
    const wasSaved = saved;
    setSaved(!saved);
    let success = false;
    if (wasSaved) {
      success = await deleteVocabulary(user.id, entry.id);
    } else {
      success = await insertVocabulary(user.id, entry.id);
    }
    if (!success) {
      setSaved(wasSaved);
    }
  }
}
