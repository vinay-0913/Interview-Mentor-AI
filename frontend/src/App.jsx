import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Landing from "./components/Landing";
import Chat from "./components/Chat";
import SessionSummary from "./components/SessionSummary";

function App() {
  const [view, setView] = useState("landing"); // landing | chat | summary
  const [mode, setMode] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const { isLoaded, isSignedIn, user } = useUser();

  // Handle Initial Route & Browser Back/Forward buttons
  useEffect(() => {
    const syncRouteToState = () => {
      const path = window.location.pathname.replace('/', '');
      const decodedPath = decodeURIComponent(path);

      if (decodedPath === 'summary') {
        setView('summary');
      } else if (['DSA', 'HR', 'Behavioral'].includes(decodedPath)) {
        setMode(decodedPath);
        setView('chat');
      } else if (['DSA Mode', 'HR Mode', 'Behavioral Mode'].includes(decodedPath)) {
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

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Sync user profile to backend MongoDB Atlas
      fetch(`${import.meta.env.VITE_API_URL || ""}/api/users/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      })
        .then(res => res.json())
        .then(data => console.log("User synchronized:", data))
        .catch(err => console.error("Error syncing user:", err));
    }
  }, [isLoaded, isSignedIn, user]);

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
    <div className="min-h-screen flex flex-col">
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
