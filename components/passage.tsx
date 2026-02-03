import { useEffect, useState } from "react";

type PassageProps = {
  text: string;
  onStatsChange: (stats: {
    wpm: number;
    accuracy: number;
    elapsedMs: number;
  }) => void;
};

export default function Passage({ text, onStatsChange }: PassageProps) {
  const [input, setInput] = useState("");
  const [cursorIndex, setCursorIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const totalTyped = input.length;
  const errorCount = errors.size;

  const accuracy =
    totalTyped === 0
      ? 100
      : Math.round(((totalTyped - errorCount) / totalTyped) * 100);

  const elapsedMinutes = elapsedMs / 1000 / 60;

  const wpm =
    elapsedMinutes > 0 ? Math.round(totalTyped / 5 / elapsedMinutes) : 0;

  useEffect(() => {
    if (startTime === null) return;

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    onStatsChange({
      wpm,
      accuracy,
      elapsedMs,
    });
  }, [wpm, accuracy, elapsedMs, onStatsChange]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    const key = e.key;

    // start timer on first key press
    if (startTime === null) {
      const now = Date.now();
      setStartTime(now);
    }

    // BACKSPACE
    if (key === "Backspace") {
      if (cursorIndex === 0) return;

      setInput((prev) => prev.slice(0, -1));
      setCursorIndex((prev) => prev - 1);
      return;
    }

    // Ignore non-character keys for now
    if (key.length !== 1) return;

    // Prevent typing beyond passage length
    if (cursorIndex >= text.length) return;

    // Record error if incorrect (and never remove it)
    const expectedChar = text[cursorIndex];

    if (key !== expectedChar) {
      setErrors((prev) => {
        const next = new Set(prev);
        next.add(cursorIndex);
        return next;
      });
    }

    setInput((prev) => prev + key);
    setCursorIndex((prev) => prev + 1);
  }

  function getCharStatus(index: number) {
    if (index < input.length) {
      if (errors.has(index)) return "incorrect";
      return "correct";
    }

    return "pending";
  }

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

      <div className="mt-10 flex flex-col items-center gap-3">
        <button className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition">
          Start Typing Test
        </button>
        <p className="text-sm text-neutral-400">
          Or click the text and start typing
        </p>
      </div>
    </section>
  );
}
