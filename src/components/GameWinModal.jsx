import useGameStore from "../stores/gameStore";
import PropTypes from "prop-types";

export default function GameWinModal({
  winningPlayer,
  gameNumber,
  matchWon,
  onStartNext,
  onFinishMatch,
}) {
  const player1 = useGameStore((state) => state.player1);
  const player2 = useGameStore((state) => state.player2);
  const gameScores = useGameStore((state) => state.gameScores);

  const player = winningPlayer === 1 ? player1 : player2;
  const playerName = player?.name || `Player ${winningPlayer}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        {matchWon ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Match Complete!
            </h2>
            <p className="text-center mb-4">{playerName} wins the match!</p>

            {/* Match History */}
            {gameScores.length > 0 && (
              <div className="mb-6">
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-slate-100 grid grid-cols-3 text-sm font-semibold text-slate-700">
                    <div className="p-2 border-r border-slate-200"></div>
                    <div className="p-2 text-center border-r border-slate-200">
                      {player1.name}
                    </div>
                    <div className="p-2 text-center">{player2.name}</div>
                  </div>

                  {/* Game Rows */}
                  {gameScores.map((game, index) => {
                    const player1Won = game.player1 > game.player2;
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-3 border-t border-slate-200"
                      >
                        <div className="p-2 font-medium text-slate-700 border-r border-slate-200">
                          Game {index + 1}
                        </div>
                        <div
                          className={`p-2 text-center border-r border-slate-200 font-bold ${
                            player1Won
                              ? "text-green-600 bg-green-50"
                              : "text-slate-600"
                          }`}
                        >
                          {game.player1}
                        </div>
                        <div
                          className={`p-2 text-center font-bold ${
                            !player1Won
                              ? "text-green-600 bg-green-50"
                              : "text-slate-600"
                          }`}
                        >
                          {game.player2}
                        </div>
                      </div>
                    );
                  })}

                  {/* Match Score Row */}
                  <div className="grid grid-cols-3 border-t-2 border-slate-300 bg-blue-50">
                    <div className="p-2 font-semibold text-slate-700 border-r border-slate-200">
                      Match
                    </div>
                    <div className="p-2 text-center border-r border-slate-200 font-bold text-blue-600">
                      {gameScores.filter((g) => g.player1 > g.player2).length}
                    </div>
                    <div className="p-2 text-center font-bold text-blue-600">
                      {gameScores.filter((g) => g.player2 > g.player1).length}
                    </div>
                  </div>
                </div>
              </div>
            )}

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

            {/* Match History */}
            {gameScores.length > 0 && (
              <div className="mb-6">
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-slate-100 grid grid-cols-3 text-sm font-semibold text-slate-700">
                    <div className="p-2 border-r border-slate-200"></div>
                    <div className="p-2 text-center border-r border-slate-200">
                      {player1.name}
                    </div>
                    <div className="p-2 text-center">{player2.name}</div>
                  </div>

                  {/* Game Rows */}
                  {gameScores.map((game, index) => {
                    const player1Won = game.player1 > game.player2;
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-3 border-t border-slate-200"
                      >
                        <div className="p-2 font-medium text-slate-700 border-r border-slate-200">
                          Game {index + 1}
                        </div>
                        <div
                          className={`p-2 text-center border-r border-slate-200 font-bold ${
                            player1Won
                              ? "text-green-600 bg-green-50"
                              : "text-slate-600"
                          }`}
                        >
                          {game.player1}
                        </div>
                        <div
                          className={`p-2 text-center font-bold ${
                            !player1Won
                              ? "text-green-600 bg-green-50"
                              : "text-slate-600"
                          }`}
                        >
                          {game.player2}
                        </div>
                      </div>
                    );
                  })}

                  {/* Match Score Row */}
                  <div className="grid grid-cols-3 border-t-2 border-slate-300 bg-blue-50">
                    <div className="p-2 font-semibold text-slate-700 border-r border-slate-200">
                      Match
                    </div>
                    <div className="p-2 text-center border-r border-slate-200 font-bold text-blue-600">
                      {gameScores.filter((g) => g.player1 > g.player2).length}
                    </div>
                    <div className="p-2 text-center font-bold text-blue-600">
                      {gameScores.filter((g) => g.player2 > g.player1).length}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
