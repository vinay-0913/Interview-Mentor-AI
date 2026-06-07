import { useState, useEffect } from "react";
import Landing from "./components/Landing";
import Chat from "./components/Chat";
import SessionSummary from "./components/SessionSummary";

function App() {
  const [view, setView] = useState("landing"); // landing | chat | summary
  const [mode, setMode] = useState(null);
  const [sessionData, setSessionData] = useState([]);


  // Handle Initial Route & Browser Back/Forward buttons
  useEffect(() => {
    const syncRouteToState = () => {
      const path = window.location.pathname.replace('/', '');
      const decodedPath = decodeURIComponent(path);

      if (decodedPath === 'summary') {
        setView('summary');
      } else if (['DSA', 'HR', 'Behavioral', 'Technical'].includes(decodedPath)) {
        setMode(decodedPath);
        setView('chat');
      } else if (['DSA Mode', 'HR Mode', 'Behavioral Mode', 'Technical Mode'].includes(decodedPath)) {
        setMode(decodedPath.replace(' Mode', ''));
        setView('chat');
      } else {
        setMode(null);
        setView('landing');
      }
    };

    // Sync state on load
    syncRouteToState();

    // Listen for navigation
    window.addEventListener('popstate', syncRouteToState);
    return () => window.removeEventListener('popstate', syncRouteToState);
  }, []);



  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    setSessionData([]);
    setView("chat");
    window.history.pushState({}, '', `/${encodeURIComponent(selectedMode + ' Mode')}`);
  };

  const handleEndSession = (feedbacks) => {
    setSessionData(feedbacks);
    setView("summary");
    window.history.pushState({}, '', '/summary');
  };

  const handleNewSession = () => {
    setMode(null);
    setSessionData([]);
    setView("landing");
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-canvas-soft">
      {view === "landing" && <Landing onSelectMode={handleSelectMode} />}
      {view === "chat" && (
        <Chat
          mode={mode}
          onEndSession={handleEndSession}
          onBack={handleNewSession}
        />
      )}
      {view === "summary" && (
        <SessionSummary
          feedbacks={sessionData}
          mode={mode}
          onNewSession={handleNewSession}
        />
      )}
    </div>
  );
}

export default App;
