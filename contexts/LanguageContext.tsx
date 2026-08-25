"use client";
import {
  BROWSER_LANGUAGE_CODES,
  DEFAULT_LANGUAGE,
  LanguageCode,
} from "@/types/language";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

type LanguageContext = {
  languageCode: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContext | null>(null);

/**
 * `navigator` is a browser-only API, so it cannot be read while rendering:
 * doing so crashes prerendering on runtimes without a `navigator` global, and
 * otherwise makes the server render a different language than the browser,
 * which React reports as a hydration mismatch.
 *
 * `useSyncExternalStore` is the supported way to read such a value — the
 * server snapshot is used for the HTML, and React swaps in the client snapshot
 * after hydration.
 */
const subscribeToNothing = () => () => {};

function getBrowserLanguage(): LanguageCode {
  return BROWSER_LANGUAGE_CODES[navigator.language] ?? DEFAULT_LANGUAGE;
}

function getServerLanguage(): LanguageCode {
  return DEFAULT_LANGUAGE;
}

export default function LanguageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const detectedLanguage = useSyncExternalStore(
    subscribeToNothing,
    getBrowserLanguage,
    getServerLanguage,
  );
  // An explicit choice from the language selector always wins over detection.
  const [chosenLanguage, setChosenLanguage] = useState<LanguageCode | null>(
    null,
  );

  const setLanguage = useCallback(
    (language: LanguageCode) => setChosenLanguage(language),
    [],
  );

  const value = useMemo(
    () => ({ languageCode: chosenLanguage ?? detectedLanguage, setLanguage }),
    [chosenLanguage, detectedLanguage, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContext {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguageContext must be used within a LanguageContextProvider",
    );
  }
  return context;
}
