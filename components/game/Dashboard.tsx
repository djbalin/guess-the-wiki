"use client";
import { GAME_DESCRIPTION } from "@/assets/strings";
import GameStatusContextProvider from "@/contexts/GameStatusContext";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { languageCode } = useLanguageContext();
  const router = useRouter();
  return (
    <GameStatusContextProvider>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div className="flex flex-col items-center justify-center">
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 0.92,
              textTransform: "uppercase",
              letterSpacing: "-1px",
              marginBottom: 20,
            }}
          >
            <span>Guess the</span>
            <br />
            <span
              style={{
                color: "var(--lime)",
                textShadow: "0 0 40px var(--limeglow)",
              }}
            >
              Wikipedia
            </span>
            <br />
            <span>Article!</span>
          </div>
        </div>
        <p
          style={{
            color: "var(--textdim)",
            fontSize: 16,
            lineHeight: 1.65,
            maxWidth: 420,
            margin: "0 auto",
          }}
        >
          {GAME_DESCRIPTION[languageCode].body}
        </p>
        <button
          onClick={() => router.push("/play")}
          className="mt-12 px-10 py-4 rounded-[14px] bg-[var(--lime)] text-white font-barlow text-[28px] font-black uppercase tracking-wide shadow-lg transition duration-150 hover:bg-lime-500 active:scale-95"
        >
          Play Game!
        </button>
      </div>
      {/* <Game /> */}
    </GameStatusContextProvider>
  );
}
