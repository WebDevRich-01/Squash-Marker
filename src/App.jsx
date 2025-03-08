import { useState, useCallback } from "react";
import GameScreen from "./components/GameScreen";
import GameSetupScreen from "./components/GameSetupScreen";
import useGameStore from "./stores/gameStore";

function App() {
  const [currentScreen, setCurrentScreen] = useState("setup");
  const [editingExistingMatch, setEditingExistingMatch] = useState(false);

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

  const updateGameSettings = useGameStore((state) => state.updateGameSettings);

  const handleStartMatch = () => {
    setCurrentScreen("game");
    setEditingExistingMatch(false);
  };

  const handleBackToSetup = () => {
    setCurrentScreen("setup");
    setEditingExistingMatch(true);
  };

  const handleReturnToMatch = (settings) => {
    updateGameSettings(settings);
    setCurrentScreen("game");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="max-w-md mx-auto w-full h-full bg-white shadow-lg">
        {currentScreen === "game" ? (
          <GameScreen onBackToSetup={handleBackToSetup} />
        ) : (
          <GameSetupScreen
            initialSettings={editingExistingMatch ? getGameSettings() : null}
            onStartMatch={handleStartMatch}
            onReturnToMatch={handleReturnToMatch}
            isEditing={editingExistingMatch}
          />
        )}
      </div>
    </div>
  );
}

export default App;
