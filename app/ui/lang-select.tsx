"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import IconButton from "./icon-button";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Tables } from "@/database.types";
import { updateProfile } from "../lib/profiles";

type LangInfo = {
  lang: string;
  flag: string;
  name: string;
  canRomanize?: boolean;
  supportsDict?: boolean;
};

export const langInfo: LangInfo[] = [
  {
    lang: "ja",
    flag: "🇯🇵",
    name: "Japanese",
    canRomanize: true,
    supportsDict: true,
  },
  {
    lang: "zh-CN",
    flag: "🇨🇳",
    name: "Chinese",
  },
  {
    lang: "es",
    flag: "🇪🇸",
    name: "Spanish",
  },
  {
    lang: "de",
    flag: "🇩🇪",
    name: "German",
  },
  {
    lang: "ta",
    flag: "🇮🇳",
    name: "Tamil",
  },
  {
    lang: "hi",
    flag: "🇮🇳",
    name: "Hindi",
    canRomanize: true,
  },
  {
    lang: "ru",
    flag: "🇷🇺",
    name: "Russian",
    canRomanize: true,
  },
  {
    lang: "uk",
    flag: "🇺🇦",
    name: "Ukrainian",
    canRomanize: true,
  },
  {
    lang: "ar",
    flag: "🇦🇪",
    name: "Arabic",
    canRomanize: true,
  },
  {
    lang: "ml",
    flag: "🇮🇳",
    name: "Malayalam",
  },
];

export default function LangSelect({
  profile,
  lang,
}: {
  profile: Tables<"profiles">;
  lang: string;
}) {
  const [currLang, setCurrLang] = useState<string | null>(lang);
  const [showingDropdown, setShowingDropdown] = useState<boolean>(false);
  const currInfo = langInfo.find((info) => info.lang == currLang);

  if (!currLang) {
    return (
      <div className="bg-slate-400/50 m-2 h-4 w-10 rounded-full animate-pulse" />
    );
  }

  return (
    <div>
      <IconButton
        icon={showingDropdown ? ChevronUpIcon : ChevronDownIcon}
        text={currInfo?.flag}
        onClick={() => setShowingDropdown((showing) => !showing)}
        className="text-3xl"
      />
      {showingDropdown && (
        <div className="shrink-0 flex items-center gap-6 fixed top-16 left-0 h-24 w-screen bg-white border-y border-primary px-2 py-1 overflow-x-scroll">
          {langInfo.map((info) => (
            <div
              key={info.lang}
              onClick={() => updateLang(info.lang)}
              className="flex flex-col items-center"
            >
              <p className="text-6xl">{info.flag}</p>
              <p className="text-lg">{info.name}</p>
            </div>
          ))}
          <div className="pt-3">
            <PlusCircleIcon className="size-10 mx-auto" />
            <p className="mt-2 text-lg">Add</p>
          </div>
        </div>
      )}
    </div>
  );

  async function updateLang(newLang: string) {
    console.log("update lang");
    const ogLang = currLang;
    setCurrLang(null);
    const success = await updateProfile({ ...profile, lang: newLang });
    if (!success) {
      setCurrLang(ogLang);
    } else {
      setCurrLang(newLang);
    }
    setShowingDropdown(false);
  }
}
