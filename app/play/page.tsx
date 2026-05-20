"use client";
import { useEffect, useState } from "react";
import PlayContent from "./PlayContent";
import GameStatusContextProvider from "@/contexts/GameStatusContext";
import { useGameStore } from "../gameStore";
import GameControls from "@/components/game/InputGroup/GameControls";
import { useGameData } from "../hooks/useGameData";

export default function PlayPage() {
  const { isActive } = useGameStore();
  const { dataState, loadGame } = useGameData();
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

  useEffect(() => {
    if (!isActive) {
      loadGame();
    }
  }, [isActive, loadGame]);

  useEffect(() => {
    if (isMobileSettingsOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobileSettingsOpen]);

  async function loadFromDrawer() {
    setIsMobileSettingsOpen(false);
    await loadGame();
  }

  return (
    <GameStatusContextProvider>
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-52px)] md:overflow-hidden">
        <MobileSettingsToggleBar
          onOpenSettings={() => setIsMobileSettingsOpen(true)}
          onNewGame={loadGame}
        />
        <DesktopSidebar loadGame={loadGame} />
        <MobileDrawer
          open={isMobileSettingsOpen}
          onClose={() => setIsMobileSettingsOpen(false)}
          loadFromDrawer={loadFromDrawer}
        />
        {/* Playing field */}
        <main className="flex-1 md:overflow-y-auto">
          <PlayContent loadGame={loadGame} dataState={dataState} />
        </main>
      </div>
    </GameStatusContextProvider>
  );
}

function MobileSettingsToggleBar({
  onOpenSettings,
  onNewGame,
}: {
  onOpenSettings: () => void;
  onNewGame: () => void;
}) {
  return (
    <div className="md:hidden sticky top-[52px] z-30 bg-[var(--bg)]/95 backdrop-blur border-b border-[var(--border)] px-3 py-2 flex items-center justify-between">
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-[13px] font-black uppercase tracking-[0.08em] font-barlow active:scale-95 transition"
      >
        <span aria-hidden className="text-base leading-none">
          ⚙
        </span>
        Game Settings
      </button>
      <button
        type="button"
        onClick={onNewGame}
        className="px-3 py-2 rounded-lg bg-[var(--lime)] text-[var(--limedark)] text-[13px] font-black uppercase tracking-[0.08em] font-barlow shadow-[0_2px_12px_var(--limeglow)] active:scale-95 transition"
      >
        New game
      </button>
    </div>
  );
}

function DesktopSidebar({ loadGame }: { loadGame: () => Promise<void> }) {
  return (
    <aside
      className="hidden md:block flex-shrink-0 border-r border-[var(--border)] overflow-y-auto"
      style={{ width: 300, padding: "20px 16px" }}
    >
      <GameControls loadGame={loadGame} compact />
    </aside>
  );
}

function MobileDrawer({
  open,
  onClose,
  loadFromDrawer,
}: {
  open: boolean;
  onClose: () => void;
  loadFromDrawer: () => Promise<void>;
}) {
  return (
    <div
      className={`md:hidden fixed inset-0 z-[300] transition-opacity duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        className={`absolute left-0 top-0 bottom-0 w-[88%] max-w-sm bg-[var(--bg)] border-r border-[var(--border)] overflow-y-auto shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] sticky top-0 bg-[var(--bg)] z-10">
          <h2 className="font-barlow text-lg font-black uppercase tracking-[0.08em] text-[var(--text)]">
            Game Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] text-lg flex items-center justify-center active:scale-95 transition"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 px-3 py-3">
          <GameControls loadGame={loadFromDrawer} compact />
        </div>
      </div>
    </div>
  );
}
