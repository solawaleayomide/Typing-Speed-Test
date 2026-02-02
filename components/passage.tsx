const text = "The sun rose over the quiet town.";

export function Passage() {
  return (
    <section tabIndex={0} className="w-full max-w-5xl px-4 py-10 outline-none">
      <div className="text-lg leading-relaxed font-mono flex flex-wrap gap-[1px]">
        {text.split("").map((char, index) => (
          <span key={index} className="text-neutral-400">
            {char}
          </span>
        ))}
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
