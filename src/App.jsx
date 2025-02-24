import GameScreen from "./components/GameScreen";

function App() {
  return (
    <div className="h-full flex flex-col">
      <div className="max-w-md mx-auto w-full h-full bg-white shadow-lg">
        <GameScreen />
      </div>
    </div>
  );
}

export default App;
