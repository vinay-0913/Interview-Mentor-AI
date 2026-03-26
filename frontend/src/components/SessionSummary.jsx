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
      ? (feedbacks.reduce((sum, f) => sum + (f.score || 0), 0) / feedbacks.length).toFixed(1)
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

  const uniqueStrengths = [...new Set(allStrengths.map((s) => s.toLowerCase().trim()))]
    .slice(0, 5)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

  const getPerformanceLevel = (s) => {
    const num = parseFloat(s);
    if (num >= 8) return { label: "Excellent Performance", emoji: "🌟" };
    if (num >= 6) return { label: "Good Performance", emoji: "👍" };
    if (num >= 4) return { label: "Average Performance", emoji: "📈" };
    return { label: "Needs Improvement", emoji: "💪" };
  };

  const performance = getPerformanceLevel(avgScore);

  const tips = {
    DSA: [
      "Practice pattern recognition — most problems follow known templates",
      "Always discuss time and space complexity",
      "Start with brute force, then optimize step by step",
      "Draw diagrams for tree/graph problems",
      "Think out loud — interviewers value your thought process",
    ],
    HR: [
      "Use the STAR method consistently for all answers",
      "Quantify your impact with numbers when possible",
      "Research the company culture before the interview",
      "Prepare 3-4 stories that cover multiple competencies",
      "Show enthusiasm and self-awareness",
    ],
    Behavioral: [
      "Every story should have a clear beginning, middle, and end",
      "Focus on YOUR contribution, not the team's",
      "Include lessons learned and growth",
      "Vary your stories — don't reuse the same one",
      "Practice concise storytelling — 2 minutes per answer",
    ],
  };

  const currentTips = tips[mode] || [];

  // SVG Ring calculations
  const radius = 88;
  const circumference = 2 * Math.PI * radius; // 552.92
  const dashoffset = mounted ? circumference - (avgScore / 10) * circumference : circumference;

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#191c1d",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main
        style={{
          flexGrow: 1,
          maxWidth: "80rem",
          margin: "0 auto",
          width: "100%",
          padding: "48px 24px",
          boxSizing: "border-box"
        }}
      >
        <h1
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "clamp(2.25rem, 5vw, 3rem)",
            fontWeight: 800,
            color: "#3525cd",
            marginBottom: "32px",
            letterSpacing: "-0.025em",
            textAlign: "center",
          }}
        >
          Session Summary
        </h1>

        {/* Hero Score Section */}
        <section style={{ marginBottom: "64px", position: "relative" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "48px",
              backgroundColor: "#ffffff",
              padding: "48px",
              borderRadius: "24px",
              boxShadow: "0 20px 40px -12px rgba(25, 28, 29, 0.06)",
              border: "1px solid rgba(199,196,216,0.2)",
              flexWrap: "wrap",
            }}
          >
            {/* Circular Progress Ring */}
            <div
              style={{
                position: "relative",
                width: "192px",
                height: "192px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <svg
                style={{
                  width: "100%",
                  height: "100%",
                  transform: "rotate(-90deg)",
                }}
              >
                <circle
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="#e1e3e4"
                  strokeWidth="12"
                ></circle>
                <circle
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="#3525cd"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                  strokeWidth="12"
                  style={{ transition: "stroke-dashoffset 1s ease-out" }}
                ></circle>
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: "#191c1d",
                  }}
                >
                  {avgScore}
                </span>
                <span
                  style={{
                    color: "#464555",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                  }}
                >
                  Overall Score
                </span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: "300px" }}>
              <h2
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "clamp(1.875rem, 4vw, 2.25rem)",
                  fontWeight: 700,
                  color: "#191c1d",
                  marginBottom: "16px",
                }}
              >
                Great work!
              </h2>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "#464555",
                  maxWidth: "42rem",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                You've completed your {config.title} practice.
                Review the insights below to continue improving your interview performance.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <span
                  style={{
                    padding: "6px 16px",
                    backgroundColor: "#ffdbcc",
                    color: "#7b2f00",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {parseFloat(avgScore) >= 7 ? "High Confidence" : "Gaining Confidence"}
                </span>
                <span
                  style={{
                    padding: "6px 16px",
                    backgroundColor: "#e2dfff",
                    color: "#413f82",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {performance.label}
                </span>
              </div>
            </div>
          </div>
          {/* Decorative Element */}
          <div
            style={{
              position: "absolute",
              top: "-24px",
              right: "-24px",
              width: "128px",
              height: "128px",
              backgroundColor: "rgba(53,37,205,0.05)",
              borderRadius: "50%",
              filter: "blur(48px)",
              pointerEvents: "none",
            }}
          ></div>
        </section>

        {/* Main Insights Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
          }}
        >
          {/* Your Strengths Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "32px",
              borderRadius: "24px",
              boxShadow: "0 20px 40px -12px rgba(25, 28, 29, 0.06)",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#ecfdf5",
                  borderRadius: "16px",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.875rem", fontVariationSettings: '"FILL" 1' }}>
                  check_circle
                </span>
              </div>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.5rem", fontWeight: 700 }}>Your Strengths</h3>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "24px", flexGrow: 1 }}>
              {uniqueStrengths.length > 0 ? (
                uniqueStrengths.map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: "16px" }}>
                    <span className="material-symbols-outlined" style={{ color: "#10b981", marginTop: "2px" }}>done</span>
                    <span style={{ color: "#464555", lineHeight: 1.6 }}>{s}</span>
                  </li>
                ))
              ) : (
                <li style={{ color: "#777587" }}>No distinct strengths identified yet. Keep practicing!</li>
              )}
            </ul>
          </div>

          {/* Areas to Improve Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "32px",
              borderRadius: "24px",
              boxShadow: "0 20px 40px -12px rgba(25, 28, 29, 0.06)",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fff7ed",
                  borderRadius: "16px",
                  color: "#ea580c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.875rem", fontVariationSettings: '"FILL" 1' }}>
                  trending_up
                </span>
              </div>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.5rem", fontWeight: 700 }}>Areas to Improve</h3>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "24px", flexGrow: 1 }}>
              {sortedWeakAreas.length > 0 ? (
                sortedWeakAreas.map((area, i) => (
                  <li key={i} style={{ display: "flex", gap: "16px" }}>
                    <span className="material-symbols-outlined" style={{ color: "#f97316", marginTop: "2px" }}>add_circle</span>
                    <span style={{ color: "#464555", lineHeight: 1.6 }}>{area}</span>
                  </li>
                ))
              ) : (
                <li style={{ color: "#777587" }}>No major areas of improvement identified. Great job!</li>
              )}
            </ul>
          </div>

          {/* Pro Tips Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "32px",
              borderRadius: "24px",
              boxShadow: "0 20px 40px -12px rgba(25, 28, 29, 0.06)",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#eef2ff",
                  borderRadius: "16px",
                  color: "#3525cd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.875rem", fontVariationSettings: '"FILL" 1' }}>
                  lightbulb
                </span>
              </div>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.5rem", fontWeight: 700 }}>Pro Tips for {mode}</h3>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "24px", flexGrow: 1 }}>
              {currentTips.map((tip, i) => (
                <li key={i} style={{ display: "flex", gap: "16px" }}>
                  <span className="material-symbols-outlined" style={{ color: "#3525cd", marginTop: "2px" }}>auto_awesome</span>
                  <span style={{ color: "#464555", lineHeight: 1.6 }}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Section */}
        <section style={{ marginTop: "64px", textAlign: "center" }}>
          <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(199,196,216,0.3), transparent)", width: "100%", marginBottom: "32px" }}></div>
          <button
            onClick={onNewSession}
            style={{
              padding: "16px 40px",
              background: "linear-gradient(to bottom right, #3525cd, #4f46e5)",
              color: "#ffffff",
              borderRadius: "16px",
              fontWeight: 700,
              fontSize: "1.125rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 10px 25px -5px rgba(53,37,205,0.25), 0 8px 10px -6px rgba(53,37,205,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Start New Session
          </button>
        </section>
      </main>
    </div>
  );
}
