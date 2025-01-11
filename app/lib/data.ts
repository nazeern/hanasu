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