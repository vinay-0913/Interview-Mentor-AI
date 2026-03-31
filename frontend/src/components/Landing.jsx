import React, { useState, useEffect } from "react";
import { MODE_CONFIG } from "../prompts";
import { useUser, useClerk, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function Landing({ onSelectMode }) {
  const { isSignedIn } = useUser();
  const clerk = useClerk();

  const handleModeClick = (mode) => {
    if (isSignedIn) {
      onSelectMode(mode);
    } else {
      clerk.openSignIn();
    }
  };

  const words = ["Practice.", "Improve.", "Get Hired."];
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

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: "#f8f9fa",
        color: "#4c5153ff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ─── Responsive Styles ─── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Nav */
        .landing-nav-links { display: flex; align-items: center; gap: 32px; }
        .landing-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; color: #38393c; }
        .landing-mobile-menu {
          display: none;
          flex-direction: column;
          gap: 8px;
          padding: 12px 24px 16px;
          background: rgba(255,255,255,0.97);
          border-bottom: 1px solid rgba(199,196,216,0.3);
        }
        .landing-mobile-menu.open { display: flex; }
        .landing-mobile-menu a {
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 1rem;
        }
        .landing-mobile-menu a:hover { background: #f3f4f5; }

        /* Cards grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        /* Footer */
        .footer-inner {
          max-width: 80rem;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 32px;
        }
        .footer-links {
          display: flex;
          gap: 32px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #464555;
          flex-wrap: wrap;
        }

        /* ─── Tablet (≤ 1024px) ─── */
        @media (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        /* ─── Mobile (≤ 640px) ─── */
        @media (max-width: 640px) {
          .landing-nav-links { display: none !important; }
          .landing-hamburger { display: flex !important; }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .footer-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            text-align: left;
          }
          .footer-links {
            gap: 16px;
            flex-direction: column;
          }

          .hero-section {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          .selection-section {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-bottom: 64px !important;
          }

          .header-logo-text {
            font-size: 1rem !important;
          }
        }

        /* ─── Medium (641px – 1024px) ─── */
        @media (min-width: 641px) and (max-width: 1024px) {
          .hero-section {
            padding-top: 56px !important;
            padding-bottom: 56px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .selection-section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>

      {/* ─── TopAppBar ─── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className="header-logo-text"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#38393cff",
              }}
            >
              Interview Mentor AI
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="landing-nav-links">
            <a
              href="#"
              style={{
                color: "#4f46e5",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "background-color 0.2s",
              }}
            >
              Home
            </a>
            <a
              href="#"
              style={{
                color: "#64748b",
                padding: "4px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "background-color 0.2s",
              }}
            >
              Practice
            </a>
            <a
              href="#"
              style={{
                color: "#64748b",
                padding: "4px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "background-color 0.2s",
              }}
            >
              Pricing
            </a>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  style={{
                    padding: "8px 20px",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#475569",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                >
                  Log In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            {/* Hamburger – visible only on mobile via CSS */}
            <button
              className="landing-hamburger"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`landing-mobile-menu${mobileMenuOpen ? " open" : ""}`}>
          <a href="#" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#" onClick={() => setMobileMenuOpen(false)}>Practice</a>
          <a href="#" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main
        style={{
          position: "relative",
          flex: 1,
          background:
            "radial-gradient(circle at top right, #e2dfff 0%, transparent 40%), radial-gradient(circle at bottom left, #dad7ff 0%, transparent 30%)",
        }}
      >
        {/* ─── Hero Section ─── */}
        <section
          className="hero-section"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "64px",
            paddingBottom: "64px",
            paddingLeft: "24px",
            paddingRight: "24px",
            textAlign: "center",
            maxWidth: "64rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              backgroundColor: "#e2dfff",
              color: "#3323cc",
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "32px",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1rem" }}
            >
              auto_awesome
            </span>
            AI-Powered Mentorship
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "clamp(2.25rem, 7vw, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: "#38393cff",
              marginBottom: "16px",
              lineHeight: 1.1,
              animation: "fadeInUp 0.8s ease-out forwards",
            }}
          >
            Crack Your Next Interview 🚀
          </h1>

          {/* Animated Words */}
          <div style={{ height: "48px", marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "clamp(1.25rem, 3vw, 2.5rem)",
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                color: "#4f46e5",
                margin: 0,
                display: "inline-block",
              }}
            >
              {currentText}
              <span
                style={{
                  animation: "blink 1s step-end infinite",
                  fontWeight: "normal",
                  color: "#4f46e5",
                }}
              >
                |
              </span>
            </p>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              color: "#464555",
              maxWidth: "42rem",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "48px",
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            Master the technical, HR, and behavioral skills needed to land your
            dream role.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <button
              onClick={() =>
                document
                  .getElementById("practice-cards")
                  .scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "14px 28px",
                borderRadius: "60px",
                fontWeight: 700,
                fontSize: "clamp(1rem, 2vw, 1.125rem)",
                background:
                  "linear-gradient(to bottom right, #3525cd, #4f46e5)",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 20px 40px -12px rgba(53,37,205,0.25)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              Start Free Session
            </button>
          </div>
        </section>

        {/* ─── Selection Grid ─── */}
        <section
          id="practice-cards"
          className="selection-section"
          style={{
            maxWidth: "80rem",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "24px",
            paddingRight: "24px",
            paddingBottom: "96px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: "#40454bff",
              }}
            >
              Interview Modes
            </h2>
            <p
              style={{
                color: "#464555",
                marginTop: "16px",
                fontSize: "clamp(1rem, 2vw, 1.125rem)",
              }}
            >
              Select a mode to begin your practice session
            </p>
          </div>

          <div className="cards-grid">
            {/* Card 1: DSA */}
            <div
              onClick={() => handleModeClick("DSA")}
              style={{
                position: "relative",
                padding: "32px",
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                cursor: "pointer",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.01)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px -8px rgba(25,28,29,0.06)";
                const arrow = e.currentTarget.querySelector(".arrow-icon");
                if (arrow) arrow.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)";
                const arrow = e.currentTarget.querySelector(".arrow-icon");
                if (arrow) arrow.style.transform = "translateX(0px)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "128px",
                  height: "128px",
                  backgroundColor: "rgba(226,223,255,0.2)",
                  borderRadius: "50%",
                  marginRight: "-64px",
                  marginTop: "-64px",
                  filter: "blur(48px)",
                }}
              ></div>
              <div
                style={{
                  marginBottom: "24px",
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: "#e2dfff",
                  color: "#3525cd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1.875rem" }}
                >
                  code
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#475569",
                  marginBottom: "12px",
                }}
              >
                💻 DSA Practice
              </h3>
              <p
                style={{
                  color: "#464555",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                Master algorithms and data structures with real-time complexity
                analysis.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#3525cd",
                  fontWeight: 700,
                }}
              >
                Practice Now
                <span
                  className="arrow-icon material-symbols-outlined"
                  style={{ marginLeft: "4px", transition: "transform 0.3s ease" }}
                >
                  arrow_forward
                </span>
              </div>
            </div>

            {/* Card 2: HR */}
            <div
              onClick={() => handleModeClick("HR")}
              style={{
                position: "relative",
                padding: "32px",
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                cursor: "pointer",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.01)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px -8px rgba(25,28,29,0.06)";
                const arrow = e.currentTarget.querySelector(".arrow-icon");
                if (arrow) arrow.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)";
                const arrow = e.currentTarget.querySelector(".arrow-icon");
                if (arrow) arrow.style.transform = "translateX(0px)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "128px",
                  height: "128px",
                  backgroundColor: "rgba(226,223,255,0.2)",
                  borderRadius: "50%",
                  marginRight: "-64px",
                  marginTop: "-64px",
                  filter: "blur(48px)",
                }}
              ></div>
              <div
                style={{
                  marginBottom: "24px",
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: "#e2dfff",
                  color: "#58579b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1.875rem" }}
                >
                  work
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#475569",
                  marginBottom: "12px",
                }}
              >
                🧑‍💼 HR Interview
              </h3>
              <p
                style={{
                  color: "#464555",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                Polishing your professional pitch and cultural fit responses
                with AI.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#58579b",
                  fontWeight: 700,
                }}
              >
                Practice Now
                <span
                  className="arrow-icon material-symbols-outlined"
                  style={{ marginLeft: "4px", transition: "transform 0.3s ease" }}
                >
                  arrow_forward
                </span>
              </div>
            </div>

            {/* Card 3: Behavioral */}
            <div
              onClick={() => handleModeClick("Behavioral")}
              style={{
                position: "relative",
                padding: "32px",
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                cursor: "pointer",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.01)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px -8px rgba(25,28,29,0.06)";
                const arrow = e.currentTarget.querySelector(".arrow-icon");
                if (arrow) arrow.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)";
                const arrow = e.currentTarget.querySelector(".arrow-icon");
                if (arrow) arrow.style.transform = "translateX(0px)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "128px",
                  height: "128px",
                  backgroundColor: "rgba(255,219,204,0.2)",
                  borderRadius: "50%",
                  marginRight: "-64px",
                  marginTop: "-64px",
                  filter: "blur(48px)",
                }}
              ></div>
              <div
                style={{
                  marginBottom: "24px",
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: "#ffdbcc",
                  color: "#7e3000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1.875rem" }}
                >
                  psychology
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#475569",
                  marginBottom: "12px",
                }}
              >
                🧠 Behavioral
              </h3>
              <p
                style={{
                  color: "#464555",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                Nail the STAR method for complex situational and conflict
                questions.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#7e3000",
                  fontWeight: 700,
                }}
              >
                Practice Now
                <span
                  className="arrow-icon material-symbols-outlined"
                  style={{ marginLeft: "4px", transition: "transform 0.3s ease" }}
                >
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer
        style={{
          backgroundColor: "#edeeef",
          padding: "48px 24px",
        }}
      >
        <div className="footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "1.125rem",
                fontWeight: 800,
                color: "#4338ca",
              }}
            >
              Interview Mentor AI
            </span>
          </div>
          <div className="footer-links">
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Privacy Policy
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Terms of Service
            </a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
              Contact Support
            </a>
          </div>
          <div style={{ fontSize: "0.875rem", color: "#464555" }}>
            © 2026 Interview Mentor AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
