import { useState, useEffect } from "react";
import useGameStore from "../stores/gameStore";
import ScoreColumns from "./ScoreColumns";
import PlayerButton from "./PlayerButton";
import LetDecisionModal from "./LetDecisionModal";
import GameWinModal from "./GameWinModal";

export default function GameScreen() {
  const [letModalOpen, setLetModalOpen] = useState(false);
  const [letCallingPlayer, setLetCallingPlayer] = useState(null);
  const [gameWinModalOpen, setGameWinModalOpen] = useState(false);

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
  } = useGameStore();

  // Check for game wins
  useEffect(() => {
    const winner = checkGameWin();
    if (winner) {
      setGameWinModalOpen(true);
    }
  }, [player1.score, player2.score, checkGameWin]);

  const handleStartNext = () => {
    startNextGame();
    setGameWinModalOpen(false);
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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b shrink-0">
        <button className="p-2">&larr;</button>
        <div>
          Game {currentGame} {getGameScoreDisplay()}
        </div>
        <button className="p-2">&times;</button>
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

      {gameWinModalOpen && (
        <GameWinModal
          winningPlayer={checkGameWin()}
          gameNumber={currentGame + 1}
          matchWon={matchWon}
          gameScores={gameScores}
          onStartNext={handleStartNext}
          onFinishMatch={() => {
            /* Handle return to menu */
          }}
        />
      )}

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
    </div>
  );
}
