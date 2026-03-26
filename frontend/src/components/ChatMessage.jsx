import { useState } from "react";
import FeedbackCard from "./FeedbackCard";
import { renderMarkdown } from "../markdown";

export default function ChatMessage({ message, isUser }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        width: "100%",
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      {/* Avatar — AI only */}
      {!isUser && (
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
      )}

      {/* Bubble */}
      <div
        style={{
          maxWidth: "85%",
          padding: "20px",
          borderRadius: isUser
            ? "16px 16px 4px 16px"
            : "16px 16px 16px 4px",
          background: isUser
            ? "linear-gradient(to bottom right, #3525cd, #4f46e5)"
            : "#eef0f3f4",
          color: isUser ? "#eef0f3f4" : "#191c1d",
          boxShadow: isUser
            ? "0 4px 12px rgba(53,37,205,0.2)"
            : "0 1px 3px rgba(0,0,0,0.06)",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.6,
          }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />

        {/* Copy button — AI messages only */}
        {!isUser && (
          <button
            onClick={handleCopy}
            title="Copy response"
            style={{
              position: "absolute",
              top: "-12px",
              right: "-12px",
              opacity: 0,
              padding: "6px",
              borderRadius: "8px",
              backgroundColor: "#eef0f3f4",
              border: "1px solid #e1e3e4",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "0.875rem", color: copied ? "#16a34a" : "#64748b" }}
            >
              {copied ? "check" : "content_copy"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
