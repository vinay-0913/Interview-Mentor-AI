import { useState, useEffect } from "react";
import { MODE_CONFIG } from "../prompts";


const MODE_CARDS = [
  {
    key: "DSA",
    icon: "code",
    title: "DSA Practice",
    description: "Master algorithms and data structures with real-time complexity analysis and structured problem solving.",
  },
  {
    key: "HR",
    icon: "work",
    title: "HR Interview",
    description: "Polish your professional pitch and cultural fit responses with structured STAR-format coaching.",
  },
  {
    key: "Behavioral",
    icon: "psychology",
    title: "Behavioral",
    description: "Nail the STAR method for complex situational, leadership, and conflict resolution questions.",
  },
  {
    key: "Technical",
    icon: "dns",
    title: "Technical",
    description: "CS fundamentals — OOPs, DBMS, Computer Networks & Operating Systems with structured Q&A.",
  },
];

export default function Landing({ onSelectMode }) {
  const handleModeClick = (mode) => {
    onSelectMode(mode);
  };

  /* ─── Typing animation ─── */
  const words = ["Practice.", "Improve.", "Get hired."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let typingSpeed = isDeleting ? 50 : 120;

    if (!isDeleting && currentText === currentWord) {
      const pause = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pause);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentText(
        isDeleting
          ? currentWord.substring(0, currentText.length - 1)
          : currentWord.substring(0, currentText.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex]);

  /* ─── Gradient word cycling ─── */
  const gradientWords = [
    { text: "Practice.", className: "gradient-text-develop" },
    { text: "Improve.", className: "gradient-text-preview" },
    { text: "Get hired.", className: "gradient-text-ship" },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-canvas-soft text-ink" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ─── Navigation Bar ─── */}
      <header
        className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-xl border-b border-hairline"
        style={{ height: "64px" }}
      >
        <div className="flex items-center justify-between h-full px-6 max-w-[1400px] mx-auto">
          {/* Logo */}
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            Interview Mentor AI
          </span>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <a href="#" className="px-3 py-1.5 text-sm text-body hover:text-ink rounded-full transition-colors">
              Home
            </a>
            <a href="#practice-cards" className="px-3 py-1.5 text-sm text-body hover:text-ink rounded-full transition-colors">
              Practice
            </a>
            <a href="#" className="px-3 py-1.5 text-sm text-body hover:text-ink rounded-full transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-3">

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex items-center p-2 text-body hover:text-ink transition-colors"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <span className="material-symbols-outlined text-xl">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-hairline bg-canvas/95 backdrop-blur-xl animate-fadeIn">
            <div className="flex flex-col py-2 px-6">
              <a href="#" onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-sm text-body hover:text-ink no-underline transition-colors">
                Home
              </a>
              <a href="#practice-cards" onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-sm text-body hover:text-ink no-underline transition-colors">
                Practice
              </a>
              <a href="#" onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-sm text-body hover:text-ink no-underline transition-colors">
                Pricing
              </a>

            </div>
          </div>
        )}
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1">

        {/* ─── Hero Band ─── */}
        <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center">
          {/* Mesh gradient backdrop */}
          <div className="absolute inset-0 mesh-gradient opacity-60" />

          <div className="relative max-w-[1000px] mx-auto px-6 py-16 sm:py-24 text-center">
            {/* Mono eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-canvas-soft-2 border border-hairline">
              <span className="material-symbols-outlined text-sm text-mute" style={{ fontSize: "14px" }}>
                auto_awesome
              </span>
              <span className="text-xs font-normal tracking-normal text-body" style={{ fontFamily: "var(--font-mono)" }}>
                AI-Powered Interview Platform
              </span>
            </div>

            {/* Headline — display-xl */}
            <h1
              className="text-ink font-semibold leading-none animate-fadeInUp"
              style={{
                fontSize: "clamp(36px, 7vw, 48px)",
                letterSpacing: "-2.4px",
                lineHeight: "1",
              }}
            >
              Crack your next interview.
            </h1>

            {/* Animated gradient words */}
            <div className="h-14 sm:h-16 flex items-center justify-center mt-4 mb-6">
              <span
                className="font-semibold gradient-text-develop"
                style={{
                  fontSize: "clamp(28px, 5vw, 48px)",
                  letterSpacing: "-2.4px",
                  lineHeight: "1",
                }}
              >
                {currentText}
                <span
                  className="text-ink font-normal"
                  style={{
                    animation: "blink 1s step-end infinite",
                    WebkitTextFillColor: "var(--color-ink)",
                  }}
                >
                  |
                </span>
              </span>
            </div>

            {/* Body lead — body-lg */}
            <p className="text-body text-lg leading-7 max-w-xl mx-auto mb-10">
              Master the technical, HR, and behavioral skills needed to land your dream role — with real-time AI feedback.
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() =>
                  document.getElementById("practice-cards").scrollIntoView({ behavior: "smooth" })
                }
                className="h-12 px-6 text-base font-medium text-white bg-ink rounded-[100px] cursor-pointer hover:opacity-85 transition-opacity"
                id="cta-start"
              >
                Start Free Session
              </button>
              <a
                href="#practice-cards"
                className="h-12 px-6 text-base font-medium text-ink bg-canvas rounded-[100px] border border-hairline cursor-pointer hover:border-hairline-strong transition-colors flex items-center no-underline shadow-level-2"
              >
                View Modes
              </a>
            </div>
          </div>
        </section>

        {/* ─── Interview Mode Cards ─── */}
        <section
          id="practice-cards"
          className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 sm:py-32"
        >
          {/* Section header */}
          <div className="text-center mb-12 sm:mb-16">
            <span
              className="inline-block text-xs font-normal tracking-wide uppercase text-mute mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Practice Modes
            </span>
            <h2
              className="text-ink font-semibold"
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                letterSpacing: "-1.28px",
                lineHeight: "1.25",
              }}
            >
              Choose your interview mode.
            </h2>
            <p className="text-body text-base mt-3 max-w-lg mx-auto">
              Select a mode to begin your personalized practice session with real-time AI evaluation.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {MODE_CARDS.map((card) => (
              <div
                key={card.key}
                onClick={() => handleModeClick(card.key)}
                className="group bg-canvas rounded-[8px] p-6 cursor-pointer shadow-level-2 hover:shadow-level-4 hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-[8px] bg-canvas-soft-2 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-ink text-xl">
                    {card.icon}
                  </span>
                </div>

                {/* Title — display-sm */}
                <h3
                  className="text-ink font-semibold mb-2"
                  style={{ fontSize: "20px", letterSpacing: "-0.6px", lineHeight: "28px" }}
                >
                  {card.title}
                </h3>

                {/* Description — body-md */}
                <p className="text-body text-sm leading-5 mb-5" style={{ letterSpacing: "-0.28px" }}>
                  {card.description}
                </p>

                {/* Link */}
                <div className="flex items-center text-sm font-medium text-ink group-hover:gap-2 transition-all duration-300">
                  <span>Start practice</span>
                  <span className="material-symbols-outlined text-base ml-1 group-hover:translate-x-1 transition-transform duration-300">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Features Band (Dark) ─── */}
        <section className="bg-ink text-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 sm:py-32">
            <div className="text-center mb-16">
              <span
                className="inline-block text-xs font-normal tracking-wide uppercase text-hairline-strong mb-4"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Why Interview Mentor AI
              </span>
              <h2
                className="text-white font-semibold"
                style={{
                  fontSize: "clamp(24px, 4vw, 32px)",
                  letterSpacing: "-1.28px",
                  lineHeight: "1.25",
                }}
              >
                Built for candidates who want to win.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  icon: "bolt",
                  title: "Real-time AI feedback.",
                  description: "Get instant, structured evaluation on every answer with scoring, strengths, and actionable improvements.",
                },
                {
                  icon: "psychology",
                  title: "Adaptive questioning.",
                  description: "Our AI adjusts difficulty based on your proficiency level and previous responses for personalized practice.",
                },
                {
                  icon: "trending_up",
                  title: "Track your progress.",
                  description: "Comprehensive session summaries with performance analytics, pro tips, and areas to improve.",
                },
              ].map((feature) => (
                <div key={feature.title} className="text-center sm:text-left">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <span className="material-symbols-outlined text-white text-xl">{feature.icon}</span>
                  </div>
                  <h3
                    className="text-white font-semibold mb-2"
                    style={{ fontSize: "20px", letterSpacing: "-0.6px", lineHeight: "28px" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-hairline-strong text-sm leading-5" style={{ letterSpacing: "-0.28px" }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Band ─── */}
        <section className="bg-canvas-soft">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
            <h2
              className="text-ink font-semibold mb-4"
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                letterSpacing: "-1.28px",
                lineHeight: "1.25",
              }}
            >
              Ready to ace your next interview?
            </h2>
            <p className="text-body text-base max-w-lg mx-auto mb-8">
              Start practicing now with our AI-powered interview mentor. No setup required.
            </p>
            <button
              onClick={() =>
                document.getElementById("practice-cards").scrollIntoView({ behavior: "smooth" })
              }
              className="h-12 px-8 text-base font-medium text-white bg-ink rounded-[100px] cursor-pointer hover:opacity-85 transition-opacity"
            >
              Get Started
            </button>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-canvas border-t border-hairline">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            {/* Logo */}
            <div>
              <span className="text-sm font-semibold text-ink">Interview Mentor AI</span>
              <p className="text-xs text-mute mt-1">AI-powered interview preparation.</p>
            </div>

            {/* Links */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <a href="#" className="text-sm text-body hover:text-ink no-underline transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-body hover:text-ink no-underline transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-body hover:text-ink no-underline transition-colors">Contact Support</a>
            </div>
          </div>

          <div className="border-t border-hairline mt-8 pt-8">
            <p className="text-xs text-mute">
              © {new Date().getFullYear()} Interview Mentor AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
