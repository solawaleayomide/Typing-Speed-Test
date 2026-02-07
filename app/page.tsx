"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { Header } from "@/components/header";
import { Controls } from "@/components/controls";
import { StatsBar } from "@/components/stats-bar";
import { Results } from "@/components/results";

import passages from "@/data.json";

const Passage = dynamic(() => import("@/components/passage"), {
  ssr: false,
});

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Mode = "Timed (60s)" | "Passage";

type Stats = {
  wpm: number;
  accuracy: number;
  elapsedMs: number;
  correctChars: number;
  incorrectChars: number;
};

export default function Page() {
  // State

  const [difficulty, setDifficulty] = useState<Difficulty>("Hard");

  const [mode, setMode] = useState<Mode>("Timed (60s)");

  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    accuracy: 100,
    elapsedMs: 0,
    correctChars: 0,
    incorrectChars: 0,
  });

  const [testStatus, setTestStatus] = useState<"idle" | "running" | "finished">(
    "idle",
  );

  const [restartKey, setRestartKey] = useState(0);

  // Passage selection logic

  const difficultyMap = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
  } as const;

  const [passageIndex, setPassageIndex] = useState(() => {
    const key = difficultyMap[difficulty];
    return Math.floor(Math.random() * passages[key].length);
  });

  const passage = passages[difficultyMap[difficulty]][passageIndex];

  // Handlers

  function handleDifficultyChange(next: Difficulty) {
    const key = difficultyMap[next];
    const index = Math.floor(Math.random() * passages[key].length);

    setDifficulty(next);
    setPassageIndex(index);
  }

  function handleRestart() {
    setRestartKey((k) => k + 1);

    setStats({
      wpm: 0,
      accuracy: 100,
      elapsedMs: 0,
      correctChars: 0,
      incorrectChars: 0,
    });

    setTestStatus("idle");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center">
      <Header />

      {testStatus === "finished" ? (
        <Results
          wpm={stats.wpm}
          accuracy={stats.accuracy}
          correctChars={stats.correctChars}
          incorrectChars={stats.incorrectChars}
          onRestart={handleRestart}
        />
      ) : (
        <>
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
              disabled={testStatus === "running"}
            />
          </div>

          <Passage
            key={`${passage.id}-${restartKey}`}
            text={passage.text}
            mode={mode}
            testStatus={testStatus}
            onStatsChange={setStats}
            onTestStart={() => setTestStatus("running")}
            onTestFinish={() => setTestStatus("finished")}
          />

          {testStatus === "running" && (
            <button
              onClick={handleRestart}
              disabled={testStatus !== "running"}
              className="mt-6 rounded-md border border-neutral-700 px-4 py-2 text-sm hover:border-neutral-500 disabled:opacity-50"
            >
              Restart
            </button>
          )}
        </>
      )}
    </main>
  );
}
