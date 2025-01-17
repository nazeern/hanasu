"use client";

import { Entry } from "@/app/lib/data";
import DictionaryRow from "./dictionary-row";
import { User } from "@supabase/auth-js";
import { Dispatch, SetStateAction } from "react";

export type DictionaryModalData = {
  word: string | null;
  entries: Entry[] | null;
};

function renderWord(word: string | null) {
  if (word) {
    return (
      <div className="rounded-full px-4 py-1 bg-primary text-onprimary">
        {word}
      </div>
    );
  } else {
    return (
      <div className="bg-slate-400/50 my-2 h-4 w-24 rounded-full animate-pulse" />
    );
  }
}

function renderEntries(
  user: User,
  entries: Entry[] | null,
  setModal: Dispatch<SetStateAction<DictionaryModalData | null>>,
  lang: string
) {
  if (entries?.length) {
    return entries.map((entry) => (
      <DictionaryRow
        key={entry.id}
        user={user}
        entry={entry}
        setModal={setModal}
        lang={lang}
      />
    ));
  } else {
    return [
      <div
        key={0}
        className="bg-slate-400/50 m-2 h-4 w-full rounded-full animate-pulse"
      />,
      <div
        key={1}
        className="bg-slate-400/50 m-2 h-4 w-full rounded-full animate-pulse"
      />,
      <div
        key={2}
        className="bg-slate-400/50 m-2 h-4 w-full rounded-full animate-pulse"
      />,
    ];
  }
}

export default function DictionaryModal({
  user,
  word,
  entries,
  setModal,
  lang,
}: {
  user: User;
  word: string | null;
  entries: Entry[] | null;
  setModal: Dispatch<SetStateAction<DictionaryModalData | null>>;
  lang: string;
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-screen max-h-96 shadow-2xl rounded-b-3xl bg-white flex flex-col items-center gap-4 p-4 divide-y overflow-y-scroll"
    >
      {renderWord(word)}
      {renderEntries(user, entries, setModal, lang)}
    </div>
  );
}
