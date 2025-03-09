import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import LandingScreen from "./components/LandingScreen";
import GameSetupScreen from "./components/GameSetupScreen";
import GameScreen from "./components/GameScreen";
import MatchHistoryScreen from "./components/MatchHistoryScreen";
import useGameStore from "./stores/gameStore";

function App() {
  const navigate = useNavigate();
  const updateGameSettings = useGameStore((state) => state.updateGameSettings);

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

  return (
    <div className="h-full flex flex-col">
      <div className="max-w-md mx-auto w-full h-full bg-white shadow-lg">
        <Routes>
          <Route
            path="/"
            element={
              <LandingScreen
                onNewMatch={() => navigate("/setup")}
                onFindMatch={() => navigate("/history")}
              />
            }
          />

          <Route
            path="/setup"
            element={
              <GameSetupScreen
                initialSettings={null}
                onStartMatch={() => navigate("/game")}
                onBack={() => navigate("/")}
                isEditing={false}
              />
            }
          />

          <Route
            path="/setup/edit"
            element={
              <GameSetupScreen
                initialSettings={getGameSettings()}
                onReturnToMatch={(settings) => {
                  updateGameSettings(settings);
                  navigate("/game");
                }}
                onBack={() => navigate("/game")}
                isEditing={true}
              />
            }
          />

          <Route
            path="/game"
            element={
              <GameScreen onBackToSetup={() => navigate("/setup/edit")} />
            }
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
