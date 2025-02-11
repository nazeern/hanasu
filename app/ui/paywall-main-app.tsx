"use client";

import { User } from "@supabase/auth-js";
import { Plan, planInfo } from "@/app/lib/data";
import { BlurBottom, BlurTop } from "@/app/ui/blur";
import { BoltIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import IconButton from "@/app/ui/icon-button";
import { LogoTitle } from "@/app/ui/logo";
import ProfileIcon from "@/app/ui/profile-icon";
import { timeString } from "@/app/lib/utils";

type ProgressData = {
  totalConversationTime: number;
  avgResponseDuration: number;
  totalResponses: number;
};

export default function PaywallMainApp({
  user,
  plan,
  limit,
  progressData,
}: {
  user: User;
  plan: Plan;
  limit: number;
  progressData: ProgressData;
}) {
  const planDisplay = planInfo[plan].display;

  return (
    <div className="flex flex-col h-dvh w-full max-w-3xl mx-auto px-1 py-2 text-center mb-4">
      <BlurTop />
      <BlurBottom />
      <div className="flex items-center justify-between px-2 py-2">
        <IconButton
          className="py-1"
          href="/dashboard"
          text="Back"
          icon={ChevronLeftIcon}
        />
        <LogoTitle />
        <ProfileIcon initial={user.user_metadata?.name[0]} />
      </div>
      <p className="font-bold text-2xl mt-4 mb-4">
        Thanks for learning on Hanasu!
      </p>
      <p className="text-sm mb-4">
        You&apos;ve made use of the included
        <br />
        <span className="italic">{limit} chat minutes</span> on the{" "}
        {planDisplay}.
      </p>
      <div className="grid grid-rows-3 md:grid-cols-3 gap-1 mb-2 p-2">
        <div className="rounded-md bg-white border p-2">
          <p className="font-bold text-2xl">
            {timeString(progressData.totalConversationTime)}
          </p>
          <p className="text-gray-500">Time Spent in Conversation</p>
        </div>
        <div className="rounded-md bg-white border p-2">
          <p className="font-bold text-2xl">
            {progressData.totalResponses * 2 + 1}
          </p>
          <p className="text-gray-500">Responses Spoken</p>
        </div>
        <div className="rounded-md bg-white border p-2">
          <p className="font-bold text-2xl">
            {Math.round(progressData.avgResponseDuration)}ms
          </p>
          <p className="text-gray-500">Average Response Duration</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center bg-primarybg border border-primary rounded-lg p-4 mb-7">
        <p className="font-bold text-lg">
          Keep up your progress for just
          <br />
          <span className="underline">$0.05 per chat minute!</span>
        </p>
        <IconButton
          icon={BoltIcon}
          text="Upgrade"
          href="/pricing"
          className="w-fit bg-primary font-bold px-4 py-1 text-onprimary rounded-lg text-lg"
        />
        <p>
          Hanasu was started by a fellow language learner struggling to speak
          Japanese, even after spending hours a day on Duolingo.
        </p>
      </div>
      <p className="text-sm italic text-gray-700 pb-4">
        Thank you for your support! If you have any suggestions, please email
        the solo developer at nitin.nazeer@gmail.com.
      </p>
    </div>
  );
}
