import { useState } from "react";
import useGameStore from "../stores/gameStore";

export default function GameSetupScreen({ onStartMatch }) {
  const [settings, setSettings] = useState({
    player1Name: "",
    player2Name: "",
    player1Color: "border-red-500",
    player2Color: "border-blue-500",
  });

  const setPlayerDetails = useGameStore((state) => state.setPlayerDetails);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlayerDetails(1, {
      name: settings.player1Name,
      color: settings.player1Color,
    });
    setPlayerDetails(2, {
      name: settings.player2Name,
      color: settings.player2Color,
    });
    onStartMatch();
  };

  const colorOptions = [
    { value: "border-red-500", label: "Red", class: "bg-red-500" },
    { value: "border-blue-500", label: "Blue", class: "bg-blue-500" },
    { value: "border-green-500", label: "Green", class: "bg-green-500" },
    { value: "border-yellow-500", label: "Yellow", class: "bg-yellow-500" },
    { value: "border-purple-500", label: "Purple", class: "bg-purple-500" },
    { value: "border-black", label: "Black", class: "bg-black text-white" },
    { value: "border-white", label: "White", class: "bg-white border" },
  ];

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Game Setup</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Player 1 Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Player 1</h3>
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={settings.player1Name}
                onChange={(e) =>
                  setSettings({ ...settings, player1Name: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block mb-1">Color</label>
              <select
                value={settings.player1Color}
                onChange={(e) =>
                  setSettings({ ...settings, player1Color: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                {colorOptions.map((color) => (
                  <option
                    key={color.value}
                    value={color.value}
                    className={color.class}
                  >
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Player 2 Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Player 2</h3>
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={settings.player2Name}
                onChange={(e) =>
                  setSettings({ ...settings, player2Name: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block mb-1">Color</label>
              <select
                value={settings.player2Color}
                onChange={(e) =>
                  setSettings({ ...settings, player2Color: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                {colorOptions.map((color) => (
                  <option
                    key={color.value}
                    value={color.value}
                    className={color.class}
                  >
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Match
          </button>
        </form>
      </div>
    </div>
  );
}
