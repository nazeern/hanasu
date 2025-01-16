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