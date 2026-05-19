import { Suspense } from "react";
import { getBaseUrl } from "@/lib/is_dev";

export default async function ResultsPage() {
  const data = await fetch(`${getBaseUrl()}/api/results`);
  const results = await data.json();

  return null;

  // console.log(results);
  // return (
  //   <ul>
  //     {results.map((result) => (
  //       <li>
  //         User: {result.clerkUserId}: {result.isVictory ? "victory" : "loss"}
  //       </li>
  //     ))}
  //   </ul>
  // );
}
