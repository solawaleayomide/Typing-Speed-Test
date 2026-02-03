type StatsBarProps = {
  wpm: number;
  accuracy: number;
  elapsedMs: number;
};

export function StatsBar({ wpm, accuracy, elapsedMs }: StatsBarProps) {
  const seconds = Math.floor(elapsedMs / 1000);

  return (
    <div className="flex justify-between items-center md:gap-6 text-sm">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
        WPM: <span className="font-semibold text-neutral-100">{wpm}</span>
      </div>
      <div className="flex flex-col md:flex-row items-center  gap-2 md:gap-4">
        Accuracy:{" "}
        <span className="font-semibold text-neutral-100">{accuracy}%</span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
        Time: <span className="font-semibold text-neutral-100">{seconds}s</span>
      </div>
    </div>
  );
}
