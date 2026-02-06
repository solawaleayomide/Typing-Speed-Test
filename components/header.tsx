"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* storage key shared with Results */
const STORAGE_KEY = "typing-personal-best";

export function Header() {
  const [best, setBest] = useState<number | null>(null);

  /* ---------- load best score ---------- */

  useEffect(() => {
    function loadBest() {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setBest(Number(stored));
      }
    }

    /* initial load */
    loadBest();

    /* listen for updates from Results */
    window.addEventListener("personal-best-updated", loadBest);

    return () => window.removeEventListener("personal-best-updated", loadBest);
  }, []);

  /* -------------------- render -------------------- */

  return (
    <header className="w-full max-w-6xl flex justify-between items-center py-6 px-4 mb-6">
      {/* Logo desktop */}
      <Image
        src="/logo-large.svg"
        alt="Typing Speed Test Logo"
        width={200}
        height={200}
        className="hidden md:block"
      />

      {/* Logo mobile */}
      <Image
        src="/logo-small.svg"
        alt="Typing Speed Test Logo"
        width={30}
        height={30}
        className="md:hidden"
      />

      {/* Personal best */}
      <div className="flex items-center gap-2 text-sm md:text-base text-neutral-400">
        <Image
          src="/icon-personal-best.svg"
          alt="Best score"
          width={16}
          height={16}
        />

        <span>
          <span className="hidden md:inline">Personal best:</span>

          <span className="md:hidden">Best:</span>

          <span className="font-medium text-neutral-100">
            {" "}
            {best ?? "--"} WPM
          </span>
        </span>
      </div>
    </header>
  );
}
