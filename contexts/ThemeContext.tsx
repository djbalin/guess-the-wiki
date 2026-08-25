"use client";
import { createContext, useContext, useState } from "react";
import { Theme } from "@/app/theme";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const DEFAULT_THEME: Theme = "dark";
const STORAGE_KEY = "gtw-theme";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

/**
 * Reads the theme the inline boot script already applied to <html>, falling
 * back to the stored preference. Runs lazily on first client render, so the
 * server never touches `document`.
 */
function readInitialTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;

  const applied = document.documentElement.getAttribute("data-theme");
  if (isTheme(applied)) return applied;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // localStorage can throw when cookies are blocked; the default is fine.
  }

  return DEFAULT_THEME;
}

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persisting is best-effort.
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeContextProvider");
  return ctx;
}
