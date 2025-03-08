import { useState, useEffect } from "react";
import useGameStore from "../stores/gameStore";
import ScoreColumns from "./ScoreColumns";
import PlayerButton from "./PlayerButton";
import LetDecisionModal from "./LetDecisionModal";
import GameWinModal from "./GameWinModal";

export default function GameScreen({ onBackToSetup }) {
  const [letModalOpen, setLetModalOpen] = useState(false);
  const [letCallingPlayer, setLetCallingPlayer] = useState(null);
  const [gameWinModalOpen, setGameWinModalOpen] = useState(false);
  const [winningPlayer, setWinningPlayer] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const {
    player1,
    player2,
    currentGame,
    gameScores,
    matchWon,
    undoLastPoint,
    toggleServeSide,
    handleLetDecision,
    startNextGame,
    checkGameWin,
    handleGameCompletion,
    resetGame,
  } = useGameStore();

  // Check for game wins without trying to save to backend
  useEffect(() => {
    const winner = checkGameWin();
    if (winner) {
      console.log("Game won by player", winner);

      // Store the winner in state to avoid recalculating
      setWinningPlayer(winner);

      // Skip the API call for now and just show the modal
      try {
        // If handleGameCompletion is synchronous or returns a non-promise
        handleGameCompletion();
      } catch (error) {
        console.error("Error in game completion:", error);
        // Continue showing the modal even if there's an error
      }

      // Always show the modal
      setGameWinModalOpen(true);
    }
  }, [player1.score, player2.score, checkGameWin, handleGameCompletion]);

  const handleStartNext = () => {
    startNextGame();
    setGameWinModalOpen(false);
  };

  const handleFinishMatch = () => {
    window.location.reload();
  };

  const getGameScoreDisplay = () => {
    if (!gameScores || gameScores.length === 0) return "(0-0)";

    const player1Wins = gameScores.filter((s) => s.player1 > s.player2).length;
    const player2Wins = gameScores.filter((s) => s.player2 > s.player1).length;

    return `(${player1Wins}-${player2Wins})`;
  };

  const handleLetButtonClick = (playerNum) => {
    setLetCallingPlayer(playerNum);
    setLetModalOpen(true);
  };

  const handleLetDecisionMade = (decision) => {
    handleLetDecision(letCallingPlayer, decision);
    setLetModalOpen(false);
    setLetCallingPlayer(null);
  };

  const handleCancelMatch = () => {
    resetGame();
    onBackToSetup();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b shrink-0">
        <button className="p-2" onClick={onBackToSetup}>
          &larr;
        </button>
        <div>
          Game {currentGame} {getGameScoreDisplay()}
        </div>
        <button className="p-2" onClick={() => setCancelModalOpen(true)}>
          &times;
        </button>
      </div>

      {/* Score columns */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <ScoreColumns />
      </div>

      {/* Current score and player controls */}
      <div className="p-4 bg-white shrink-0">
        <div className="flex gap-4">
          <div className="flex-1">
            {/* Player 1 score and serve indicator */}
            <div className="text-center mb-2 flex items-center justify-center">
              <div className="text-6xl font-bold">{player1.score}</div>
              {player1.serving && (
                <button
                  onClick={() => toggleServeSide(1)}
                  className="ml-2 text-4xl text-gray-500"
                >
                  {player1.serveSide}
                </button>
              )}
            </div>
            <PlayerButton playerNum={1} />
            <button
              onClick={() => handleLetButtonClick(1)}
              className="w-full p-2 mt-2 bg-gray-200 hover:bg-gray-300"
            >
              Let
            </button>
          </div>

          <div className="flex-1">
            {/* Player 2 score and serve indicator */}
            <div className="text-center mb-2 flex items-center justify-center">
              <div className="text-6xl font-bold">{player2.score}</div>
              {player2.serving && (
                <button
                  onClick={() => toggleServeSide(2)}
                  className="ml-2 text-4xl text-gray-500"
                >
                  {player2.serveSide}
                </button>
              )}
            </div>
            <PlayerButton playerNum={2} />
            <button
              onClick={() => handleLetButtonClick(2)}
              className="w-full p-2 mt-2 bg-gray-200 hover:bg-gray-300"
            >
              Let
            </button>
          </div>
        </div>
      </div>

      {/* Undo button */}
      <button
        onClick={undoLastPoint}
        className="w-full p-4 bg-gray-200 hover:bg-gray-300"
      >
        Undo
      </button>

      {/* Game win modal */}
      {gameWinModalOpen && (
        <GameWinModal
          winningPlayer={winningPlayer}
          gameNumber={currentGame + 1}
          matchWon={matchWon}
          gameScores={gameScores}
          onStartNext={handleStartNext}
          onFinishMatch={handleFinishMatch}
        />
      )}

      {/* Let decision modal */}
      {letModalOpen && (
        <LetDecisionModal
          playerNum={letCallingPlayer}
          onDecision={handleLetDecisionMade}
          onCancel={() => {
            setLetModalOpen(false);
            setLetCallingPlayer(null);
          }}
        />
      )}

      {/* Cancel confirmation modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Cancel Match?
            </h2>
            <p className="text-center mb-6">
              Are you sure you want to cancel this match? All progress will be
              lost.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleCancelMatch()}
                className="flex-1 p-3 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 p-3 bg-gray-300 rounded hover:bg-gray-400"
              >
                No, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
