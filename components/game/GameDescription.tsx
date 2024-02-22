"use client";
import { GAME_DESCRIPTION } from "@/assets/strings";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { Language, Languages } from "@/resources/TypesEnums";
import US from "country-flag-icons/react/3x2/US";

export function GameDescription() {
  const languageContext = useLanguageContext();
  const language = languageContext.language;
  // languageContext.
  return (
    <div className="flex flex-col">
      <h1 className="mb-2 tracking-tighter text-5xl xl:text-7xl">
        {GAME_DESCRIPTION[language].header}
      </h1>
      <h2 className="w-[40%] leading-5 tracking-tight text-justify px-2 mb-4">
        {GAME_DESCRIPTION[language].body}
      </h2>
    </div>
  );
}
