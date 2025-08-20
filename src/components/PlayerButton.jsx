import useGameStore from "../stores/gameStore";
import PropTypes from "prop-types";

export default function PlayerButton({ playerNum }) {
  const player = useGameStore((state) => state[`player${playerNum}`]);
  const addPoint = useGameStore((state) => state.addPoint);

  return (
    <button
      onClick={() => addPoint(playerNum)}
      className={`
        w-full p-6 text-lg font-medium rounded-lg
        border-l-4 ${player.color || "border-slate-300"}
        transition-all duration-200 hover:shadow-lg active:scale-95
        ${
          player.serving
            ? "player-serving ring-2 ring-blue-200"
            : "player-not-serving hover:bg-slate-50"
        }
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {player.serving && (
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        )}
        <span>{player.name || `Player ${playerNum}`}</span>
        {player.serving && (
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        )}
      </div>
    </button>
  );
}

PlayerButton.propTypes = {
  playerNum: PropTypes.number.isRequired,
};
