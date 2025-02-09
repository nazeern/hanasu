import { idSelectJa, selectJa } from "@/app/lib/ja_dict";
import { Interval } from "@/app/ui/rtc-main-app";
import { idSelectZh, selectZh } from "@/app/lib/zh-CN_dict";

// How much does the spaced interval grow or shrink?
export const VOCAB_DELAY_FACTOR = 0.75

export const topics = [
    "What is your morning routine?",
    "Do you have any hobbies?",
    "What did you do today?",
]

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
    lang: "fr",
    flag: "🇫🇷",
    name: "French",
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
  initialChargedAmount: number;
}

export const planInfo: { [plan: string]: PlanInfo } = {
  [Plan.FREE]: {
    name: "free",
    display: "Free Plan",
    priceId: "",
    limit: 30,
    initialChargedAmount: 0,
  },
  [Plan.USAGE]: {
    name: "pay-as-you-go",
    display: "Pay as You Go Plan",
    priceId: process.env.USAGE_PLAN_PRICE_ID ?? "",
    limit: Infinity,
    initialChargedAmount: 0,
  },
  [Plan.MONTHLY]: {
    name: "monthly",
    display: "Monthly Plan",
    priceId: process.env.MONTHLY_PLAN_PRICE_ID ?? "",
    limit: 1000,
    initialChargedAmount: 2500,
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

type CouponInfo = {
  promoCode: string,
  promoId?: string,
  promoDesc: string,
  plan: Plan,
  amount: number,
}

export const couponInfo: CouponInfo[] = [
  {
    promoCode: 'SEIYA',
    promoId: "promo_1Qq6QgBG8kOO7xleESicSKD0",
    promoDesc: 'Get your first month free!',
    plan: Plan.MONTHLY,
    amount: 0,
  }
]

export const emailStyles = `
/* -------------------------------------
    GLOBAL RESETS
------------------------------------- */

/*All the styling goes here*/

img {
  border: none;
  -ms-interpolation-mode: bicubic;
  max-width: 100%; 
}

body {
  background-color: #eaebed;
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  padding: 0;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%; 
}

table {
  border-collapse: separate;
  mso-table-lspace: 0pt;
  mso-table-rspace: 0pt;
  min-width: 100%;
  width: 100%; }
  table td {
    font-family: sans-serif;
    font-size: 14px;
    vertical-align: top; 
}

/* -------------------------------------
    BODY & CONTAINER
------------------------------------- */

.body {
  background-color: #eaebed;
  width: 100%; 
}

/* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
.container {
  display: block;
  Margin: 0 auto !important;
  /* makes it centered */
  max-width: 580px;
  padding: 10px;
  width: 580px; 
}

/* This should also be a block element, so that it will fill 100% of the .container */
.content {
  box-sizing: border-box;
  display: block;
  Margin: 0 auto;
  max-width: 580px;
  padding: 10px; 
}

/* -------------------------------------
    HEADER, FOOTER, MAIN
------------------------------------- */
.main {
  background: #ffffff;
  border-radius: 3px;
  width: 100%; 
}

.header {
  padding: 20px 0;
}

.wrapper {
  box-sizing: border-box;
  padding: 20px; 
}

.content-block {
  padding-bottom: 10px;
  padding-top: 10px;
}

.footer {
  clear: both;
  Margin-top: 10px;
  text-align: center;
  width: 100%; 
}
  .footer td,
  .footer p,
  .footer span,
  .footer a {
    color: #9a9ea6;
    font-size: 12px;
    text-align: center; 
}

/* -------------------------------------
    TYPOGRAPHY
------------------------------------- */
h1,
h2,
h3,
h4 {
  color: #06090f;
  font-family: sans-serif;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  margin-bottom: 30px; 
}

h1 {
  font-size: 35px;
  font-weight: 300;
  text-align: center;
  text-transform: capitalize; 
}

p,
ul,
ol {
  font-family: sans-serif;
  font-size: 14px;
  font-weight: normal;
  margin: 0;
  margin-bottom: 15px; 
}
  p li,
  ul li,
  ol li {
    list-style-position: inside;
    margin-left: 5px; 
}

a {
  color: #ec0867;
  text-decoration: underline; 
}

/* -------------------------------------
    BUTTONS
------------------------------------- */
.btn {
  box-sizing: border-box;
  width: 100%; }
  .btn > tbody > tr > td {
    padding-bottom: 15px; }
  .btn table {
    min-width: auto;
    width: auto; 
}
  .btn table td {
    background-color: #ffffff;
    border-radius: 24px;
    text-align: center; 
}
  .btn a {
    background-color: #ffffff;
    border: solid 1px #ec0867;
    border-radius: 24px;
    box-sizing: border-box;
    color: #ec0867;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    padding: 12px 25px;
    text-decoration: none;
    text-transform: capitalize; 
}

.btn-primary table td {
  background-color: #ec0867; 
}

.btn-primary a {
  background-color: #7525f5;
  border-color: #7525f5;
  color: #ffffff; 
}

/* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
------------------------------------- */
.last {
  margin-bottom: 0; 
}

.first {
  margin-top: 0; 
}

.align-center {
  text-align: center; 
}

.align-right {
  text-align: right; 
}

.align-left {
  text-align: left; 
}

.clear {
  clear: both; 
}

.mt0 {
  margin-top: 0; 
}

.mb0 {
  margin-bottom: 0; 
}

.preheader {
  color: transparent;
  display: none;
  height: 0;
  max-height: 0;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  mso-hide: all;
  visibility: hidden;
  width: 0; 
}

.powered-by a {
  text-decoration: none; 
}

hr {
  border: 0;
  border-bottom: 1px solid #f6f6f6;
  Margin: 20px 0; 
}

/* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 620px) {
  table[class=body] h1 {
    font-size: 28px !important;
    margin-bottom: 10px !important; 
  }
  table[class=body] p,
  table[class=body] ul,
  table[class=body] ol,
  table[class=body] td,
  table[class=body] span,
  table[class=body] a {
    font-size: 16px !important; 
  }
  table[class=body] .wrapper,
  table[class=body] .article {
    padding: 10px !important; 
  }
  table[class=body] .content {
    padding: 0 !important; 
  }
  table[class=body] .container {
    padding: 0 !important;
    width: 100% !important; 
  }
  table[class=body] .main {
    border-left-width: 0 !important;
    border-radius: 0 !important;
    border-right-width: 0 !important; 
  }
  table[class=body] .btn table {
    width: 100% !important; 
  }
  table[class=body] .btn a {
    width: 100% !important; 
  }
  table[class=body] .img-responsive {
    height: auto !important;
    max-width: 100% !important;
    width: auto !important; 
  }
}

/* -------------------------------------
    PRESERVE THESE STYLES IN THE HEAD
------------------------------------- */
@media all {
  .ExternalClass {
    width: 100%; 
  }
  .ExternalClass,
  .ExternalClass p,
  .ExternalClass span,
  .ExternalClass font,
  .ExternalClass td,
  .ExternalClass div {
    line-height: 100%; 
  }
  .apple-link a {
    color: inherit !important;
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    text-decoration: none !important; 
  }
  .btn-primary table td:hover {
    background-color: #0345fc !important; 
  }
  .btn-primary a:hover {
    background-color: #0345fc !important;
    border-color: #0345fc !important; 
  } 
}
`