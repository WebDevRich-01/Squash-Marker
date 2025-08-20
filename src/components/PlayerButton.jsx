import useGameStore from "../stores/gameStore";

export default function PlayerButton({ playerNum }) {
  const player = useGameStore((state) => state[`player${playerNum}`]);
  const addPoint = useGameStore((state) => state.addPoint);

  return (
    <button
      onClick={() => addPoint(playerNum)}
      className={`
        w-full p-8 text-lg
        border-t-8 ${player.color || "border-transparent"}
        ${player.serving ? "bg-gray-100" : "bg-white"}
      `}
    >
      {player.name || `Player ${playerNum}`}
    </button>
  );
}
