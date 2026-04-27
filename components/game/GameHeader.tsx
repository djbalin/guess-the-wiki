"use client";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { Languages } from "@/resources/TypesEnums";
import { setCookie } from "cookies-next";

const LANGS: { code: Languages; flag: string }[] = [
  { code: Languages.English, flag: "🇬🇧" },
  { code: Languages.Danish,  flag: "🇩🇰" },
  { code: Languages.French,  flag: "🇫🇷" },
  { code: Languages.German,  flag: "🇩🇪" },
  { code: Languages.Spanish, flag: "🇪🇸" },
];

export default function GameHeader() {
  const { language, setLanguage } = useLanguageContext();

  function handleLang(lang: Languages) {
    setLanguage(lang);
    setCookie("language", lang);
  }

  return (
    <header
      style={{
        background: "oklch(7.5% 0.006 55)",
        borderBottom: "1px solid var(--border)",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 200,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            flexShrink: 0,
            background:
              "linear-gradient(140deg, oklch(62% 0.19 248), oklch(46% 0.21 272))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 900,
            fontSize: 22,
            color: "white",
            letterSpacing: "-1px",
            boxShadow:
              "0 0 0 2px oklch(57% 0.17 248 / 0.45), 0 4px 18px oklch(57% 0.17 248 / 0.4)",
          }}
        >
          W?
        </div>
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontSize: 21,
            fontWeight: 900,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            color: "var(--text)",
          }}
        >
          Guess the Wiki
        </span>
      </div>

      {/* Language selector */}
      <div style={{ display: "flex", gap: 4 }}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => handleLang(l.code)}
            style={{
              background:
                language === l.code ? "var(--surface2)" : "transparent",
              border:
                language === l.code
                  ? "1px solid var(--border2)"
                  : "1px solid transparent",
              color: language === l.code ? "var(--text)" : "var(--textdim)",
              borderRadius: 7,
              padding: "3px 9px",
              fontSize: 15,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {l.flag}
          </button>
        ))}
      </div>
    </header>
  );
}
