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
    browserSupportsSpeechRecognition
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
      if (mode === "DSA") return; // DSA initializes via handleProficiencySelect

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

  /* ─── mode label map ─── */
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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
            }}
            title="Back to home"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            style={{
              padding: "8px 16px",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#64748b",
              background: "none",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {modeLabels[mode] || mode}
          </button>
          <button
            onClick={() => onEndSession(feedbacks)}
            style={{
              padding: "8px 20px",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: "#ba1a1a",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              transition: "opacity 0.2s",
            }}
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
        <main style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", backgroundColor: "#f8f9fa" }}>
          {/* Proficiency Selection */}
          {mode === "DSA" && !proficiency && (
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8f9fa",
                zIndex: 10,
              }}
            >
              <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "32px", color: "#414345ff", fontFamily: "'Manrope', sans-serif" }}>
                Select Your Proficiency Level
              </h2>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleProficiencySelect(level)}
                    style={{
                      padding: "16px 32px",
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      borderRadius: "16px",
                      backgroundColor: "#ffffff",
                      border: "2px solid #e2e8f0",
                      color: "#4f46e5",
                      cursor: "pointer",
                      transition: "border-color 0.2s, background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4f46e5")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages scroll area */}
          <div
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
                    fontSize: "2.25rem",
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
                    fontSize: "1.125rem",
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
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: "#ba1a1a" }}>
                    error
                  </span>
                  <p style={{ flex: 1, fontSize: "0.875rem", color: "#ba1a1a" }}>{error}</p>
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
                      background: listening ? "rgba(186, 26, 26, 0.12)" : "none",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      color: listening ? "#ba1a1a" : "#777587",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "50%",
                      transition: "all 0.2s",
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
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#191c1d",
                    fontSize: "1rem",
                    padding: "16px 8px",
                    fontFamily: "'Inter', sans-serif",
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
                    cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                    boxShadow:
                      loading || !input.trim()
                        ? "none"
                        : "0 4px 12px rgba(53,37,205,0.25)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
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
