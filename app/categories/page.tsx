"use client";

import { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import CategorySearchPanel from "@/components/categories/CategorySearchPanel";
import CategoryExplorer from "@/components/categories/CategoryExplorer";

export default function CategoriesPage() {
  const { languageCode } = useLanguageContext();
  const [startCategory, setStartCategory] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-52px)] overflow-hidden">
      <div className="shrink-0 px-4 sm:px-6 py-5 border-b border-[var(--border)]">
        <h1 className="font-barlow text-3xl sm:text-4xl font-black uppercase tracking-[0.06em] text-[var(--text)]">
          Categories
        </h1>
        <p className="mt-1 text-base text-[var(--textdim)] max-w-xl">
          Search a Wikipedia category, then drill into its subcategories. Save
          any category you want to use later in a game.
        </p>
      </div>

      <div className="flex-1 min-h-0 p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-1 flex flex-col min-h-0">
          <CategorySearchPanel
            languageCode={languageCode}
            onSelectCategory={(wikiResult) =>
              setStartCategory(wikiResult.title)
            }
          />
        </div>
        <div className="xl:col-span-2 flex flex-col min-h-0">
          <CategoryExplorer startCategory={startCategory} />
        </div>
      </div>
    </div>
  );
}
