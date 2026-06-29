"use client";
import {
  BROWSER_LANGUAGE_CODES,
  DEFAULT_LANGUAGE,
  LanguageCode,
} from "@/types/language";
import React, { createContext, useContext, useState } from "react";

type LanguageContext = {
  languageCode: LanguageCode;
  setLanguage: React.Dispatch<React.SetStateAction<LanguageCode>>;
};

const LanguageContext = createContext<LanguageContext | null>(null);

// type CategoryContext = {
//   categoryContext: string[];
//   setCategoryContext: React.Dispatch<React.SetStateAction<string[]>>;
// };

// const CategoriesContext = createContext<CategoryContext | null>(null);

export default function LanguageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const browserLang = navigator.language;
  const initialLanguage =
    BROWSER_LANGUAGE_CODES[browserLang] || DEFAULT_LANGUAGE;

  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);

  return (
    <LanguageContext.Provider
      value={{
        languageCode: language,
        setLanguage: setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContext {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguageContext must be used within a languageStatusContextProvider",
    );
  }
  return context;
}
