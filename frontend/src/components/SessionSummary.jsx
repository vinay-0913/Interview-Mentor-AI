import { useEffect, useState } from "react";
import { MODE_CONFIG } from "../prompts";

export default function SessionSummary({ feedbacks, mode, onNewSession }) {
  const config = MODE_CONFIG[mode];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const avgScore =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + (f.score || 0), 0) /
          feedbacks.length
        ).toFixed(1)
      : 0;

  const allImprovements = feedbacks.flatMap((f) => f.improvements || []);
  const allStrengths = feedbacks.flatMap((f) => f.strengths || []);

  const improvementCounts = {};
  allImprovements.forEach((imp) => {
    const key = imp.toLowerCase().trim();
    improvementCounts[key] = (improvementCounts[key] || 0) + 1;
  });

  const sortedWeakAreas = Object.entries(improvementCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([area]) => area.charAt(0).toUpperCase() + area.slice(1));

  const uniqueStrengths = [
    ...new Set(allStrengths.map((s) => s.toLowerCase().trim())),
  ]
    .slice(0, 5)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

  const getPerformanceLevel = (s) => {
    const num = parseFloat(s);
    if (num >= 8) return { label: "Excellent", color: "text-link bg-link/10 border-link/20" };
    if (num >= 6) return { label: "Good", color: "text-link bg-link/10 border-link/20" };
    if (num >= 4) return { label: "Average", color: "text-warning-deep bg-warning-soft border-warning/30" };
    return { label: "Needs work", color: "text-error bg-error-soft/60 border-error/20" };
  };

  const performance = getPerformanceLevel(avgScore);

  const tips = {
    DSA: [
      "Practice pattern recognition — most problems follow known templates.",
      "Always discuss time and space complexity.",
      "Start with brute force, then optimize step by step.",
      "Draw diagrams for tree/graph problems.",
      "Think out loud — interviewers value your thought process.",
    ],
    HR: [
      "Use the STAR method consistently for all answers.",
      "Quantify your impact with numbers when possible.",
      "Research the company culture before the interview.",
      "Prepare 3-4 stories that cover multiple competencies.",
      "Show enthusiasm and self-awareness.",
    ],
    Behavioral: [
      "Every story should have a clear beginning, middle, and end.",
      "Focus on YOUR contribution, not the team's.",
      "Include lessons learned and growth.",
      "Vary your stories — don't reuse the same one.",
      "Practice concise storytelling — 2 minutes per answer.",
    ],
    Technical: [
      "Understand the 'why' behind concepts, not just definitions.",
      "Relate theory to practical applications when explaining.",
      "Use clear examples and analogies.",
      "Structure your answers with a logical flow.",
      "Be honest about what you don't know — then reason through it.",
    ],
  };

  const currentTips = tips[mode] || [];

  // SVG Ring
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = mounted
    ? circumference - (avgScore / 10) * circumference
    : circumference;

  return (
    <div className="w-full min-h-screen flex flex-col bg-canvas-soft text-ink" style={{ fontFamily: "var(--font-sans)" }}>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Page title */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-normal tracking-wide uppercase text-mute mb-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Session Complete
          </span>
          <h1
            className="text-ink font-semibold"
            style={{
              fontSize: "clamp(24px, 5vw, 32px)",
              letterSpacing: "-1.28px",
              lineHeight: "1.25",
            }}
          >
            Your {config?.title || mode} results.
          </h1>
        </div>

        {/* ─── Hero Score Section ─── */}
        <section className="mb-16 relative">
          <div className="flex flex-col sm:flex-row items-center gap-10 bg-canvas rounded-[12px] p-8 sm:p-12 shadow-level-4 border border-hairline">
            {/* Circular Progress Ring */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                <circle
                  cx="96" cy="96" r="88" fill="transparent"
                  stroke="var(--color-hairline)" strokeWidth="10"
                />
                <circle
                  cx="96" cy="96" r="88" fill="transparent"
                  stroke="var(--color-ink)" strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-ink font-semibold"
                  style={{ fontSize: "48px", letterSpacing: "-2.4px", lineHeight: "1" }}
                >
                  {avgScore}
                </span>
                <span
                  className="text-mute mt-1"
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Overall Score
                </span>
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h2
                className="text-ink font-semibold mb-3"
                style={{
                  fontSize: "clamp(20px, 4vw, 24px)",
                  letterSpacing: "-0.96px",
                  lineHeight: "32px",
                }}
              >
                Great work on your session.
              </h2>
              <p className="text-body text-base leading-6 max-w-lg mb-5">
                You've completed your {config?.title || mode} practice. Review the
                insights below to continue improving your interview performance.
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className={`inline-flex items-center h-6 px-2.5 text-xs font-medium rounded-full border ${performance.color}`}>
                  {performance.label}
                </span>
                <span className="inline-flex items-center h-6 px-2.5 text-xs font-medium text-body bg-canvas-soft-2 rounded-full border border-hairline">
                  {feedbacks.length} {feedbacks.length === 1 ? "question" : "questions"} answered
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Main Insights Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Your Strengths Card */}
          <div className="bg-canvas rounded-[8px] p-6 shadow-level-3 border border-hairline hover:-translate-y-0.5 hover:shadow-level-4 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-[8px] bg-link/10 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-link text-lg"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  check_circle
                </span>
              </div>
              <h3
                className="text-ink font-semibold"
                style={{ fontSize: "20px", letterSpacing: "-0.6px", lineHeight: "28px" }}
              >
                Your strengths
              </h3>
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-4 flex-grow">
              {uniqueStrengths.length > 0 ? (
                uniqueStrengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-link text-base mt-0.5">done</span>
                    <span className="text-body text-sm leading-5">{s}</span>
                  </li>
                ))
              ) : (
                <li className="text-mute text-sm">
                  No distinct strengths identified yet. Keep practicing!
                </li>
              )}
            </ul>
          </div>

          {/* Areas to Improve Card */}
          <div className="bg-canvas rounded-[8px] p-6 shadow-level-3 border border-hairline hover:-translate-y-0.5 hover:shadow-level-4 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-[8px] bg-warning-soft flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-warning-deep text-lg"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  trending_up
                </span>
              </div>
              <h3
                className="text-ink font-semibold"
                style={{ fontSize: "20px", letterSpacing: "-0.6px", lineHeight: "28px" }}
              >
                Areas to improve
              </h3>
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-4 flex-grow">
              {sortedWeakAreas.length > 0 ? (
                sortedWeakAreas.map((area, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-warning text-base mt-0.5">add_circle</span>
                    <span className="text-body text-sm leading-5">{area}</span>
                  </li>
                ))
              ) : (
                <li className="text-mute text-sm">
                  No major areas of improvement identified. Great job!
                </li>
              )}
            </ul>
          </div>

          {/* Pro Tips Card */}
          <div className="bg-canvas rounded-[8px] p-6 shadow-level-3 border border-hairline hover:-translate-y-0.5 hover:shadow-level-4 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-[8px] bg-violet/10 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-violet text-lg"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  lightbulb
                </span>
              </div>
              <h3
                className="text-ink font-semibold"
                style={{ fontSize: "20px", letterSpacing: "-0.6px", lineHeight: "28px" }}
              >
                Pro tips for {mode}
              </h3>
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-4 flex-grow">
              {currentTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-violet text-base mt-0.5">auto_awesome</span>
                  <span className="text-body text-sm leading-5">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Action Section ─── */}
        <section className="mt-16 text-center">
          <div className="h-px bg-hairline w-full mb-8" />
          <button
            onClick={onNewSession}
            className="h-12 px-8 text-base font-medium text-white bg-ink rounded-[100px] cursor-pointer hover:opacity-85 transition-opacity"
          >
            Start New Session
          </button>
        </section>
      </main>
    </div>
  );
}
