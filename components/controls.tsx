"use client";
import { Difficulty, Mode } from "@/app/page";
import { MobileDropdown } from "./dropdown";

type ControlsProps = {
  difficulty: Difficulty;
  mode: Mode;
  onDifficultyChange: (value: Difficulty) => void;
  onModeChange: (value: Mode) => void;
  disabled?: boolean;
};

export function Controls({
  difficulty,
  mode,
  onDifficultyChange,
  onModeChange,
  disabled = false,
}: ControlsProps) {
  return (
    <div className="flex items-center gap-6 text-sm w-full justify-between md:justify-end">
      {/* ===== MOBILE (sm): DROPDOWNS ===== */}
      <div className="flex w-full gap-3 md:hidden">
        <MobileDropdown
          value={difficulty}
          onChange={onDifficultyChange}
          disabled={disabled}
          options={[
            { label: "Easy", value: "Easy" },
            { label: "Medium", value: "Medium" },
            { label: "Hard", value: "Hard" },
          ]}
        />

        <MobileDropdown
          value={mode}
          onChange={onModeChange}
          disabled={disabled}
          options={[
            { label: "Timed (60s)", value: "Timed (60s)" },
            { label: "Passage", value: "Passage" },
          ]}
        />
      </div>

      {/* ===== DESKTOP (md+): BUTTON GROUPS ===== */}
      <div
        className={`hidden md:flex items-center gap-6 ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Difficulty:</span>
          {(["Easy", "Medium", "Hard"] as Difficulty[]).map((level) => {
            const isActive = level === difficulty;

            return (
              <button
                key={level}
                disabled={disabled}
                onClick={() => onDifficultyChange(level)}
                className={`px-2.5 py-1 rounded-md border text-xs
                  ${
                    isActive
                      ? "bg-neutral-800 border-blue-500 text-blue-400"
                      : "border-neutral-700 text-neutral-400 hover:text-neutral-200"
                  }
                `}
              >
                {level}
              </button>
            );
          })}
        </div>

        {/* Mode */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Mode:</span>
          {(["Timed (60s)", "Passage"] as Mode[]).map((m) => {
            const isActive = m === mode;

            return (
              <button
                key={m}
                disabled={disabled}
                onClick={() => onModeChange(m)}
                className={`px-2.5 py-1 rounded-md border text-xs
                  ${
                    isActive
                      ? "bg-neutral-800 border-blue-500 text-blue-400"
                      : "border-neutral-700 text-neutral-400 hover:text-neutral-200"
                  }
                `}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
