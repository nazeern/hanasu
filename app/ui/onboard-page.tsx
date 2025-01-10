"use client";

import { Tables } from "@/database.types";
import { BlurBottom, BlurTop } from "./blur";
import { LogoTitle } from "./logo";
import { User } from "@supabase/auth-js";
import { useState } from "react";
import IconButton from "./icon-button";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function OnboardPage({
  user, // eslint-disable-line
  profile, // eslint-disable-line
}: {
  user: User;
  profile: Tables<"profiles">;
}) {
  const [page, setPage] = useState<number>(0); // eslint-disable-line
  return (
    <div className="flex flex-col h-dvh w-screen px-1 py-2">
      <BlurTop />
      <BlurBottom />
      <div className="flex items-start justify-between px-2 py-2">
        <IconButton
          className="py-1"
          href="/dashboard"
          text="Exit"
          icon={ChevronLeftIcon}
        />
        <LogoTitle />
        <div />
      </div>
    </div>
  );
}
