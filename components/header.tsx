import Image from "next/image";

export function Header({ wpm }: { wpm: number }) {
  return (
    <header className="w-full max-w-6xl flex justify-between items-center py-6 px-4 mb-6">
      <Image
        src="/logo-large.svg"
        alt="Typing Speed Test Logo"
        width={200}
        height={200}
        className="hidden md:block"
      />

      <Image
        src="/logo-small.svg"
        alt="Typing Speed Test Logo"
        width={30}
        height={30}
        className="md:hidden"
      />

      <div className="flex items-center gap-2 text-sm md:text-base text-neutral-400">
        <Image
          src="/icon-personal-best.svg"
          alt="Best score"
          width={16}
          height={16}
        />

        <span>
          <span className="hidden md:inline">Personal best:</span>
          <span className="md:hidden">Best:</span>
          <span className="font-medium text-neutral-100"> 92</span>
        </span>
      </div>
    </header>
  );
}
