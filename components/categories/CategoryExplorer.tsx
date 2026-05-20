"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Home,
  ExternalLink,
  FolderTree,
  FileText,
  Star,
  StarOff,
  ArrowUpLeft,
  X,
} from "lucide-react";
import { LanguageCode } from "@/types/language";
import {
  CategoryContents,
  WikiResult,
  fetchCategoryContents,
} from "@/lib/categoriesWiki";
import { useLanguageContext } from "@/contexts/LanguageContext";

const STORAGE_KEY = "guess-the-wiki:saved-categories";

export type SavedCategory = {
  title: string;
  languageCode: LanguageCode;
  savedAt: number;
};

function loadSaved(): SavedCategory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedCategory[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistSaved(items: SavedCategory[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
}

function stripCategoryPrefix(title: string): string {
  return title.replace(/^[^:]+:/, "");
}

type CategoryExplorerProps = {
  /** Title of a category to open; when this changes, the trail is reset. */
  startCategory: string | null;
};

export default function CategoryExplorer({
  startCategory,
}: CategoryExplorerProps) {
  const [trail, setTrail] = useState<string[]>(
    startCategory ? [startCategory] : [],
  );
  const [contents, setContents] = useState<CategoryContents | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedCategory[]>(loadSaved());

  const { languageCode } = useLanguageContext();

  const [prevLanguageCode, setPrevLanguageCode] = useState(languageCode);
  const [prevStartCategory, setPrevStartCategory] = useState(startCategory);

  if (prevLanguageCode !== languageCode) {
    setPrevLanguageCode(languageCode);
    setTrail([]);
    setContents(null);
    setError(null);
  }

  if (prevStartCategory !== startCategory) {
    setPrevStartCategory(startCategory);
    setTrail(startCategory ? [startCategory] : []);
  }

  // useEffect(() => {
  //   if (!startCategory) return;
  //   setTrail((prev) => {
  //     if (prev.length > 0 && prev[0] === startCategory) return prev;
  //     return [startCategory];
  //   });
  // }, [startCategory]);

  const currentCategory = trail.length > 0 ? trail[trail.length - 1] : null;
  console.log("currentCategory: ", currentCategory);

  useEffect(() => {
    let cancelled = false;
    async function fetchContents() {
      console.log("fetching contents for category: ", currentCategory);
      if (!currentCategory) {
        // setContents(null);
        // setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      fetchCategoryContents(currentCategory, languageCode)
        .then((c) => {
          console.log(c);
          if (!cancelled) setContents(c);
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(msg);
            setContents(null);
          }
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }
    fetchContents();
    return () => {
      cancelled = true;
    };
  }, [currentCategory, languageCode]);

  const drillInto = useCallback((subcategoryTitle: string) => {
    setTrail((t) => [...t, subcategoryTitle]);
  }, []);

  const jumpTo = useCallback((index: number) => {
    setTrail((t) => t.slice(0, index + 1));
  }, []);

  const goUp = useCallback(() => {
    setTrail((t) => (t.length > 1 ? t.slice(0, -1) : t));
  }, []);

  const reset = useCallback(() => {
    setTrail([]);
  }, []);

  const isSaved = useCallback(
    (title: string) =>
      saved.some((s) => s.title === title && s.languageCode === languageCode),
    [saved, languageCode],
  );

  const toggleSaveCurrent = useCallback(() => {
    if (!currentCategory) return;
    setSaved((prev) => {
      const exists = prev.some(
        (s) => s.title === currentCategory && s.languageCode === languageCode,
      );
      const next = exists
        ? prev.filter(
            (s) =>
              !(s.title === currentCategory && s.languageCode === languageCode),
          )
        : [
            ...prev,
            { title: currentCategory, languageCode, savedAt: Date.now() },
          ];
      persistSaved(next);
      return next;
    });
  }, [currentCategory, languageCode]);

  const removeSaved = useCallback((title: string, lc: LanguageCode) => {
    setSaved((prev) => {
      const next = prev.filter(
        (s) => !(s.title === title && s.languageCode === lc),
      );
      persistSaved(next);
      return next;
    });
  }, []);

  const savedForLanguage = useMemo(
    () => saved.filter((s) => s.languageCode === languageCode),
    [saved, languageCode],
  );

  return (
    <section className="flex flex-col min-h-0 flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] overflow-hidden">
      <header className="p-4 sm:p-5 border-b border-[var(--border)] shrink-0 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-barlow text-lg font-black uppercase tracking-[0.08em] text-[var(--text)]">
              Explore
            </h2>
            <p className="mt-1 text-sm text-[var(--textdim)]">
              Drill into subcategories. Click any crumb to jump back up.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={goUp}
              disabled={trail.length <= 1}
              className="px-3 py-2 rounded-md text-sm font-barlow font-bold uppercase tracking-[0.08em] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface2)] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
              title="Go up one level"
            >
              <ArrowUpLeft className="w-4 h-4" />
              Up
            </button>
            <button
              type="button"
              onClick={toggleSaveCurrent}
              disabled={!currentCategory}
              className={`px-3 py-2 rounded-md text-sm font-barlow font-bold uppercase tracking-[0.08em] border transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                currentCategory && isSaved(currentCategory)
                  ? "border-[var(--lime)] text-[var(--lime)] bg-[var(--limeglow)]/10"
                  : "border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface2)]"
              }`}
              title={
                currentCategory && isSaved(currentCategory)
                  ? "Remove from saved categories"
                  : "Save this category"
              }
            >
              {currentCategory && isSaved(currentCategory) ? (
                <StarOff className="w-4 h-4" />
              ) : (
                <Star className="w-4 h-4" />
              )}
              {currentCategory && isSaved(currentCategory) ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <Breadcrumb trail={trail} onJump={jumpTo} onReset={reset} />

        {savedForLanguage.length > 0 && (
          <SavedBar
            items={savedForLanguage}
            currentTitle={currentCategory}
            onOpen={(s) => setTrail([s.title])}
            onRemove={(s) => removeSaved(s.title, s.languageCode)}
          />
        )}
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {!currentCategory && <EmptyState />}
        {currentCategory && isLoading && (
          <p className="text-base text-[var(--textfaint)] text-center py-8">
            Loading…
          </p>
        )}
        {currentCategory && error && (
          <p className="text-base text-red-400 text-center py-8 px-4">
            {error}
          </p>
        )}
        {currentCategory && !isLoading && !error && contents && (
          <ContentsView contents={contents} onDrill={drillInto} />
        )}
      </div>
    </section>
  );
}

function Breadcrumb({
  trail,
  onJump,
  onReset,
}: {
  trail: string[];
  onJump: (index: number) => void;
  onReset: () => void;
}) {
  console.log(trail);
  if (trail.length === 0) {
    return (
      <div className="flex items-center gap-2 text-base text-[var(--textfaint)]">
        <Home className="w-5 h-5" />
        <span>No category yet — search to start exploring.</span>
      </div>
    );
  }
  return (
    <nav
      aria-label="Category trail"
      className="flex items-center flex-wrap text-base sm:text-lg"
    >
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-md text-purple-700 hover:bg-[var(--surface2)] transition"
        title="Clear trail"
      >
        <Home className="w-5 h-5" />
      </button>
      {trail.map((title, i) => {
        const isLast = i === trail.length - 1;
        return (
          <div key={`${title}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700 shrink-0" />
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={isLast}
              className={`px-2.5 py-2 rounded-md max-w-[32ch] sm:max-w-[40ch] truncate text-purple-700 transition ${
                isLast
                  ? "font-semibold cursor-default"
                  : "hover:bg-[var(--surface2)] cursor-pointer"
              }`}
              title={title}
            >
              {stripCategoryPrefix(title)}
            </button>
          </div>
        );
      })}
    </nav>
  );
}

function SavedBar({
  items,
  currentTitle,
  onOpen,
  onRemove,
}: {
  items: SavedCategory[];
  currentTitle: string | null;
  onOpen: (s: SavedCategory) => void;
  onRemove: (s: SavedCategory) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-barlow font-bold uppercase tracking-[0.1em] text-[var(--textfaint)] shrink-0">
        Saved
      </span>
      {items.map((s) => {
        const isCurrent = s.title === currentTitle;
        return (
          <span
            key={`${s.languageCode}:${s.title}`}
            className={`inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full border text-sm transition ${
              isCurrent
                ? "border-[var(--lime)] text-[var(--lime)] bg-[var(--limeglow)]/10"
                : "border-[var(--border)] text-[var(--textdim)] hover:text-[var(--text)] hover:bg-[var(--surface2)]"
            }`}
          >
            <button
              type="button"
              onClick={() => onOpen(s)}
              className="max-w-[20ch] truncate"
              title={s.title}
            >
              {stripCategoryPrefix(s.title)}
            </button>
            <button
              type="button"
              onClick={() => onRemove(s)}
              className="p-0.5 rounded-full hover:bg-[var(--surface2)] text-[var(--textfaint)] hover:text-[var(--text)]"
              title="Remove from saved"
              aria-label={`Remove saved category ${s.title}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12 gap-2 text-[var(--textfaint)]">
      <FolderTree className="w-10 h-10" />
      <p className="text-base">
        Search for a category, then drill into its subcategories.
      </p>
    </div>
  );
}

function ContentsView({
  contents,
  onDrill,
}: {
  contents: CategoryContents;
  onDrill: (title: string) => void;
}) {
  const { subcategories, pages } = contents;
  if (subcategories.length === 0 && pages.length === 0) {
    return (
      <p className="text-base text-[var(--textdim)] text-center py-8">
        This category has no subcategories or pages.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <ContentsColumn
        title="Subcategories"
        icon={<FolderTree className="w-4 h-4" />}
        count={subcategories.length}
        emptyLabel="No subcategories"
      >
        {subcategories.map((sub, i) => (
          <SubcategoryRow
            key={sub.pageid}
            index={i}
            wikiResult={sub}
            onDrill={onDrill}
          />
        ))}
      </ContentsColumn>
      <ContentsColumn
        title="Pages"
        icon={<FileText className="w-4 h-4" />}
        count={pages.length}
        emptyLabel="No direct pages"
        bordered
      >
        {pages.map((page, i) => (
          <PageRow key={page.pageid} index={i} wikiResult={page} />
        ))}
      </ContentsColumn>
    </div>
  );
}

function ContentsColumn({
  title,
  icon,
  count,
  emptyLabel,
  bordered,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  emptyLabel: string;
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col min-h-0 ${
        bordered ? "md:border-l border-[var(--border)]" : ""
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--surface2)]/50">
        <span className="inline-flex items-center gap-1.5 text-sm font-barlow font-bold uppercase tracking-[0.1em] text-[var(--textdim)]">
          {icon}
          {title}
        </span>
        <span className="text-sm font-mono text-[var(--textfaint)]">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <p className="text-base text-[var(--textfaint)] text-center py-6">
          {emptyLabel}
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">{children}</ul>
      )}
    </div>
  );
}

function SubcategoryRow({
  wikiResult,
  index,
  onDrill,
}: {
  wikiResult: WikiResult;
  index: number;
  onDrill: (title: string) => void;
}) {
  return (
    <li className="group flex items-center gap-2 px-3 py-3 text-base text-[var(--text)] hover:bg-[var(--surface2)] transition-colors ">
      <span className="shrink-0 w-7 text-right text-[var(--textfaint)] font-mono text-sm tabular-nums">
        {index + 1}
      </span>
      <button
        type="button"
        onClick={() => onDrill(wikiResult.title)}
        className="min-w-0 flex-1 text-left break-words cursor-pointer"
        title={`Open ${wikiResult.title}`}
      >
        {stripCategoryPrefix(wikiResult.title)}
      </button>
      <a
        href={wikiResult.fullurl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="shrink-0  text-[var(--textfaint)] hover:text-[var(--lime)] transition-colors"
        title="Open on Wikipedia"
      >
        <ExternalLink className="w-5 h-5" />
      </a>
      <button
        type="button"
        onClick={() => onDrill(wikiResult.title)}
        className="shrink-0 text-[var(--textfaint)] group-hover:text-[var(--text)] transition-colors"
        aria-label="Drill into subcategory"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </li>
  );
}

function PageRow({
  wikiResult,
  index,
}: {
  wikiResult: WikiResult;
  index: number;
}) {
  return (
    <li className="flex items-center gap-2 px-3 py-3 text-base hover:bg-[var(--surface2)] transition-colors">
      <span className="shrink-0 w-7 text-right text-[var(--textfaint)] font-mono text-sm tabular-nums">
        {index + 1}
      </span>
      <a
        href={wikiResult.fullurl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="min-w-0 flex-1 break-words text-[var(--text)] hover:text-[var(--lime)] transition-colors flex items-center gap-1"
        title={wikiResult.title}
      >
        {wikiResult.title}
        <ExternalLink className="w-5 h-5 text-[var(--textfaint)] shrink-0 ml-auto" />
      </a>
    </li>
  );
}
