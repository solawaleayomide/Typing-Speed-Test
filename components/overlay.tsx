export function Overlay({
  handleStartClick,
}: {
  handleStartClick: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3 pointer-events-auto">
        <button
          onClick={handleStartClick}
          className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition shadow-lg"
        >
          Start Typing Test
        </button>

        {/* <p className="text-sm text-neutral-400">
          Or click the text and start typing
        </p> */}
      </div>
    </div>
  );
}
