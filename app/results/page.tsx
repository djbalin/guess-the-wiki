import { Suspense } from "react";

export default async function ResultsPage() {
  const data = await fetch("http://localhost:3000/api/results");
  const results = await data.json();

  console.log(results);
  return (
    <ul>
      {results.map((result) => (
        <li>
          User: {result.clerkUserId}: {result.isVictory ? "victory" : "loss"}
        </li>
      ))}
    </ul>
  );
}
