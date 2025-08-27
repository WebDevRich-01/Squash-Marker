import useGameStore from "../stores/gameStore";
import PropTypes from "prop-types";

export default function GameWinModal({
  winningPlayer,
  gameNumber,
  matchWon,
  onStartNext,
  onFinishMatch,
}) {
  const player = useGameStore((state) => state[`player${winningPlayer}`]);
  const playerName = player?.name || `Player ${winningPlayer}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        {matchWon ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Match Complete!
            </h2>
            <p className="text-center mb-6">{playerName} wins the match!</p>
            <button
              onClick={onFinishMatch}
              className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to Menu
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Game {gameNumber - 1} Complete!
            </h2>
            <p className="text-center mb-2">{playerName} wins the game!</p>
            <p className="text-center text-gray-600 mb-6">
              {playerName} will serve first in the next game.
            </p>
            <button
              onClick={onStartNext}
              className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Game {gameNumber}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

GameWinModal.propTypes = {
  winningPlayer: PropTypes.number.isRequired,
  gameNumber: PropTypes.number.isRequired,
  matchWon: PropTypes.bool.isRequired,
  onStartNext: PropTypes.func.isRequired,
  onFinishMatch: PropTypes.func.isRequired,
};
