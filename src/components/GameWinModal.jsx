import useGameStore from "../stores/gameStore";

export default function GameWinModal({
  winningPlayer,
  gameNumber,
  matchWon,
  gameScores,
  onStartNext,
  onFinishMatch,
}) {
  const playerName =
    useGameStore((state) =>
      winningPlayer === 1 ? state.player1.name : state.player2.name
    ) || `Player ${winningPlayer}`;

  if (matchWon) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Match Complete!
          </h2>
          <p className="text-center mb-4">{playerName} wins the match!</p>
          <div className="mb-4">
            <h3 className="font-bold mb-2">Game Scores:</h3>
            {gameScores.map((score, index) => (
              <div key={index} className="flex justify-between">
                <span>Game {index + 1}:</span>
                <span>
                  {score.player1}-{score.player2}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={onFinishMatch}
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Game {gameNumber - 1} Complete!
        </h2>
        <p className="text-center mb-6">{playerName} wins the game!</p>
        <button
          onClick={onStartNext}
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Start Game {gameNumber}
        </button>
      </div>
    </div>
  );
}
