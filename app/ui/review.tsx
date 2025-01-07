"use client";

import {
  CheckIcon,
  ChevronLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BlurTop, BlurBottom } from "@/app/ui/blur";
import IconButton from "./icon-button";
import ProfileIcon from "./profile-icon";
import { User } from "@supabase/auth-js";
import { Entry, selectIdJa } from "@/app/lib/ja_dict";
import { Tables } from "@/database.types";
import React, { useState } from "react";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/solid";
import {
  selectLowestScoreVocabulary,
  updateVocabulary,
} from "@/app/lib/vocabulary";
import EntryTile from "./entry-tile";
import ProgressBar from "./progress-bar";
import { useRouter } from "next/navigation";
import { LogoTitle } from "@/app/ui/logo";
import { langInfo } from "./lang-select";

let start = performance.now();
const NUM_QUESTIONS = 10;

enum UserState {
  ANSWERING,
  CORRECT,
  INCORRECT,
  LOADING,
  FINISHED,
}

export default function ReviewApp({
  user,
  lang,
  loadedVocab,
  loadedEntry,
}: {
  user: User;
  lang: string;
  loadedVocab: Tables<"vocabulary"> | null;
  loadedEntry: Entry | null;
}) {
  const langName =
    langInfo.find((info) => info.lang == lang)?.name ?? "English";

  const router = useRouter();
  const [userState, setUserState] = useState<UserState>(UserState.ANSWERING);
  const [vocab, setVocab] = useState<Tables<"vocabulary"> | null>(loadedVocab);
  const [entry, setEntry] = useState<Entry | null>(loadedEntry);
  const [response, setResponse] = useState<string>("");
  const [questionNumber, setQuestionNumber] = useState<number>(0);

  if (!entry || !vocab) {
    return (
      <div className="flex flex-col items-center h-screen w-screen px-1 py-2 gap-4">
        <BlurTop />
        <BlurBottom />
        <div className="w-screen flex items-center justify-between px-2 py-2">
          <IconButton
            className="py-1"
            href="/dashboard"
            text="Back"
            icon={ChevronLeftIcon}
          />
          <ProfileIcon initial={user.user_metadata?.name[0]} />
        </div>
        <p className="pt-12 font-bold text-2xl text-center">
          Seems like your dictionary is empty!
        </p>
        <p className="font-light italic mb-2 text-center">
          Start a conversation and save words you&apos;d like to review!
        </p>
        <IconButton
          icon={SparklesIcon}
          text="Get Started!"
          href="/dashboard"
          className="px-2 py-1 bg-primary text-onprimary text-2xl font-bold"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen w-screen px-1 py-2">
      <BlurTop />
      <BlurBottom />
      <div className="w-screen flex items-center justify-between px-2 py-2">
        <IconButton
          className="py-1"
          href="/dashboard"
          text="Back"
          icon={ChevronLeftIcon}
        />
        <LogoTitle />
        <ProfileIcon initial={user.user_metadata?.name[0]} />
      </div>
      <ProgressBar
        percent={(questionNumber / NUM_QUESTIONS) * 100}
        height={4}
      />
      <p className="pt-12 font-bold text-xl">Active Recall</p>
      <p className="font-light italic mb-2">
        Enter the corresponding word in {langName}
      </p>
      {userState == UserState.CORRECT ? (
        <IconButton
          text="Correct"
          icon={CheckIcon}
          className="rounded-full bg-green-500 text-white px-2 mb-1"
        />
      ) : userState == UserState.INCORRECT ? (
        <IconButton
          text="Incorrect"
          icon={XMarkIcon}
          className="rounded-full bg-red-500 text-white px-2 mb-1"
        />
      ) : (
        <div className="h-7" />
      )}
      {userState == UserState.ANSWERING ? (
        <ol className="w-5/6 list-decimal list-inside text-xl border border-primary rounded-xl p-4">
          {entry.definitions.map((d, i) => (
            <li key={i}>{d.meanings.join("; ")}</li>
          ))}
        </ol>
      ) : userState == UserState.LOADING ? (
        <div className="w-5/6 flex gap-6 p-4 border border-primary rounded-xl">
          <div className="bg-slate-400/50 my-2 h-4 w-full rounded-full animate-pulse" />
        </div>
      ) : (
        <EntryTile user={user} entry={entry} />
      )}
      <form
        className="mt-10 w-5/6 flex items-center gap-1"
        onSubmit={handleSubmit}
      >
        <input
          required
          className="w-full px-2 py-1 border border-primary rounded-xl"
          type="text"
          id="response"
          placeholder="Type the matching word..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
        {userState == UserState.FINISHED ? (
          <button
            type="submit"
            className={`bg-primary text-onprimary px-2 py-1 rounded-xl font-black animate-bounce`}
          >
            Finish
          </button>
        ) : (
          <button
            type="submit"
            className={`bg-primary text-onprimary px-2 py-1 rounded-xl font-black`}
          >
            <ArrowRightIcon className="size-5" />
          </button>
        )}
      </form>
    </div>
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!entry || !vocab) {
      return;
    }
    if (userState == UserState.FINISHED) {
      router.push("/dashboard");
      return;
    }

    // Already answered, next word
    if ([UserState.CORRECT, UserState.INCORRECT].includes(userState)) {
      setUserState(UserState.LOADING);
      setResponse("");
      const nextVocab = await selectLowestScoreVocabulary(user.id, entry.id);
      const nextEntry = await selectIdJa(nextVocab?.word_id);
      setVocab(nextVocab);
      setEntry(nextEntry);
      setUserState(UserState.ANSWERING);
      start = performance.now();
      return;
    }

    const correct = entry.readings.includes(response);
    if (correct) {
      setUserState(UserState.CORRECT);
    } else {
      setUserState(UserState.INCORRECT);
    }
    if (questionNumber == NUM_QUESTIONS - 1) {
      setUserState(UserState.FINISHED);
    }
    setQuestionNumber((qn) => qn + 1);
    const timeToResponse = performance.now() - start;
    const n = vocab.n_correct + vocab.n_wrong + 1;

    // Update score
    const updated = {
      ...vocab,
      n_correct: vocab.n_correct + +correct,
      n_wrong: vocab.n_wrong + +!correct,
      time_to_response_ms: Math.min(
        Math.round(
          ((n - 1) / n) * vocab.time_to_response_ms + (1 / n) * timeToResponse
        ),
        32767
      ),
      streak: correct ? vocab.streak + 1 : 0,
    };
    updated.score =
      updated.n_correct / n +
      1000 / updated.time_to_response_ms +
      Math.min(updated.streak, 2);
    await updateVocabulary(updated);
  }
}
