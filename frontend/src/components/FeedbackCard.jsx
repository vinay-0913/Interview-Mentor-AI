import { useState } from "react";

export default function FeedbackCard({ feedback }) {
  const [showIdeal, setShowIdeal] = useState(false);

  if (!feedback) return null;

  const { score, strengths, improvements, ideal_answer } = feedback;

  const getScoreColor = (s) => {
    if (s >= 8) return "from-emerald-500 to-green-600";
    if (s >= 5) return "from-amber-500 to-yellow-600";
    return "from-red-500 to-orange-600";
  };

  const getScoreBg = (s) => {
    if (s >= 8) return "bg-emerald-500/10 border-emerald-500/30";
    if (s >= 5) return "bg-amber-500/10 border-amber-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  const getScoreLabel = (s) => {
    if (s >= 9) return "Excellent";
    if (s >= 7) return "Good";
    if (s >= 5) return "Average";
    if (s >= 3) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="mt-4 rounded-xl glass-card overflow-hidden animate-fadeInUp">
      {/* Header with score */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Evaluation
        </h4>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getScoreBg(score)}`}>
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getScoreColor(score)} flex items-center justify-center text-sm font-bold text-white`}>
            {score}
          </div>
          <span className="text-sm font-medium text-slate-300">{getScoreLabel(score)}/10</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div>
            <h5 className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Strengths
            </h5>
            <ul className="space-y-1.5">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements && improvements.length > 0 && (
          <div>
            <h5 className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Areas to Improve
            </h5>
            <ul className="space-y-1.5">
              {improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
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
              className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${showIdeal ? "rotate-90" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {showIdeal ? "Hide" : "Show"} Ideal Answer
            </button>
            {showIdeal && (
              <div className="mt-2 p-3 rounded-lg bg-indigo-500/8 border border-indigo-500/15 text-sm text-slate-300 leading-relaxed animate-fadeIn">
                {ideal_answer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
