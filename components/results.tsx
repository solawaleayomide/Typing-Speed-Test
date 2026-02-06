import Image from "next/image";

type ResultsProps = {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  onRestart: () => void;
};

export function Results({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  onRestart,
}: ResultsProps) {
  return (
    <div className="mt-2 w-full max-w-3xl p-6 text-center flex flex-col items-center gap-4">
      <Image
        src="/icon-completed.svg"
        alt="Icon Completed"
        width={60}
        height={60}
      />
      <div>
        <h2 className="text-[2rem] font-semibold text-neutral-100">
          Test Complete!
        </h2>
        <p className="text-sm text-neutral-500">
          Solid run. Keep pushing to beat your high score.
        </p>
      </div>

      {/* Stats grid */}
      <div className="mt-6 grid grid-cols-1 w-full md:grid-cols-3 gap-4 text-sm">
        <Stat label="WPM" value={wpm} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Characters" value={`${correctChars}/${incorrectChars}`} />
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="mt-8 rounded-md bg-white px-6 py-2 text-sm font-semibold text-neutral-950 hover:bg-opacity-80 transition"
      >
        Go Again
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-neutral-800 p-4 flex flex-col items-start">
      <p className="text-neutral-500">{label}:</p>
      <p className="mt-1 text-lg font-semibold text-neutral-100">{value}</p>
    </div>
  );
}
