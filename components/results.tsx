/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

/* -------------------- types -------------------- */

type ResultsProps = {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  onRestart: () => void;
};

const STORAGE_KEY = "typing-personal-best";

/* -------------------- component -------------------- */

export function Results({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  onRestart,
}: ResultsProps) {
  const [message, setMessage] = useState("Test Complete!");
  const [subMessage, setSubMessage] = useState(
    "Solid run. Keep pushing to beat your high score.",
  );
  const [logo, setLogo] = useState("/icon-completed.svg");

  const [best, setBest] = useState<number | null>(null);

  /* ---------- personal best logic ---------- */

  useEffect(() => {
    const storedBest = localStorage.getItem(STORAGE_KEY);

    /* First ever test */
    if (!storedBest) {
      localStorage.setItem(STORAGE_KEY, String(wpm));
      setBest(wpm);
      setMessage("Baseline Established!");
      setSubMessage("You've set a personal best. Can you beat it next time?");
      setLogo("/icon-completed.svg");

      window.dispatchEvent(new Event("personal-best-updated"));
      return;
    }

    const bestScore = Number(storedBest);
    setBest(bestScore);

    /* New high score */
    if (wpm > bestScore) {
      localStorage.setItem(STORAGE_KEY, String(wpm));
      setBest(wpm);
      setMessage("High Score Smashed!");
      setSubMessage(
        "Incredible work! You've beaten your personal best. Can you do it again?",
      );
      setLogo("/icon-new-pb.svg");

      window.dispatchEvent(new Event("personal-best-updated"));
    }
  }, [wpm]);

  /* -------------------- render -------------------- */

  return (
    <div className="mt-2 w-full max-w-3xl p-6 text-center flex flex-col items-center gap-4">
      {/* Icon */}
      <Image src={logo} alt="Icon Completed" width={60} height={60} />

      {/* Title + subtitle */}
      <div>
        <h2 className="text-[2rem] font-semibold text-neutral-100">
          {message}
        </h2>

        <p className="text-sm text-neutral-500">{subMessage}</p>
      </div>

      {/* Stats grid */}
      <div className="mt-6 grid grid-cols-1 w-full md:grid-cols-3 gap-4 text-sm">
        <Stat label="WPM" value={wpm} />

        <Stat
          label="Accuracy"
          value={`${accuracy}%`}
          valueClass={accuracy < 100 ? "text-red-400" : "text-neutral-100"}
        />

        <Stat
          label="Characters"
          value={
            <>
              <span className="text-green-400">{correctChars}</span>
              <span className="text-neutral-500">{" / "}</span>
              <span className="text-red-400">{incorrectChars}</span>
            </>
          }
        />
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="mt-8 rounded-md bg-white px-6 py-2 text-sm font-semibold text-neutral-950 hover:bg-opacity-80 transition"
      >
        Go Again
      </button>
    </div>
  );
}

/* -------------------- stat card -------------------- */

function Stat({
  label,
  value,
  valueClass = "text-neutral-100",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="rounded-md border border-neutral-800 p-4 flex flex-col items-start">
      <p className="text-neutral-500">{label}:</p>
      <p className={`mt-1 text-lg font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}
