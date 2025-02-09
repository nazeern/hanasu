"use client";

import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Plan } from "@/app/lib/data";

type PlanDetails = {
  title: string;
  description: string;
  tag?: string;
  featured?: boolean;
  linkTo: string;
  linkText: string;
  price: string;
  per: string;
  originalPrice?: string;
  percentOff?: string;
  includedMinutes?: string;
  bulletHeader: string;
  bullets: string[];
};

const renderData: { [key in Plan]: PlanDetails } = {
  [Plan.FREE]: {
    title: "Free",
    description: "Perfect for getting started with language learning.",
    linkTo: "/dashboard",
    linkText: "Try for free",
    price: "$0",
    per: "/ month",
    includedMinutes: undefined,
    bulletHeader: "Get started with:",
    bullets: [
      "First 30 chat minutes free",
      "Learn through natural conversation",
      "Need help? Chat transcripts are built-in",
      "Auto-translations powered by Google",
      "Track your progress with analytics",
      "Review past sessions at any time",
      "Integrated dictionary*",
      "Romanization support*",
      "Save and review your vocabulary*",
    ],
  },
  [Plan.USAGE]: {
    title: "Pay as you Go",
    description: "Low per-minute rates. Don't use it? Don't pay.",
    linkTo: "/upgrade?plan=pay-as-you-go",
    linkText: "Get Started",
    price: "$0.05",
    per: "/ chat minute",
    includedMinutes: undefined,
    bulletHeader: "Everything in the Free Plan, plus:",
    bullets: [
      "Unlimited chat minutes",
      "Learn through natural conversation",
      "Need help? Chat transcripts are built-in",
      "Auto-translations powered by Google",
      "Track your progress with analytics",
      "Review past sessions at any time",
      "Integrated dictionary*",
      "Romanization support*",
      "Save and review your vocabulary*",
    ],
  },
  [Plan.MONTHLY]: {
    title: "Monthly",
    description:
      "For dedicated language learners who plan to practice regularly.",
    tag: "Most Popular",
    featured: true,
    linkTo: "/upgrade?plan=monthly",
    linkText: "Get Started",
    price: "$25",
    per: "/ month",
    originalPrice: "$30",
    percentOff: "$5 off",
    includedMinutes: undefined,
    bulletHeader: "Everything in the Free Plan, plus:",
    bullets: [
      "1,000 chat minutes every month",
      "Learn through natural conversation",
      "Need help? Chat transcripts are built-in",
      "Auto-translations powered by Google",
      "Track your progress with analytics",
      "Review past sessions at any time",
      "Integrated dictionary*",
      "Romanization support*",
      "Save and review your vocabulary*",
    ],
  },
};

export default function PlanCard({
  plan,
  userId,
  amountOverride,
}: {
  plan: Plan;
  userId?: string;
  amountOverride?: string;
}) {
  const data = renderData[plan];
  const signupSearchParams = new URLSearchParams();
  signupSearchParams.set("redirectTo", data.linkTo);
  // if user, send to upgrade, else signup then redirect to upgrade
  const linkTo = userId
    ? data.linkTo
    : `/sign-up?${signupSearchParams.toString()}`;
  return (
    <div
      className={cn(
        "xl:mt-12 h-fit p-8 rounded-lg border border-gray-400 bg-white mb-4",
        {
          "border-primary border-2": data.featured,
          "xl:mt-0": data.tag,
        }
      )}
    >
      {data.tag && (
        <div className="w-fit rounded-md border border-primary text-primary text-sm px-1 mb-2">
          {data.tag}
        </div>
      )}
      <p className="font-bold text-3xl mb-3">{data.title}</p>
      <p className="text-sm mb-4 font-light">{data.description}</p>
      {/* Subscribe CTA Button */}
      {data.tag && <div className="xl:h-4" />}
      <Link href={linkTo}>
        <div className="rounded-lg w-full p-2 bg-primary text-onprimary text-center border border-primarybg mb-5">
          {data.linkText} &rarr;
        </div>
      </Link>
      {/* Percent Off */}
      {data.percentOff ? (
        <div className="flex items-center gap-x-2 mb-2">
          <div className="line-through text-gray-500">{data.originalPrice}</div>
          <div className="font-semibold w-fit rounded-full bg-primarybg text-primary text-sm px-2 py-1">
            {data.percentOff}
          </div>
        </div>
      ) : (
        <div className="h-9" />
      )}
      {/* Pricing */}
      <div className="flex items-end gap-x-2 mb-3">
        <p className="text-5xl">{amountOverride || data.price}</p>
        <p className="text-sm">{data.per}</p>
      </div>
      <hr className="w-full border-b border-gray-300 my-8" />
      {/* Bullets */}
      <p className="text-sm font-light mb-4">{data.bulletHeader}</p>
      <div className="flex flex-col gap-y-4">
        {data.bullets.map((bullet, index) => {
          return (
            <div key={index} className="flex items-center gap-x-1">
              <CheckCircleIcon className="stroke-2 size-4 text-green-700 shrink-0" />
              <p className={`${index == 0 && "font-bold italic "}text-sm`}>
                {bullet}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
