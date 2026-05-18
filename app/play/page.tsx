import { Suspense } from "react";
import PlayContent from "./PlayContent";

function PlayFallback() {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "24px 20px 80px",
        color: "var(--text)",
      }}
    >
      Loading…
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<PlayFallback />}>
      <PlayContent />
    </Suspense>
  );
}
