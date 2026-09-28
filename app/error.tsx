"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="font-barlow text-3xl font-black uppercase tracking-[0.04em] text-[var(--text)]">
        Something went wrong
      </h1>
      <p className="max-w-md text-[15px] text-[var(--textdim)]">
        We hit an unexpected error. Trying again usually helps.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-1 cursor-pointer rounded-[10px] bg-[var(--lime)] px-6 py-3 font-barlow text-[17px] font-black uppercase tracking-wide text-[var(--limedark)]"
      >
        Try again
      </button>
    </div>
  );
}
