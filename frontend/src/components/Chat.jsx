import { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { MODE_CONFIG, SUGGESTIONS } from "../prompts";
import { sendMessage } from "../api";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

export default function Chat({ mode, onEndSession, onBack }) {
  const config = MODE_CONFIG[mode];
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [apiMessages, setApiMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [proficiency, setProficiency] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [baselineText, setBaselineText] = useState("");

  useEffect(() => {
    if (listening) {
      const space = baselineText && transcript ? " " : "";
      setInput(baselineText + space + transcript);
    }
  }, [transcript, listening, baselineText]);

  const handleProficiencySelect = async (level) => {
    setProficiency(level);
    setLoading(true);
    try {
      const initMessage = `Let's start the DSA interview. I am at an ${level} proficiency level. Please ask me a random, unique coding question suitable for my level. Do not offer a choice, just give me the text of the single question.`;

      const data = await sendMessage([{ role: "user", content: initMessage }], mode);

      const aiMsg = {
        role: "assistant",
        content: data.reply,
        feedback: null,
      };
      const aiApiMsg = { role: "assistant", content: data.reply };

      setMessages([aiMsg]);
      setApiMessages([{ role: "user", content: initMessage }, aiApiMsg]);
      setInitialized(true);
    } catch (err) {
      setError("Failed to start session.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized && config) {
      if (mode === "DSA") return;

      const initialAiMsg = {
        role: "assistant",
        content: config.initialMessage,
        feedback: null,
      };
      setMessages([initialAiMsg]);
      setApiMessages([{ role: "assistant", content: config.initialMessage }]);
      setInitialized(true);
    }
  }, [initialized, config, mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  const handleSend = async (text = input.trim()) => {
    if (!text || loading) return;

    if (listening) {
      SpeechRecognition.stopListening();
    }
    resetTranscript();
    setBaselineText("");

    const userMsg = { role: "user", content: text, feedback: null };
    const userApiMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    const newApiMessages = [...apiMessages, userApiMsg];
    setMessages(newMessages);
    setApiMessages(newApiMessages);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const data = await sendMessage(newApiMessages, mode);
      const aiMsg = {
        role: "assistant",
        content: data.reply,
        feedback: data.feedback || null,
      };
      const aiApiMsg = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, aiMsg]);
      setApiMessages((prev) => [...prev, aiApiMsg]);
      if (data.feedback) {
        setFeedbacks((prev) => [...prev, data.feedback]);
      }
    } catch (err) {
      console.error("Send error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetry = () => {
    setError(null);
    const lastUserMsg = apiMessages.filter((m) => m.role === "user").pop();
    if (lastUserMsg) handleSend(lastUserMsg.content);
  };

  const suggestions = SUGGESTIONS[mode] || [];
  const modeLabels = { DSA: "DSA Mode", HR: "HR Mode", Behavioral: "Behavioral Mode" };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: "#f8f9fa",
        color: "#191c1d",
      }}
    >
      {/* ─── Responsive Styles ─── */}
      <style>{`
        .chat-header-left { display: flex; align-items: center; gap: 16px; min-width: 0; }
        .chat-header-logo {
          font-family: 'Manrope', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #38393cff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chat-header-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .chat-mode-label {
          padding: 8px 16px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          background: none;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }
        .chat-end-btn {
          padding: 8px 20px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #ffffff;
          background-color: #ba1a1a;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        .proficiency-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 32px;
          color: #414345ff;
          font-family: 'Manrope', sans-serif;
          text-align: center;
          padding: 0 16px;
        }

        .proficiency-btn {
          padding: 16px 32px;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 16px;
          background-color: #ffffff;
          border: 2px solid #e2e8f0;
          color: #4f46e5;
          cursor: pointer;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .chat-input-placeholder::placeholder { color: #9ca3af; }

        /* ─── Mobile (≤ 640px) ─── */
        @media (max-width: 640px) {
          .chat-header-logo { font-size: 1rem; }
          .chat-mode-label { display: none; }
          .chat-end-btn {
            padding: 8px 14px;
            font-size: 0.8rem;
          }

          .proficiency-title { font-size: 1.5rem; margin-bottom: 24px; }
          .proficiency-btn { padding: 12px 24px; font-size: 1rem; }

          .chat-messages-area {
            padding: 16px !important;
            padding-bottom: 140px !important;
          }

          .chat-input-area {
            padding: 12px 16px !important;
          }
        }

        /* ─── Tablet (641px – 1024px) ─── */
        @media (min-width: 641px) and (max-width: 1024px) {
          .chat-messages-area {
            padding: 20px !important;
            padding-bottom: 150px !important;
          }
          .chat-input-area {
            padding: 16px 20px !important;
          }
        }
      `}</style>

      {/* ─── Header ─── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          backgroundColor: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          flexShrink: 0,
          gap: "12px",
        }}
      >
        <div className="chat-header-left">
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              color: "#64748b",
              flexShrink: 0,
            }}
            title="Back to home"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="chat-header-logo">Interview Mentor AI</span>
        </div>

        <div className="chat-header-right">
          <button className="chat-mode-label">
            {modeLabels[mode] || mode}
          </button>
          <button
            className="chat-end-btn"
            onClick={() => onEndSession(feedbacks)}
          >
            End Session
          </button>
        </div>
      </header>

      {/* ─── Chat Area ─── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 72px)",
          overflow: "hidden",
        }}
      >
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            backgroundColor: "#f8f9fa",
          }}
        >
          {/* Proficiency Selection */}
          {mode === "DSA" && !proficiency && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8f9fa",
                zIndex: 10,
                padding: "24px",
              }}
            >
              <h2 className="proficiency-title">
                Select Your Proficiency Level
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    className="proficiency-btn"
                    onClick={() => handleProficiencySelect(level)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#4f46e5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#e2e8f0")
                    }
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages scroll area */}
          <div
            className="chat-messages-area"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
              paddingBottom: "160px",
            }}
          >
            {/* Welcome / empty state */}
            {messages.length === 0 && mode !== "DSA" && (
              <div
                style={{
                  maxWidth: "48rem",
                  margin: "48px auto",
                  textAlign: "center",
                }}
              >
                <h1
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    color: "#191c1d",
                    marginBottom: "16px",
                  }}
                >
                  Ready for your {mode} Challenge?
                </h1>
                <p
                  style={{
                    color: "#464555",
                    fontSize: "clamp(1rem, 2vw, 1.125rem)",
                    maxWidth: "36rem",
                    margin: "0 auto 24px",
                  }}
                >
                  I'm your AI technical mentor. We can practice algorithms,
                  complexity analysis, or do a full mock interview.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "16px",
                  }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      style={{
                        padding: "8px 16px",
                        fontSize: "0.875rem",
                        borderRadius: "9999px",
                        backgroundColor: "#e2e8f0",
                        color: "#464555",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div
              style={{
                maxWidth: "56rem",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} isUser={msg.role === "user"} />
              ))}

              {loading && <TypingIndicator />}

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(186,26,26,0.08)",
                    border: "1px solid rgba(186,26,26,0.15)",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#ba1a1a" }}
                  >
                    error
                  </span>
                  <p
                    style={{ flex: 1, fontSize: "0.875rem", color: "#ba1a1a", minWidth: "120px" }}
                  >
                    {error}
                  </p>
                  <button
                    onClick={handleRetry}
                    style={{
                      padding: "4px 12px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      borderRadius: "8px",
                      backgroundColor: "rgba(186,26,26,0.12)",
                      color: "#ba1a1a",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ─── Bottom Input Area ─── */}
          <div
            className="chat-input-area"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "24px",
              background:
                "linear-gradient(to top, #f8f9fa 60%, rgba(248,249,250,0.9) 80%, transparent 100%)",
            }}
          >
            <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
              {/* Input container */}
              <div
                style={{
                  position: "relative",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(199,196,216,0.3)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {browserSupportsSpeechRecognition && (
                  <button
                    onClick={() => {
                      if (listening) {
                        SpeechRecognition.stopListening();
                      } else {
                        setBaselineText(input);
                        resetTranscript();
                        SpeechRecognition.startListening({ continuous: true });
                      }
                    }}
                    disabled={loading}
                    style={{
                      padding: "12px",
                      background: listening
                        ? "rgba(186, 26, 26, 0.12)"
                        : "none",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      color: listening ? "#ba1a1a" : "#777587",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "50%",
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                    title={listening ? "Stop microphone" : "Start microphone"}
                  >
                    <span className="material-symbols-outlined">
                      {listening ? "mic_off" : "mic"}
                    </span>
                  </button>
                )}
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your technical explanation here..."
                  disabled={loading}
                  className="chat-input-placeholder"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#191c1d",
                    fontSize: "1rem",
                    padding: "16px 8px",
                    fontFamily: "'Inter', sans-serif",
                    minWidth: 0,
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    background:
                      loading || !input.trim()
                        ? "#c7c4d8"
                        : "linear-gradient(to bottom right, #3525cd, #4f46e5)",
                    color: "#ffffff",
                    border: "none",
                    cursor:
                      loading || !input.trim() ? "not-allowed" : "pointer",
                    boxShadow:
                      loading || !input.trim()
                        ? "none"
                        : "0 4px 12px rgba(53,37,205,0.25)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    send
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
