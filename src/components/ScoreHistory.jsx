import useGameStore from "../stores/gameStore";

export default function ScoreHistory({ player }) {
  const scoreHistory = useGameStore((state) => state.scoreHistory);

  // Filter scores for this player
  const playerScores = scoreHistory.filter(
    (score) => score.player === `player${player}`
  );

  return (
    <div className="h-full p-2 flex flex-col">
      {playerScores.map((score, index) => (
        <div
          key={score.timestamp}
          className="relative flex items-center gap-1 text-sm mb-3"
        >
          <span>{score.score}</span>
          <span className="text-xs text-gray-500">{score.serveSide}</span>
          {score.isHandout && (
            <div
              className="absolute -bottom-2 left-0 w-6 h-[1px] bg-black"
              aria-label="handout indicator"
            />
          )}
        </div>
      ))}
    </div>
  );
}
