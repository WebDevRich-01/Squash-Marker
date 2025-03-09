import { useState, useEffect } from "react";
import useGameStore from "../stores/gameStore";
import PropTypes from "prop-types";
import api from "../utils/api";

export default function GameSetupScreen({
  initialSettings,
  onStartMatch,
  onReturnToMatch,
  isEditing,
  onBack,
}) {
  const [settings, setSettings] = useState(
    initialSettings || {
      player1Name: "",
      player2Name: "",
      player1Color: "border-red-500",
      player2Color: "border-blue-500",
      pointsToWin: 15,
      clearPoints: 2,
      bestOf: 5,
      player1Serving: true,
      eventName: "",
    }
  );

  const [eventNames, setEventNames] = useState([]);
  const [showEventSuggestions, setShowEventSuggestions] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const initializeGame = useGameStore((state) => state.initializeGame);

  useEffect(() => {
    const fetchEventNames = async () => {
      try {
        const names = await api.getEventNames();
        setEventNames(names);
      } catch (error) {
        console.error("Error fetching event names:", error);
      }
    };

    fetchEventNames();
  }, []);

  useEffect(() => {
    if (settings.eventName) {
      const filtered = eventNames.filter((name) =>
        name.toLowerCase().includes(settings.eventName.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(eventNames);
    }
  }, [settings.eventName, eventNames]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      onReturnToMatch(settings);
    } else {
      initializeGame(settings);
      onStartMatch();
    }
  };

  const handleEventNameChange = (e) => {
    setSettings({ ...settings, eventName: e.target.value });
    setShowEventSuggestions(true);
  };

  const selectEvent = (eventName) => {
    setSettings({ ...settings, eventName });
    setShowEventSuggestions(false);
  };

  const colorOptions = [
    { value: "border-red-500", label: "Red", bgClass: "bg-red-500" },
    { value: "border-blue-500", label: "Blue", bgClass: "bg-blue-500" },
    { value: "border-green-500", label: "Green", bgClass: "bg-green-500" },
    { value: "border-yellow-500", label: "Yellow", bgClass: "bg-yellow-500" },
    { value: "border-purple-500", label: "Purple", bgClass: "bg-purple-500" },
    { value: "border-black", label: "Black", bgClass: "bg-black" },
    { value: "border-white", label: "White", bgClass: "bg-white border" },
  ];

  const getColorBgClass = (colorValue) => {
    const color = colorOptions.find((c) => c.value === colorValue);
    return color ? color.bgClass : "";
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100 p-4 overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center mb-4">
          <button onClick={onBack} className="p-2">
            &larr;
          </button>
          <h2 className="text-2xl font-bold text-center flex-1">
            {isEditing ? "Edit Game Settings" : "Game Setup"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-center border-b pb-2">
              Event
            </h3>
            <div className="relative">
              <label className="block mb-1 font-medium">Event Name</label>
              <input
                type="text"
                value={settings.eventName}
                onChange={handleEventNameChange}
                onFocus={() => setShowEventSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowEventSuggestions(false), 200)
                }
                className="w-full p-2 border rounded"
                placeholder="Enter event name"
              />
              {showEventSuggestions && filteredEvents.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredEvents.map((name, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectEvent(name)}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-center border-b pb-2">
              Player 1
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Name</label>
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

              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <select
                      value={settings.player1Color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          player1Color: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded appearance-none pl-10"
                      style={{ zIndex: 30 }}
                    >
                      {colorOptions.map((color) => (
                        <option
                          key={color.value}
                          value={color.value}
                          className="p-2"
                        >
                          {color.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${getColorBgClass(
                        settings.player1Color
                      )}`}
                    />
                  </div>
                </div>

                <div className="flex-1 flex items-center p-2 bg-white rounded border">
                  <input
                    type="checkbox"
                    checked={settings.player1Serving}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        player1Serving: e.target.checked,
                        player2Serving: !e.target.checked,
                      })
                    }
                    className="mr-2 h-4 w-4"
                  />
                  <label className="font-medium">Serves First</label>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-center border-b pb-2">
              Player 2
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Name</label>
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

              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <select
                      value={settings.player2Color}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          player2Color: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded appearance-none pl-10"
                      style={{ zIndex: 30 }}
                    >
                      {colorOptions.map((color) => (
                        <option
                          key={color.value}
                          value={color.value}
                          className="p-2"
                        >
                          {color.label}
                        </option>
                      ))}
                    </select>
                    <div
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${getColorBgClass(
                        settings.player2Color
                      )}`}
                    />
                  </div>
                </div>

                <div className="flex-1 flex items-center p-2 bg-white rounded border">
                  <input
                    type="checkbox"
                    checked={!settings.player1Serving}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        player1Serving: !e.target.checked,
                        player2Serving: e.target.checked,
                      })
                    }
                    className="mr-2 h-4 w-4"
                  />
                  <label className="font-medium">Serves First</label>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-center border-b pb-2">
              Match Settings
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">
                    Points to Win
                  </label>
                  <select
                    value={settings.pointsToWin}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pointsToWin: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded"
                    style={{ zIndex: 30 }}
                  >
                    <option value={11}>11 Points</option>
                    <option value={15}>15 Points</option>
                  </select>
                </div>

                <div className="flex-1 flex items-end">
                  <div className="flex items-center p-2 bg-white rounded border w-full">
                    <input
                      type="checkbox"
                      checked={settings.clearPoints === 2}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          clearPoints: e.target.checked ? 2 : 1,
                        })
                      }
                      className="mr-2 h-4 w-4"
                    />
                    <label className="font-medium">2 Clear Points</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Match Format</label>
                <select
                  value={settings.bestOf}
                  onChange={(e) =>
                    setSettings({ ...settings, bestOf: Number(e.target.value) })
                  }
                  className="w-full p-2 border rounded"
                  style={{ zIndex: 30 }}
                >
                  <option value={3}>Best of 3</option>
                  <option value={5}>Best of 5</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-lg shadow-sm"
          >
            {isEditing ? "Return to Match" : "Start Match"}
          </button>
        </form>
      </div>
    </div>
  );
}

GameSetupScreen.propTypes = {
  initialSettings: PropTypes.shape({
    player1Name: PropTypes.string,
    player2Name: PropTypes.string,
    player1Color: PropTypes.string,
    player2Color: PropTypes.string,
    pointsToWin: PropTypes.number,
    clearPoints: PropTypes.number,
    bestOf: PropTypes.number,
    player1Serving: PropTypes.bool,
    eventName: PropTypes.string,
  }),
  onStartMatch: PropTypes.func.isRequired,
  onReturnToMatch: PropTypes.func,
  isEditing: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
};

GameSetupScreen.defaultProps = {
  initialSettings: null,
  onReturnToMatch: null,
};
