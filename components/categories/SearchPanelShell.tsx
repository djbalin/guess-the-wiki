import React from "react";

export const inputClass =
  "w-full px-3 py-3 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] text-base placeholder:text-[var(--textfaint)] outline-none focus:border-[var(--lime)] focus:ring-1 focus:ring-[var(--limeglow)] transition";

export const btnClass =
  "w-full px-4 py-3 rounded-lg bg-[var(--lime)] text-[var(--limedark)] text-sm font-black uppercase tracking-[0.08em] font-barlow shadow-[0_2px_12px_var(--limeglow)] hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed";

type SearchPanelShellProps = {
  title: string;
  description: string;
  placeholder: string;
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  loading: boolean;
  resultCount: number | null;
  children: React.ReactNode;
};

export default function SearchPanelShell({
  title,
  description,
  placeholder,
  query,
  onQueryChange,
  onSearch,
  loading,
  resultCount,
  children,
}: SearchPanelShellProps) {
  return (
    <section className="flex flex-col min-h-0 flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-[18px] overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[var(--border)] shrink-0">
        <h2 className="font-barlow text-lg font-black uppercase tracking-[0.08em] text-[var(--text)]">
          {title}
        </h2>
        <p className="mt-1 text-sm text-[var(--textdim)]">{description}</p>
        <form
          className="mt-4 flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={onQueryChange}
            placeholder={placeholder}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className={btnClass}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface2)]/50 shrink-0">
        <span className="text-sm font-barlow font-bold uppercase tracking-[0.1em] text-[var(--textdim)]">
          Results
        </span>
        {resultCount !== null && (
          <span className="text-sm font-mono text-[var(--textfaint)]">
            {resultCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </section>
  );
}
