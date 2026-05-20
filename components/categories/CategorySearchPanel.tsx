"use client";

import { useState } from "react";
import { LanguageCode } from "@/types/language";
import { fetchCategoryTitles, WikiResult } from "@/lib/categoriesWiki";
import SearchPanelShell from "./SearchPanelShell";
import { ExternalLinkIcon } from "lucide-react";

type CategorySearchPanelProps = {
  languageCode: LanguageCode;
  onSelectCategory: (wikiResult: WikiResult) => void;
};

function CategoryResultItem({
  wikiResult,
  index,
  onSelect,
}: {
  wikiResult: WikiResult;
  index: number;
  onSelect: (wikiResult: WikiResult) => void;
}) {
  const displayTitle = wikiResult.title;
  return (
    <li
      className="px-3 py-3 text-base text-[var(--text)] hover:bg-[var(--surface2)] transition-colors flex gap-2 cursor-pointer"
      onClick={() => onSelect(wikiResult)}
    >
      <span className="shrink-0 w-7 text-right text-[var(--textfaint)] font-mono text-sm tabular-nums">
        {index + 1}
      </span>
      <span className="min-w-0 break-words">{displayTitle}</span>
      <a
        href={wikiResult.fullurl}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 break-words text-[var(--text)] hover:text-[var(--lime)] transition-colors ml-auto "
      >
        <ExternalLinkIcon className="w-5 h-5" />
      </a>
    </li>
  );
}

function CategoryResultList({
  wikiResults,
  emptyLabel,
  onSelectCategory,
}: {
  wikiResults: WikiResult[] | null;
  emptyLabel: string;
  onSelectCategory: (wikiResult: WikiResult) => void;
}) {
  if (wikiResults === null) {
    return (
      <p className="text-base text-[var(--textfaint)] text-center py-8">
        {emptyLabel}
      </p>
    );
  }
  if (wikiResults.length === 0) {
    return (
      <p className="text-base text-[var(--textdim)] text-center py-8">
        No results found
      </p>
    );
  }
  return (
    <ul className="divide-y divide-[var(--border)]">
      {wikiResults.map((wikiResult, i) => (
        <CategoryResultItem
          key={wikiResult.pageid}
          wikiResult={wikiResult}
          index={i}
          onSelect={onSelectCategory}
        />
      ))}
    </ul>
  );
}

export default function CategorySearchPanel({
  languageCode,
  onSelectCategory,
}: CategorySearchPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WikiResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      setResults(await fetchCategoryTitles(query, languageCode));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchPanelShell
      title="Find categories"
      description="Search categories on Wikipedia."
      placeholder="e.g. Physics"
      query={query}
      onQueryChange={(e) => setQuery(e.target.value)}
      onSearch={search}
      loading={loading}
      resultCount={results?.length ?? null}
    >
      <CategoryResultList
        wikiResults={results}
        emptyLabel="Search to list matching categories"
        onSelectCategory={onSelectCategory}
      />
    </SearchPanelShell>
  );
}
