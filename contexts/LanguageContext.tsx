"use client";
import { DEFAULT_LANGUAGE, LanguageCode } from "@/types/language";
import { Result } from "@/types/game";
import { getCookie } from "cookies-next";
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
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);

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
