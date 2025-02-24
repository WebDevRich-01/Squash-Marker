import { useState } from "react";
import GameScreen from "./components/GameScreen";
import GameSetupScreen from "./components/GameSetupScreen";

function App() {
  const [matchStarted, setMatchStarted] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="max-w-md mx-auto w-full h-full bg-white shadow-lg">
        {matchStarted ? (
          <GameScreen />
        ) : (
          <GameSetupScreen onStartMatch={() => setMatchStarted(true)} />
        )}
      </div>
    </div>
  );
}

export default App;
