"use client";

import { useEffect, useRef, useState } from "react";
import { Overlay } from "./overlay";

/* -------------------- types -------------------- */

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

/* -------------------- component -------------------- */

export default function Passage({
  text,
  mode,
  onStatsChange,
  onTestStart,
  onTestFinish,
  testStatus,
}: PassageProps) {
  /* ---------- typing state ---------- */

  const [input, setInput] = useState("");
  const [cursorIndex, setCursorIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());

  /* ---------- timing state ---------- */

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  /* ---------- refs ---------- */

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  /* -------------------- derived stats -------------------- */

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

  /* -------------------- timer -------------------- */

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

  /* -------------------- sync stats -------------------- */

  useEffect(() => {
    onStatsChange({
      wpm,
      accuracy,
      elapsedMs: displayElapsedMs,
      correctChars: totalTyped - errorCount,
      incorrectChars: errorCount,
    });
  }, [wpm, accuracy, displayElapsedMs, totalTyped, errorCount, onStatsChange]);

  /* -------------------- mobile input handler -------------------- */

  function handleInputChange(value: string) {
    if (isFinished) return;

    /* start timer */
    if (startTime === null) {
      setStartTime(Date.now());
      onTestStart?.();
    }

    /* detect backspace */
    if (value.length < input.length) {
      setInput(value);
      setCursorIndex(value.length);
      return;
    }

    const newChar = value[value.length - 1];
    if (!newChar) return;

    if (cursorIndex >= text.length) return;

    const expectedChar = text[cursorIndex];

    if (newChar !== expectedChar) {
      setErrors((prev) => {
        const next = new Set(prev);
        next.add(cursorIndex);
        return next;
      });
    }

    setInput(value);

    const nextIndex = cursorIndex + 1;

    if (!isFinished && nextIndex >= text.length) {
      setIsFinished(true);
      onTestFinish?.();
    }

    setCursorIndex(nextIndex);
  }

  /* -------------------- desktop keyboard handler -------------------- */

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (isFinished) return;

    const key = e.key;

    if (startTime === null) {
      setStartTime(Date.now());
      onTestStart?.();
    }

    if (key === "Backspace") {
      if (cursorIndex === 0) return;

      setInput((prev) => prev.slice(0, -1));
      setCursorIndex((prev) => prev - 1);
      return;
    }

    if (key.length !== 1) return;
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

    const nextIndex = cursorIndex + 1;

    if (!isFinished && nextIndex >= text.length) {
      setIsFinished(true);
      onTestFinish?.();
    }

    setCursorIndex(nextIndex);
  }

  /* -------------------- start handler -------------------- */

  function handleStartClick() {
    inputRef.current?.focus();

    if (startTime === null) {
      setStartTime(Date.now());
      onTestStart?.();
    }
  }

  /* -------------------- render helpers -------------------- */

  function getCharStatus(index: number) {
    if (index < input.length) {
      return errors.has(index) ? "incorrect" : "correct";
    }
    return "pending";
  }

  /* -------------------- render -------------------- */

  return (
    <>
      <section
        ref={containerRef}
        onClick={() => inputRef.current?.focus()}
        className="relative w-full max-w-5xl px-4 py-10 outline-none"
      >
        {/* Hidden typing input */}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
        />

        {/* Passage text */}
        <div
          className={`
            text-lg leading-relaxed font-mono flex flex-wrap gap-[1px]
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
      </section>

      {/* Overlay */}
      {testStatus === "idle" && <Overlay handleStartClick={handleStartClick} />}
    </>
  );
}
