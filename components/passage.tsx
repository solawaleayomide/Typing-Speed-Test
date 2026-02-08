"use client";

import { useEffect, useRef, useState } from "react";
import { Overlay } from "./overlay";

type PassageProps = {
  text: string;
  mode: "Timed (60s)" | "Passage";
  onStatsChange: (stats: {
    wpm: number;
    accuracy: number;
    elapsedMs: number;
    correctChars: number;
    incorrectChars: number;
  }) => void;
  onTestStart?: () => void;
  onTestFinish?: () => void;
  testStatus?: "idle" | "running" | "finished";
};

const TIME_LIMIT_MS = 60_000;

export default function Passage({
  text,
  mode,
  onStatsChange,
  onTestStart,
  onTestFinish,
  testStatus,
}: PassageProps) {
  const [input, setInput] = useState("");
  const [cursorIndex, setCursorIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

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

  // sync stats to parent on every change (wpm, accuracy, elapsed time, correct chars, incorrect chars)
  useEffect(() => {
    onStatsChange({
      wpm,
      accuracy,
      elapsedMs: displayElapsedMs,
      correctChars: totalTyped - errorCount,
      incorrectChars: errorCount,
    });
  }, [wpm, accuracy, displayElapsedMs, totalTyped, errorCount, onStatsChange]);

  // Handles all key presses during the test, including starting the test on the first key press, updating input and cursor position, and recording errors for incorrect characters. Also handles backspace for corrections.
  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (isFinished) return;

    const key = e.key;

    // Start the timer on the first key press
    if (startTime === null) {
      setStartTime(Date.now());
      onTestStart?.();
    }

    // Handle backspace: remove last character and move cursor back
    if (key === "Backspace") {
      if (cursorIndex === 0) return;

      setInput((prev) => prev.slice(0, -1));
      setCursorIndex((prev) => prev - 1);
      return;
    }

    // Ignore non-character keys (e.g., Shift, Ctrl, Alt, etc.)
    if (key.length !== 1) return;

    // If the cursor is at or beyond the end of the text, ignore further input
    if (cursorIndex >= text.length) return;

    const expectedChar = text[cursorIndex];

    // If the typed key doesn't match the expected character, record an error for the current index
    if (key !== expectedChar) {
      setErrors((prev) => {
        const next = new Set(prev);
        next.add(cursorIndex);
        return next;
      });
    }

    // Append the new character to the input and move the cursor forward
    setInput((prev) => prev + key);

    // Complete char-by-char input and move cursor forward

    const nextIndex = cursorIndex + 1;

    // If the next index is at the end of the passage, mark as finished

    if (!isFinished && nextIndex >= text.length) {
      setIsFinished(true);
      onTestFinish?.();
    }

    setCursorIndex(nextIndex);
  }

  // Render helpers

  function getCharStatus(index: number) {
    if (index < input.length) {
      return errors.has(index) ? "incorrect" : "correct";
    }
    return "pending";
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  function handleStartClick() {
    inputRef.current?.focus();

    if (startTime === null) {
      setStartTime(Date.now());
      onTestStart?.();
    }
  }

  return (
    <>
      <section
        // onKeyDown={handleKeyDown}
        ref={containerRef}
        tabIndex={0}
        className="relative w-full max-w-5xl px-4 py-10 outline-none"
      >
        {/* Passage text */}
        <div
          className={`
        text-lg leading-relaxed font-mono flex flex-wrap gap-1px
        transition
        ${testStatus === "idle" ? "blur-sm" : ""}
      `}
        >
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

        <input
          ref={inputRef}
          className="absolute opacity-0 pointer-events-none"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onKeyDown={handleKeyDown}
        />
      </section>
      {testStatus === "idle" && <Overlay handleStartClick={handleStartClick} />}
    </>
  );
}
