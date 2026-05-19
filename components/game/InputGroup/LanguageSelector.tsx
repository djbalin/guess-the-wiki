"use client";

import { useGameStore } from "@/app/gameStore";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { DEFAULT_LANGUAGE, LanguageCode } from "@/types/language";
import { setCookie, getCookie } from "cookies-next";
import {
  DK,
  FR,
  GB,
  ES,
  DE,
  FlagComponent,
} from "country-flag-icons/react/3x2";

function storeLanguageSettings(language: LanguageCode) {
  setCookie("language", language);
}

export const flagComponents: { [key in LanguageCode]: FlagComponent } = {
  da: DK,
  fr: FR,
  en: GB,
  de: DE,
  es: ES,
};

export default function LanguageSelector() {
  const chosenLanguage = getCookie("language");
  const languageContext = useLanguageContext();
  const activeLanguageCode = languageContext.languageCode;
  const { setGameParams, gameParams } = useGameStore();

  if (!chosenLanguage) {
    storeLanguageSettings(DEFAULT_LANGUAGE);
  }

  function handleClickLanguage(languageCode: LanguageCode) {
    languageContext.setLanguage(languageCode);
    storeLanguageSettings(languageCode);
    setGameParams({ ...gameParams, lang: languageCode });
  }

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {Object.entries(flagComponents).map(([code, Flag]) => {
        const languageCode = code as LanguageCode;
        const isActive = activeLanguageCode === languageCode;

        return (
          <button
            key={languageCode}
            type="button"
            onClick={() => handleClickLanguage(languageCode)}
            title={`Switch language to ${languageCode.toUpperCase()}`}
            className={`rounded-md border p-0.5 sm:p-1 transition-transform duration-150 ${
              isActive
                ? "scale-110 border-black/20"
                : "border-transparent hover:border-black/15 hover:bg-black/5"
            }`}
          >
            <Flag className="block h-3 w-5 sm:h-4 sm:w-8 rounded-[2px]" />
          </button>
        );
      })}
    </div>
  );
}
