"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import LanguageSelector from "./game/InputGroup/LanguageSelector";
import { Show, UserButton } from "@clerk/nextjs";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <header
      className="sticky top-0 z-[200] flex items-center justify-between px-3 sm:px-7"
      style={{
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--border)",
        height: 52,
      }}
    >
      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="flex items-center gap-2 sm:gap-[11px] cursor-pointer min-w-0"
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
          className="hidden sm:inline truncate"
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
      <button
        onClick={() => router.push("/categories")}
        className="font-barlow font-black uppercase tracking-wide text-lg sm:text-xl text-purple-700 hover:text-purple-600 transition-colors px-3 py-1 rounded-md shadow-sm bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface2)]"
      >
        Categories
      </button>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
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
        <Show when="signed-out">
          <button
            onClick={() => router.push("/sign-in")}
            className="bg-green-600 text-white rounded-full font-medium text-sm sm:text-base h-6   px-4 sm:px-5 cursor-pointer"
          >
            Sign In
          </button>
        </Show>
        <Show when="signed-in">
          <UserButton showName={true} />
        </Show>

        {/* Language selector */}
        <LanguageSelector />
      </div>
    </header>
  );
}
