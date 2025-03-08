import useGameStore from "../stores/gameStore";
import { useEffect, useRef } from "react";

export default function ScoreColumns() {
  const scoreHistory = useGameStore((state) => state.scoreHistory);
  const player1Score = useGameStore((state) => state.player1.score);
  const player2Score = useGameStore((state) => state.player2.score);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new scores are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scoreHistory]);

  // Only show history if any points have been scored
  if (player1Score === 0 && player2Score === 0) {
    return (
      <div className="flex-1 flex min-h-0 relative">
        <div className="absolute top-0 bottom-0 left-[calc(50%-0.5px)] w-[1px] bg-gray-300" />
      </div>
    );
  }

  // Filter out the initial score entry
  const filteredHistory = scoreHistory.filter(
    (score) => score.type !== "initial"
  );

  return (
    <div className="flex-1 flex min-h-0 relative">
      {/* Center dividing line */}
      <div className="absolute top-0 bottom-0 left-[calc(50%-0.5px)] w-[1px] bg-gray-300" />

      {/* Score rows container */}
      <div
        ref={scrollRef}
        className="absolute inset-0 flex flex-col overflow-y-auto"
      >
        <div className="flex-1" /> {/* Spacer to push content to bottom */}
        {filteredHistory.map((score) => (
          <div
            key={score.timestamp}
            className="w-full h-6 flex relative shrink-0"
          >
            {/* Handout line - show under the losing player's score */}
            {score.isHandout && (
              <div className="absolute -bottom-0 left-1/3 right-1/3 h-[1px] bg-black" />
            )}

            {/* Left side (Player 1) */}
            <div className="flex-1 flex justify-end pr-2">
              {score.type === "let" && score.player === "player1" ? (
                <span className="text-sm text-blue-600">Let</span>
              ) : score.type === "stroke" && score.player === "player1" ? (
                <span className="text-sm">
                  <span className="text-red-600">Stroke </span>
                  {score.score}
                  {score.serveSide}
                </span>
              ) : score.type === "nolet" && score.player === "player1" ? (
                <span className="text-sm text-gray-500">No Let</span>
              ) : (
                score.player === "player1" && (
                  <span
                    className={`text-sm ${score.isLet ? "text-blue-600" : ""}`}
                  >
                    {score.score}
                    {score.serveSide}
                  </span>
                )
              )}
            </div>

            {/* Right side (Player 2) */}
            <div className="flex-1 flex pl-2">
              {score.type === "let" && score.player === "player2" ? (
                <span className="text-sm text-blue-600">Let</span>
              ) : score.type === "stroke" && score.player === "player2" ? (
                <span className="text-sm">
                  <span className="text-red-600">Stroke </span>
                  {score.score}
                  {score.serveSide}
                </span>
              ) : score.type === "nolet" && score.player === "player2" ? (
                <span className="text-sm text-gray-500">No Let</span>
              ) : (
                score.player === "player2" && (
                  <span
                    className={`text-sm ${score.isLet ? "text-blue-600" : ""}`}
                  >
                    {score.score}
                    {score.serveSide}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
