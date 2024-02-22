"use client";
import {
  DEFAULT_LANGUAGE,
  Language,
  Languages,
  Result,
} from "@/resources/TypesEnums";
import { getCookie } from "cookies-next";
import React, { createContext, useContext, useState } from "react";

type LanguageContext = {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
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
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  return (
    <LanguageContext.Provider
      value={{
        language: language,
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
      "useLanguageContext must be used within a languageStatusContextProvider"
    );
  }
  return context;
}
