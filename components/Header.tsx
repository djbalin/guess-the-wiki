"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import LanguageSelector from "./game/InputGroup/LanguageSelector";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <header
      style={{
        background: "var(--header-bg)",
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
      <div
        onClick={() => router.push("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          cursor: "pointer",
        }}
      >
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

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Theme toggle */}
        {/* <button
          onClick={toggleTheme}
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          style={{
            background: "transparent",
            border: "1px solid var(--border2)",
            borderRadius: 7,
            padding: "4px 10px",
            fontSize: 16,
            cursor: "pointer",
            lineHeight: 1,
            transition: "background 0.15s, border-color 0.15s",
            color: "var(--textdim)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "var(--surface2)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "transparent")
          }
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button> */}

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border2)",
            flexShrink: 0,
          }}
        />
        <button onClick={() => router.push("/sign-in")}>Sign In</button>
        <UserButton showName={true}></UserButton>

        {/* Language selector */}
        <LanguageSelector />
      </div>
    </header>
  );
}
