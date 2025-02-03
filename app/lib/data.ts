import { idSelectJa, selectJa } from "@/app/lib/ja_dict";
import { Interval } from "@/app/ui/rtc-main-app";
import { idSelectZh, selectZh } from "@/app/lib/zh-CN_dict";

// How much does the spaced interval grow or shrink?
export const VOCAB_DELAY_FACTOR = 0.75

export type LangInfo = {
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
    lang: "ko",
    flag: "🇰🇷",
    name: "Korean",
  },
  {
    lang: "zh-CN",
    flag: "🇨🇳",
    name: "Chinese",
    supportsDict: true,
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
    lang: "th",
    flag: "🇹🇭",
    name: "Thai",
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

export enum Plan {
  FREE,
  USAGE,
  MONTHLY,
}

/** Given a string, return corresponding Plan. */
export function planFromString(planString: string): Plan {
  switch (planString) {
    case "pay-as-you-go":
      return Plan.USAGE
    case "monthly":
      return Plan.MONTHLY
    default:
      return Plan.FREE
  }
}
/** Given a Stripe priceId, return corresponding Plan. */
export function planFromPriceId(priceId: string): Plan {
  switch (priceId) {
    case process.env.USAGE_PLAN_PRICE_ID:
      return Plan.USAGE
    case process.env.MONTHLY_PLAN_PRICE_ID:
      return Plan.MONTHLY
    default:
      return Plan.FREE
  }
}

type PlanInfo = {
  name: string;
  display: string;
  priceId: string;
  limit: number;
}

export const planInfo: { [plan: string]: PlanInfo } = {
  [Plan.FREE]: {
    name: "free",
    display: "Free Plan",
    priceId: "",
    limit: 30,
  },
  [Plan.USAGE]: {
    name: "pay-as-you-go",
    display: "Pay as You Go Plan",
    priceId: process.env.USAGE_PLAN_PRICE_ID ?? "",
    limit: Infinity
  },
  [Plan.MONTHLY]: {
    name: "monthly",
    display: "Monthly Plan",
    priceId: process.env.MONTHLY_PLAN_PRICE_ID ?? "",
    limit: 1000
  },
}

export type Definition = {
    parts_of_speech: string[]
    tags: string[]
    meanings: string[]
    see_also: string

    example_ja: string
    example_en: string
}

export type Entry = {
    definitions: Definition[];
    featured: string[];
    id: number;
    readings: string[];
    word: string;
    saved?: boolean;
}

export async function selectDict(lang: string, content: string, tap: number): Promise<[Entry[] | null, Interval | null]> {
  switch (lang) {
    case "ja":
      return await selectJa(content, tap)
    case "zh-CN":
      return await selectZh(content, tap)
    default:
      return [null, null]
  }
}

export async function idSelectDict(lang: string, wordId?: number): Promise<Entry | null> {
  switch (lang) {
    case "ja":
      return await idSelectJa(wordId)
    case "zh-CN":
      return await idSelectZh(wordId)
    default:
      return null
  }
}

export enum Experience {
  ONBOARD = "onboard",
  JOYRIDE = "joyride"
}

export function getJoyrideSteps(lang: string) {
  const info = langInfo.find((info) => info.lang == lang)
  if (!info) { return [] }
  return [
    {
      target: "#chat-message",
      content: "Welcome! You can double-tap a message to reveal the transcript.",
      disableBeacon: true,
    },
    ...info.supportsDict ? [{
      target: "#chat-message",
      content: "Need vocabulary help? Single tap a word to search the dictionary, and then save it to your lesson plan.",
      disableBeacon: true,
    }] : [],
    ...info.canRomanize ? [{
      target: "#chat-message",
      content: "Need help reading? Just double-tap to romanize the text.",
      disableBeacon: true,
    }] : [],
    {
      target: "#chat-message",
      content: "Want to check your understanding? Double-tap again for translations by Google.",
      disableBeacon: true,
    },
    {
      target: "#mic-button",
      content: "You're all set! Just hold down the mic button and speak normally!",
      disableBeacon: true,
    },
  ];
}