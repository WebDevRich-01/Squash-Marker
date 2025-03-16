import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import LandingScreen from "./components/LandingScreen";
import GameSetupScreen from "./components/GameSetupScreen";
import GameScreen from "./components/GameScreen";
import MatchHistoryScreen from "./components/MatchHistoryScreen";
import useGameStore from "./stores/gameStore";

function App() {
  const navigate = useNavigate();
  const updateGameSettings = useGameStore((state) => state.updateGameSettings);
  const [hasActiveMatch, setHasActiveMatch] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("landing");
  const [gameSettings, setGameSettings] = useState(null);

  // Check if there's an active match when the component mounts
  useEffect(() => {
    const state = useGameStore.getState();
    const hasMatch =
      state.gameScores.length > 0 ||
      state.player1.score > 0 ||
      state.player2.score > 0;
    setHasActiveMatch(hasMatch);
  }, []);

  // Use useCallback to memoize this function
  const getGameSettings = useCallback(() => {
    const state = useGameStore.getState();
    return {
      player1Name: state.player1.name,
      player2Name: state.player2.name,
      player1Color: state.player1.color,
      player2Color: state.player2.color,
      pointsToWin: state.matchSettings.pointsToWin,
      clearPoints: state.matchSettings.clearPoints,
      bestOf: state.matchSettings.bestOf,
      player1Serving: state.player1.serving,
    };
  }, []);

  // Handle navigation from GameSetupScreen back to landing
  const handleBackFromSetup = () => {
    // If we're editing an existing match, preserve the match state
    if (hasActiveMatch) {
      navigate("/");
    } else {
      // If it's a new match setup, just go back to landing
      navigate("/");
    }
  };

  const handleBackToSetup = (settingsFromGame) => {
    console.log(
      "Parent component received settings from game:",
      settingsFromGame
    );

    // Store the settings in state
    setGameSettings({
      ...settingsFromGame,
      eventName: settingsFromGame.eventName || "", // Ensure eventName is passed
    });

    // Navigate to the edit setup route instead of just changing currentScreen
    navigate("/setup/edit");
  };

  const handleStartMatch = () => {
    setHasActiveMatch(true);
    navigate("/game");
  };

  const handleReturnToMatch = (settings) => {
    updateGameSettings(settings);
    navigate("/game");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="max-w-md mx-auto w-full h-full bg-white shadow-lg">
        <Routes>
          <Route
            path="/"
            element={
              <LandingScreen
                onNewMatch={() => {
                  // Reset game state for new match
                  if (hasActiveMatch) {
                    // If there's an active match, go to edit screen
                    navigate("/setup/edit");
                  } else {
                    // Otherwise go to new match setup
                    navigate("/setup");
                  }
                }}
                onFindMatch={() => navigate("/history")}
                hasActiveMatch={hasActiveMatch}
              />
            }
          />

          <Route
            path="/setup"
            element={
              <GameSetupScreen
                initialSettings={null}
                onStartMatch={handleStartMatch}
                onBack={handleBackToHome}
                isEditing={false}
              />
            }
          />

          <Route
            path="/setup/edit"
            element={
              <GameSetupScreen
                initialSettings={gameSettings}
                onReturnToMatch={handleReturnToMatch}
                onBack={handleBackToHome}
                isEditing={true}
              />
            }
          />

          <Route
            path="/game"
            element={<GameScreen onBackToSetup={handleBackToSetup} />}
          />

          <Route
            path="/history"
            element={<MatchHistoryScreen onBack={() => navigate("/")} />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
