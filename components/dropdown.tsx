"use client";
import { useState } from "react";

type Option<T> = {
  label: string;
  value: T;
};

type MobileDropdownProps<T> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function MobileDropdown<T>({
  value,
  options,
  onChange,
  disabled = false,
}: MobileDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  function handleSelect(option: Option<T>) {
    if (disabled) return;

    onChange(option.value);
    setOpen(false);
  }

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full rounded-md border border-neutral-700 px-3 py-2 text-left text-sm
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-neutral-500"
          }
        `}
      >
        {options.find((o) => o.value === value)?.label}
      </button>

      {/* Options */}
      {open && !disabled && (
        <div className="absolute z-10 mt-2 w-full rounded-md border border-neutral-700 bg-neutral-900 shadow-lg">
          {options.map((option) => {
            const isActive = option.value === value;

            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-left
                  ${
                    isActive
                      ? "bg-neutral-800 text-blue-400"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }
                `}
              >
                {/* radio indicator */}
                <span
                  className={`h-3 w-3 rounded-full border
                    ${
                      isActive
                        ? "border-blue-400 bg-blue-400"
                        : "border-neutral-500"
                    }
                  `}
                />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
