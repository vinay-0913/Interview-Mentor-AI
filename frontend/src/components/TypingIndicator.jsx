export default function TypingIndicator() {
  return (
    <div className="flex gap-3 w-full">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-full bg-ink shrink-0 flex items-center justify-center">
        <span
          className="material-symbols-outlined text-white"
          style={{ fontSize: "14px", fontVariationSettings: '"FILL" 1' }}
        >
          smart_toy
        </span>
      </div>

      {/* Thinking bubble */}
      <div className="bg-canvas border border-hairline rounded-[8px] shadow-level-2 flex items-center gap-2 px-5 py-3">
        <span className="text-sm font-medium text-body">
          AI is thinking
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-ink"
              style={{
                opacity: 0.3 + i * 0.2,
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: `${-0.15 * i}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
