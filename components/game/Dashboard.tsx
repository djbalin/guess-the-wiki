import { GAME_DESCRIPTION } from "@/assets/strings";
import GameStatusContextProvider from "@/contexts/GameStatusContext";
import { useLanguageContext } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const { languageCode } = useLanguageContext();
  return (
    <GameStatusContextProvider>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
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
      </div>
      {/* <Game /> */}
    </GameStatusContextProvider>
  );
}
