"use client";

import { useState } from "react";
import { LanguageCode } from "@/types/language";
import { WikiResult, fetchSubcategories } from "@/lib/categoriesWiki";
import SearchPanelShell from "./SearchPanelShell";
import { ExternalLinkIcon } from "lucide-react";

type SubcategoriesSearchPanelProps = {
  languageCode: LanguageCode;
  query: string;
  onQueryChange: (value: string) => void;
  onSelectSubcategory: (subcategory: WikiResult) => void;
};

function SubcategoriesResultList({
  subcategories,
  emptyLabel,
  onSelectSubcategory,
}: {
  subcategories: WikiResult[] | null;
  emptyLabel: string;
  onSelectSubcategory: (subcategory: WikiResult) => void;
}) {
  if (subcategories === null) {
    return (
      <p className="text-sm text-[var(--textfaint)] text-center py-8">
        {emptyLabel}
      </p>
    );
  }
  if (subcategories.length === 0) {
    return (
      <p className="text-sm text-[var(--textdim)] text-center py-8">
        No results found
      </p>
    );
  }
  console.log(subcategories);
  return (
    <ul className="divide-y divide-[var(--border)]">
      {subcategories.map((subcategory, i) => (
        <li
          key={subcategory.pageid}
          className="px-3 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface2)] transition-colors flex gap-2 cursor-pointer"
          onClick={() => onSelectSubcategory(subcategory)}
        >
          <span className="shrink-0 w-6 text-right text-[var(--textfaint)] font-mono text-xs tabular-nums">
            {i + 1}
          </span>
          <span className="min-w-0 break-words">{subcategory.title}</span>
          <a
            href={subcategory.fullurl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 break-words text-[var(--text)] hover:text-[var(--lime)] transition-colors ml-auto"
          >
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function SubcategoriesSearchPanel({
  languageCode,
  query,
  onQueryChange,
  onSelectSubcategory,
}: SubcategoriesSearchPanelProps) {
  const [results, setResults] = useState<WikiResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      setResults(await fetchSubcategories(query, languageCode));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchPanelShell
      title="Find subcategories"
      description="List direct subcategories for a category title."
      placeholder="e.g. Category:Denmark in World War II"
      query={query}
      onQueryChange={(e) => onQueryChange(e.target.value)}
      onSearch={search}
      loading={loading}
      resultCount={results?.length ?? null}
    >
      <SubcategoriesResultList
        subcategories={results}
        emptyLabel="Search to list subcategories"
        onSelectSubcategory={onSelectSubcategory}
      />
    </SearchPanelShell>
  );
}
