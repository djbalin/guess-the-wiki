import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="font-barlow text-3xl font-black uppercase tracking-[0.04em] text-[var(--text)]">
        Page not found
      </h1>
      <p className="max-w-md text-[15px] text-[var(--textdim)]">
        That page does not exist — but there are plenty of articles left to
        guess.
      </p>
      <Link
        href="/play"
        className="mt-1 rounded-[10px] bg-[var(--lime)] px-6 py-3 font-barlow text-[17px] font-black uppercase tracking-wide text-[var(--limedark)]"
      >
        Play a round
      </Link>
    </div>
  );
}
