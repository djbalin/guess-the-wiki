"use client";

import React, { useState } from "react";
import { LanguageCode } from "@/types/language";
import { WikiResult, fetchPagesInCategory } from "@/lib/categoriesWiki";
import SearchPanelShell from "./SearchPanelShell";

type PagesInCategorySearchPanelProps = {
  languageCode: LanguageCode;
  query: string;
  onQueryChange: (value: string) => void;
};

function PagesResultList({
  pages,
  emptyLabel,
}: {
  pages: WikiResult[] | null;
  emptyLabel: string;
}) {
  if (pages === null) {
    return (
      <p className="text-sm text-[var(--textfaint)] text-center py-8">
        {emptyLabel}
      </p>
    );
  }
  if (pages.length === 0) {
    return (
      <p className="text-sm text-[var(--textdim)] text-center py-8">
        No results found
      </p>
    );
  }
  return (
    <ul className="divide-y divide-[var(--border)]">
      {pages.map((page, i) => (
        <li
          key={page.title}
          className="px-3 py-2.5 text-sm hover:bg-[var(--surface2)] transition-colors flex gap-2"
        >
          <span className="shrink-0 w-6 text-right text-[var(--textfaint)] font-mono text-xs tabular-nums">
            {i + 1}
          </span>
          <a
            href={page.fullurl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 break-words text-[var(--text)] hover:text-[var(--lime)] transition-colors"
          >
            {page.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function PagesInCategorySearchPanel({
  languageCode,
  query,
  onQueryChange,
}: PagesInCategorySearchPanelProps) {
  const [results, setResults] = useState<WikiResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      setResults(await fetchPagesInCategory(query, languageCode));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchPanelShell
      title="Pages in category"
      description="Search articles within a category (prefix with Category:)."
      placeholder="e.g. Category:Physics"
      query={query}
      onQueryChange={(e) => onQueryChange(e.target.value)}
      onSearch={search}
      loading={loading}
      resultCount={results?.length ?? null}
    >
      <PagesResultList
        pages={results}
        emptyLabel="Search to list pages in a category"
      />
    </SearchPanelShell>
  );
}
