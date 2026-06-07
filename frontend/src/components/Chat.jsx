import { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { MODE_CONFIG, SUGGESTIONS } from "../prompts";
import { sendMessage, fetchAudioBlob } from "../api";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

export default function Chat({ mode, onEndSession, onBack }) {
  const config = MODE_CONFIG[mode];
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  const playAudioMessage = async (text) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    try {
      const blobUrl = await fetchAudioBlob(text);
      if (blobUrl) {
        const audio = new Audio(blobUrl);
        audioRef.current = audio;
        audio.play().catch(e => console.error("Audio play error:", e));
        audio.onended = () => URL.revokeObjectURL(blobUrl);
      }
    } catch (e) {
      console.error("TTS fetch error:", e);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

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
      playAudioMessage(data.reply);
    } catch (err) {
      setError("Failed to start session.");
    } finally {
      setLoading(false);
    }
  };

  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || initialized || !config) return;
    if (mode === "DSA") return;

    initRef.current = true;

    const initialAiMsg = {
      role: "assistant",
      content: config.initialMessage,
      feedback: null,
    };
    setMessages([initialAiMsg]);
    setApiMessages([{ role: "assistant", content: config.initialMessage }]);
    setInitialized(true);
    playAudioMessage(config.initialMessage);
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
      playAudioMessage(data.reply);
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
  const modeLabels = { DSA: "DSA Mode", HR: "HR Mode", Behavioral: "Behavioral Mode", Technical: "Technical Mode" };

  return (
    <div className="w-full min-h-screen flex flex-col bg-canvas-soft text-ink" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ─── Header ─── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 bg-canvas/80 backdrop-blur-xl border-b border-hairline shrink-0"
        style={{ height: "64px" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => { stopAudio(); onBack(); }}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-hairline text-body hover:text-ink hover:border-hairline-strong transition-colors cursor-pointer bg-canvas"
            title="Back to home"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <span className="text-[15px] font-semibold tracking-tight text-ink truncate">
            Interview Mentor AI
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Mode badge */}
          <span
            className="hidden sm:inline-flex items-center h-7 px-3 text-xs font-normal text-body bg-canvas-soft-2 rounded-full border border-hairline"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {modeLabels[mode] || mode}
          </span>

          {/* End session */}
          <button
            className="h-8 px-4 text-sm font-medium text-white bg-error rounded-[6px] cursor-pointer hover:opacity-90 transition-opacity"
            style={{ border: "none" }}
            onClick={() => { stopAudio(); onEndSession(feedbacks); }}
          >
            End Session
          </button>
        </div>
      </header>

      {/* ─── Chat Area ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col relative bg-canvas-soft">

          {/* Proficiency Selection (DSA mode) */}
          {mode === "DSA" && !proficiency && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-canvas-soft px-6">
              <h2
                className="text-ink font-semibold text-center mb-8"
                style={{
                  fontSize: "clamp(20px, 4vw, 24px)",
                  letterSpacing: "-0.96px",
                  lineHeight: "32px",
                }}
              >
                Select your proficiency level.
              </h2>
              <div className="flex gap-3 flex-wrap justify-center">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    className="h-12 px-6 text-base font-medium text-ink bg-canvas rounded-[100px] border border-hairline cursor-pointer shadow-level-2 hover:border-ink hover:shadow-level-3 transition-all"
                    onClick={() => handleProficiencySelect(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-44">
            {/* Welcome / empty state */}
            {messages.length === 0 && mode !== "DSA" && (
              <div className="max-w-2xl mx-auto mt-12 text-center">
                <h1
                  className="text-ink font-semibold mb-4"
                  style={{
                    fontSize: "clamp(20px, 4vw, 24px)",
                    letterSpacing: "-0.96px",
                    lineHeight: "32px",
                  }}
                >
                  Ready for your {mode} challenge?
                </h1>
                <p className="text-body text-base max-w-md mx-auto mb-6">
                  I'm your AI interview mentor. Ask a question or pick a suggestion below to get started.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="px-4 py-2 text-sm text-body bg-canvas rounded-full border border-hairline cursor-pointer hover:border-hairline-strong hover:text-ink transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} isUser={msg.role === "user"} />
              ))}

              {loading && <TypingIndicator />}

              {error && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-[8px] bg-error-soft/30 border border-error/20 flex-wrap">
                  <span className="material-symbols-outlined text-error text-lg">error</span>
                  <p className="flex-1 text-sm text-error min-w-[120px]">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="px-3 py-1 text-xs font-medium text-error bg-error/10 rounded-[6px] cursor-pointer hover:bg-error/15 transition-colors"
                    style={{ border: "none" }}
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
            className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-6 pt-12"
            style={{
              background: "linear-gradient(to top, var(--color-canvas-soft) 60%, rgba(250,250,250,0.9) 80%, transparent 100%)",
            }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 bg-canvas border border-hairline rounded-[12px] px-3 py-2 shadow-level-3">
                {/* Mic button */}
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
                    className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all cursor-pointer ${
                      listening
                        ? "bg-error/10 text-error"
                        : "text-mute hover:text-ink hover:bg-canvas-soft-2"
                    }`}
                    style={{ border: "none" }}
                    title={listening ? "Stop microphone" : "Start microphone"}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {listening ? "mic_off" : "mic"}
                    </span>
                  </button>
                )}

                {/* Text input */}
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here..."
                  disabled={loading}
                  className="flex-1 min-w-0 bg-transparent text-ink text-base outline-none placeholder:text-mute py-2 px-1"
                  style={{ border: "none", fontFamily: "var(--font-sans)" }}
                />

                {/* Send button */}
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all ${
                    loading || !input.trim()
                      ? "bg-hairline text-mute cursor-not-allowed"
                      : "bg-ink text-white cursor-pointer hover:opacity-85"
                  }`}
                  style={{ border: "none" }}
                >
                  <span
                    className="material-symbols-outlined text-lg"
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
