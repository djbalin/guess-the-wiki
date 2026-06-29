export const LANGUAGE_CODES = ["da", "en", "fr", "de", "es"] as const;

export const BROWSER_LANGUAGE_CODES: Record<string, LanguageCode> = {
  "da-DK": "da",
  "en-US": "en",
  "fr-FR": "fr",
  "de-DE": "de",
  "es-ES": "es",
};
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export const DEFAULT_LANGUAGE: LanguageCode = "en" as const;

export const LANGUAGE_META: Record<
  LanguageCode,
  {
    languageName: string;
    countryCode: "DK" | "GB" | "FR" | "DE" | "ES";
    languageCode: LanguageCode;
  }
> = {
  da: { languageName: "Danish", countryCode: "DK", languageCode: "da" },
  en: { languageName: "English", countryCode: "GB", languageCode: "en" },
  fr: { languageName: "French", countryCode: "FR", languageCode: "fr" },
  de: { languageName: "German", countryCode: "DE", languageCode: "de" },
  es: { languageName: "Spanish", countryCode: "ES", languageCode: "es" },
};
