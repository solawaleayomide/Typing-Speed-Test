"use client";

import dynamic from "next/dynamic";

const Passage = dynamic(() => import("@/components/passage"), {
  ssr: false,
});

import { Controls } from "@/components/controls";
import { Header } from "@/components/header";
import { StatsBar } from "@/components/stats-bar";
import { useState } from "react";

import passages from "@/data.json";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Mode = "Timed (60s)" | "Passage";

export default function Page() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Hard");
  const [mode, setMode] = useState<Mode>("Timed (60s)");
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    elapsedMs: 0,
  });

  const difficultyMap = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
  } as const;

  const [passageIndex, setPassageIndex] = useState(() => {
    const key = difficultyMap[difficulty];
    return Math.floor(Math.random() * passages[key].length);
  });

  function handleDifficultyChange(next: Difficulty) {
    const key = difficultyMap[next];
    const index = Math.floor(Math.random() * passages[key].length);

    setDifficulty(next);
    setPassageIndex(index);
  }

  const passage = passages[difficultyMap[difficulty]][passageIndex];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center">
      <Header />

      <div className="w-full max-w-6xl px-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <StatsBar
          wpm={stats.wpm}
          accuracy={stats.accuracy}
          elapsedMs={stats.elapsedMs}
        />

        <div className="h-px bg-neutral-800 md:hidden" />
        <Controls
          difficulty={difficulty}
          mode={mode}
          onDifficultyChange={handleDifficultyChange}
          onModeChange={setMode}
        />
      </div>

      <Passage key={passage.id} text={passage.text} onStatsChange={setStats} />
      {/* <Results /> */}
    </main>
  );
}
