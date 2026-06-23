import { db } from "@/db/init";
import { resultsTable } from "@/db/schema";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const results = await db
    .select()
    .from(resultsTable)
    .where(eq(resultsTable.clerkUserId, user.id));

  const sortedResults = [...results].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const wins = sortedResults.filter((result) => result.isVictory).length;
  const losses = sortedResults.length - wins;
  const winRate =
    sortedResults.length === 0
      ? 0
      : Math.round((wins / sortedResults.length) * 100);
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "Player";
  const email = user.emailAddresses[0]?.emailAddress ?? "No email available";

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Profile
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 md:text-3xl">
                {displayName}
              </h1>
              <p className="mt-1 text-sm text-slate-600">{email}</p>
            </div>
            <div className="self-start md:self-auto">
              <UserButton showName={true} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Wins</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-900">
              {wins}
            </p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">Losses</p>
            <p className="mt-1 text-2xl font-semibold text-rose-900">
              {losses}
            </p>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-sm text-sky-700">Win Rate</p>
            <p className="mt-1 text-2xl font-semibold text-sky-900">
              {winRate}%
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Results</h2>
          {sortedResults.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">
              No games played yet. Your match history will appear here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {sortedResults.map((result) => (
                <li
                  key={result.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="text-slate-600">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-slate-600">{result.difficulty}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      result.isVictory
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {result.isVictory ? "Victory" : "Loss"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
