export default function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: "16px", width: "100%" }}>
      {/* AI Avatar */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "linear-gradient(to bottom right, #3525cd, #4f46e5)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "1rem", fontVariationSettings: '"FILL" 1' }}
        >
          smart_toy
        </span>
      </div>

      {/* Thinking bubble */}
      <div
        style={{
          backgroundColor: "#eef0f3f4",
          color: "#464555",
          padding: "14px 20px",
          borderRadius: "16px 16px 16px 4px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
          AI is thinking
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: `rgba(53,37,205,${0.4 + i * 0.2})`,
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
