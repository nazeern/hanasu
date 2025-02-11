"use client";

import { Tables } from "@/database.types";
import { BlurBottom, BlurTop } from "./blur";
import { LogoTitle } from "./logo";
import { User } from "@supabase/auth-js";
import { useState } from "react";
import IconButton from "./icon-button";

type OnboardInfo = {
  title: string;
  description: string;
  src: string;
};

const onboardInfo: OnboardInfo[] = [
  {
    src: "videos/hanasu-tutorial1.mp4",
    title: "CHAT",
    description: "Choose from a rotating set of topics and have a conversation",
  },
  {
    src: "videos/hanasu-tutorial2.mp4",
    title: "LEARN",
    description: "Double tap to reveal, romanize, or translate the message",
  },
  {
    src: "videos/hanasu-tutorial3.mp4",
    title: "SEARCH",
    description:
      "Single tap a word to search the dictionary and save to your vocabulary",
  },
  {
    src: "videos/hanasu-tutorial4.mp4",
    title: "REVIEW",
    description: "Retain vocabulary with science-backed spaced repetition",
  },
];

export default function OnboardPage({
  user, // eslint-disable-line
  profile, // eslint-disable-line
}: {
  user: User;
  profile: Tables<"profiles">;
}) {
  const [page, setPage] = useState<number>(0); // eslint-disable-line
  const info = onboardInfo[page];
  const end = onboardInfo.length - 1;
  return (
    <div className="mx-auto max-w-md w-full flex flex-col items-center h-dvh px-1 py-2">
      <BlurTop />
      <BlurBottom />
      <LogoTitle />
      <p className="mt-28 mb-4 text-2xl">{info.title}</p>
      <video
        key={page}
        className="rounded-xl shadow-2xl border-2 border-primary w-full h-fit"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={info.src} type="video/mp4" />
        This browser does not support the video player.
      </video>
      <p className="text-center text-xl mt-24 italic">{info.description}</p>
      <div className="relative w-full mt-12">
        {page != 0 && (
          <IconButton
            text="Prev"
            onClick={prevPage}
            className="absolute left-4 px-4 py-1 border border-primary text-primary rounded-full font-bold"
          />
        )}
        <IconButton
          text={page == end ? "Done" : "Next"}
          onClick={nextPage}
          className="absolute right-4 px-4 py-1 bg-primary text-onprimary rounded-full font-bold"
        />
      </div>
    </div>
  );

  function nextPage() {
    if (page == end) {
      window.location.href = "/dashboard";
    } else {
      setPage((p) => p + 1);
    }
  }

  function prevPage() {
    setPage((p) => p - 1);
  }
}
