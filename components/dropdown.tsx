"use client";

import { useState } from "react";

type Option<T> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function MobileDropdown<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm flex justify-between items-center"
      >
        <span>{value}</span>
        <span className="text-neutral-400">▼</span>
      </button>

      {/* Options */}
      {open && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-900 shadow-lg overflow-hidden">
          {options.map((option) => {
            const isActive = option.value === value;

            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left
                  ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
              >
                {/* Radio */}
                <span
                  className={`w-3 h-3 rounded-full border flex items-center justify-center
                      ${isActive ? "border-blue-400" : "border-neutral-500"}`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </span>

                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
