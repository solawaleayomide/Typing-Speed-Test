export function StatsBar() {
  return (
    <div className="flex justify-between items-center md:gap-6 text-sm">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
        WPM: <span className="font-semibold text-neutral-100">0</span>
      </div>
      <div className="flex flex-col md:flex-row items-center  gap-2 md:gap-4">
        Accuracy: <span className="font-semibold text-neutral-100">100%</span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
        Time: <span className="font-semibold text-neutral-100">0:60</span>
      </div>
    </div>
  );
}
