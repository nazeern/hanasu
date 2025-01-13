"use client";

import { User } from "@supabase/auth-js";
import { Plan, planInfo } from "@/app/lib/data";
import { BlurBottom, BlurTop } from "@/app/ui/blur";
import { BoltIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import IconButton from "@/app/ui/icon-button";
import { LogoTitle } from "@/app/ui/logo";
import ProfileIcon from "@/app/ui/profile-icon";

export default function PaywallMainApp({
  user,
  plan,
  limit,
}: {
  user: User;
  plan: Plan;
  limit: number;
}) {
  const planDisplay = planInfo[plan].display;

  return (
    <div className="flex flex-col h-dvh w-screen px-1 py-2 text-center">
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
      <p className="text-sm mb-8">
        You&apos;ve made use of the included
        <br />
        <span className="italic">{limit} chat minutes</span> on the{" "}
        {planDisplay}.
      </p>
      <div className="flex flex-col gap-4 items-center bg-primarybg border border-primary rounded-lg p-4 mb-7">
        <p className="font-bold text-lg">
          Keep up your streak for just
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
      <p className="text-sm italic text-gray-700">
        Thank you for your support! If you have any suggestions, please email
        the solo developer at nitin.nazeer@gmail.com.
      </p>
    </div>
  );
}
