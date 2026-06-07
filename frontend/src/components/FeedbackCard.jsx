import { useState } from "react";

export default function FeedbackCard({ feedback }) {
  const [showIdeal, setShowIdeal] = useState(false);

  if (!feedback) return null;

  const { score, strengths, improvements, ideal_answer } = feedback;

  const getScoreColor = (s) => {
    if (s >= 8) return "text-link bg-link/10 border-link/20";
    if (s >= 5) return "text-warning-deep bg-warning-soft border-warning/30";
    return "text-error bg-error-soft border-error/20";
  };

  const getScoreLabel = (s) => {
    if (s >= 9) return "Excellent";
    if (s >= 7) return "Good";
    if (s >= 5) return "Average";
    if (s >= 3) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="mt-4 rounded-[8px] bg-canvas-soft border border-hairline overflow-hidden animate-fadeInUp">
      {/* Header with score */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
        <span
          className="text-xs font-normal tracking-wide uppercase text-mute"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Evaluation
        </span>
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${getScoreColor(score)}`}>
          <span className="text-sm font-semibold">{score}</span>
          <span className="text-xs font-medium">{getScoreLabel(score)}/10</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div>
            <h5 className="flex items-center gap-2 text-sm font-medium text-link mb-2">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: '"FILL" 1' }}>
                check_circle
              </span>
              Strengths
            </h5>
            <ul className="space-y-1.5 list-none p-0 m-0">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-body">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-link shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements && improvements.length > 0 && (
          <div>
            <h5 className="flex items-center gap-2 text-sm font-medium text-warning-deep mb-2">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: '"FILL" 1' }}>
                trending_up
              </span>
              Areas to Improve
            </h5>
            <ul className="space-y-1.5 list-none p-0 m-0">
              {improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-body">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ideal Answer (collapsible) */}
        {ideal_answer && (
          <div>
            <button
              onClick={() => setShowIdeal(!showIdeal)}
              className="flex items-center gap-2 text-sm font-medium text-link hover:text-link-deep transition-colors cursor-pointer"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <span
                className="material-symbols-outlined text-base transition-transform duration-200"
                style={{ transform: showIdeal ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                chevron_right
              </span>
              {showIdeal ? "Hide" : "Show"} Ideal Answer
            </button>
            {showIdeal && (
              <div className="mt-2 p-3 rounded-[6px] bg-link/5 border border-link/15 text-sm text-body leading-relaxed animate-fadeIn">
                {ideal_answer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
