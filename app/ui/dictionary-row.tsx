"use client";

import { Entry } from "@/app/lib/ja_dict";
import IconButton from "./icon-button";
import { deleteVocabulary, insertVocabulary } from "@/app/lib/vocabulary";
import { User } from "@supabase/auth-js";
import { Dispatch, SetStateAction } from "react";
import { DictionaryModalData } from "./dictionary-modal";
import { BookmarkSlashIcon, BookOpenIcon } from "@heroicons/react/24/outline";

export function featureDisplay(feature: string): string {
  if (feature.startsWith("ichi")) {
    return "common";
  } else if (feature.startsWith("news")) {
    return "news";
  } else if (feature.startsWith("spec")) {
    return "special";
  } else {
    return "";
  }
}

export default function DictionaryRow({
  user,
  entry,
  setModal,
}: {
  user: User;
  entry: Entry;
  setModal: Dispatch<SetStateAction<DictionaryModalData | null>>;
}) {
  return (
    <div className="relative w-full flex py-1 gap-6">
      <IconButton
        icon={entry.saved ? BookmarkSlashIcon : BookOpenIcon}
        text={entry.saved ? "Unsave" : "Save"}
        onClick={handleVocab}
        className={
          entry.saved
            ? "absolute top-1 right-0 text-primary rounded-full px-2"
            : "absolute top-1 right-0 bg-primary text-onprimary rounded-full px-2"
        }
      />
      {/* Left side, word + featured + readings */}
      <div className="flex flex-col items-center shrink-0 pt-2">
        <p className="font-light text-xs text-gray-800">
          {entry.readings.at(-1)}
        </p>
        <div className="px-2 rounded-full border border-primary">
          {entry.word}
        </div>
        {entry.featured.map((feature, i) => (
          <div
            key={`feature-${i}`}
            className="px-2 rounded-full bg-green-700 text-white text-xs"
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
    </div>
  );

  /** Insert/Delete vocab record. Update local state if successful */
  async function handleVocab() {
    const wasSaved = !!entry.saved;
    setSaved(!entry.saved);
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

  function setSaved(value: boolean) {
    setModal((modal) => {
      if (!modal?.entries?.length) {
        return modal;
      }

      return {
        ...modal,
        entries: modal.entries.map((e) =>
          e.id != entry.id
            ? e
            : {
                ...e,
                saved: value,
              }
        ),
      };
    });
  }
}
