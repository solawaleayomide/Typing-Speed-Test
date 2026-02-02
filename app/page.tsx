"use client";

import { Controls } from "@/components/controls";
import { Header } from "@/components/header";
import { Passage } from "@/components/passage";
import { Results } from "@/components/results";
import { StatsBar } from "@/components/stats-bar";
import { useState } from "react";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Mode = "Timed (60s)" | "Passage";

export default function Page() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Hard");
  const [mode, setMode] = useState<Mode>("Timed (60s)");

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center">
      <Header />

      <div className="w-full max-w-6xl px-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <StatsBar />
        <div className="h-px bg-neutral-800 md:hidden" />
        <Controls
          difficulty={difficulty}
          mode={mode}
          onDifficultyChange={setDifficulty}
          onModeChange={setMode}
        />
      </div>

      <Passage />
      {/* <Results /> */}
    </main>
  );
}
