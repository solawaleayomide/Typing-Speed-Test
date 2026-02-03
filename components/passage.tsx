"use client";

import { useEffect, useState } from "react";

type PassageProps = {
  text: string;
  mode: "Timed (60s)" | "Passage";
  onStatsChange: (stats: {
    wpm: number;
    accuracy: number;
    elapsedMs: number;
  }) => void;
  onTestStart?: () => void;
  onTestFinish?: () => void;
};

const TIME_LIMIT_MS = 60_000;

export default function Passage({
  text,
  mode,
  onStatsChange,
  onTestStart,
  onTestFinish,
}: PassageProps) {
  // typing state
  const [input, setInput] = useState("");
  const [cursorIndex, setCursorIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());

  // timing state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  /* -------------------- derived stats (PURE) -------------------- */

  const totalTyped = input.length;
  const errorCount = errors.size;

  const accuracy =
    totalTyped === 0
      ? 100
      : Math.round(((totalTyped - errorCount) / totalTyped) * 100);

  const elapsedMinutes = elapsedMs / 1000 / 60;

  const wpm =
    elapsedMinutes > 0 ? Math.round(totalTyped / 5 / elapsedMinutes) : 0;

  const displayElapsedMs =
    mode === "Timed (60s)" ? Math.max(TIME_LIMIT_MS - elapsedMs, 0) : elapsedMs;

  /* -------------------- timer (SINGLE effect) -------------------- */

  useEffect(() => {
    if (startTime === null) return;
    if (isFinished) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (mode === "Timed (60s)" && elapsed >= TIME_LIMIT_MS) {
        setElapsedMs(TIME_LIMIT_MS);
        setIsFinished(true);
        onTestFinish?.();
        clearInterval(interval);
        return;
      }

      setElapsedMs(elapsed);
    }, 250);

    return () => clearInterval(interval);
  }, [startTime, isFinished, mode, onTestFinish]);

  /* -------------------- sync stats to parent -------------------- */

  useEffect(() => {
    onStatsChange({
      wpm,
      accuracy,
      elapsedMs: displayElapsedMs,
    });
  }, [wpm, accuracy, displayElapsedMs, onStatsChange]);

  /* -------------------- input handling -------------------- */

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (isFinished) return;

    const key = e.key;

    // start timer on first key press
    if (startTime === null) {
      setStartTime(Date.now());
      onTestStart?.();
    }

    // backspace
    if (key === "Backspace") {
      if (cursorIndex === 0) return;

      setInput((prev) => prev.slice(0, -1));
      setCursorIndex((prev) => prev - 1);
      return;
    }

    // ignore non-character keys
    if (key.length !== 1) return;

    // prevent typing beyond passage
    if (cursorIndex >= text.length) return;

    const expectedChar = text[cursorIndex];

    if (key !== expectedChar) {
      setErrors((prev) => {
        const next = new Set(prev);
        next.add(cursorIndex);
        return next;
      });
    }

    setInput((prev) => prev + key);

    setCursorIndex((prev) => {
      const next = prev + 1;

      // passage mode completion
      if (mode === "Passage" && next >= text.length) {
        setIsFinished(true);
        onTestFinish?.();
      }

      return next;
    });
  }

  /* -------------------- rendering helpers -------------------- */

  function getCharStatus(index: number) {
    if (index < input.length) {
      return errors.has(index) ? "incorrect" : "correct";
    }
    return "pending";
  }

  /* -------------------- render -------------------- */

  return (
    <section
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full max-w-5xl px-4 py-10 outline-none"
    >
      <div className="text-lg leading-relaxed font-mono flex flex-wrap gap-[1px]">
        {text.split("").map((char, index) => {
          const status = getCharStatus(index);

          return (
            <span
              key={index}
              className={`
                ${status === "correct" && "text-green-400"}
                ${status === "incorrect" && "text-red-400 underline"}
                ${status === "pending" && "text-neutral-400"}
                ${index === cursorIndex && "border-l-2 border-blue-400"}
              `}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>

      {isFinished && (
        <div className="mt-8 text-center text-blue-400 font-semibold">
          Test complete
        </div>
      )}
    </section>
  );
}
