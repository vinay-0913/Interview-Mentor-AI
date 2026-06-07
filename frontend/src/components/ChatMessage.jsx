import { useState } from "react";
import FeedbackCard from "./FeedbackCard";
import { renderMarkdown } from "../markdown";

export default function ChatMessage({ message, isUser }) {
  const [copied, setCopied] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar — AI only */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-ink shrink-0 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: "14px", fontVariationSettings: '"FILL" 1' }}
          >
            smart_toy
          </span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[85%] relative group ${
          isUser
            ? "bg-ink text-white rounded-[8px]"
            : "bg-canvas text-ink border border-hairline rounded-[8px] shadow-level-2"
        }`}
        style={{ padding: "16px 20px" }}
        onMouseEnter={() => setShowCopy(true)}
        onMouseLeave={() => setShowCopy(false)}
      >
        <div
          className="text-[15px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />

        {/* Feedback card inline */}
        {message.feedback && <FeedbackCard feedback={message.feedback} />}

        {/* Copy button — AI messages only */}
        {!isUser && (
          <button
            onClick={handleCopy}
            title="Copy response"
            className={`absolute -top-2 -right-2 p-1.5 rounded-[6px] bg-canvas border border-hairline cursor-pointer flex items-center shadow-level-2 transition-opacity duration-200 ${
              showCopy ? "opacity-100" : "opacity-0"
            }`}
            style={{ border: "1px solid var(--color-hairline)" }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "14px",
                color: copied ? "#0070f3" : "var(--color-mute)",
              }}
            >
              {copied ? "check" : "content_copy"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
