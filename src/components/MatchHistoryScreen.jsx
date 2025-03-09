import { useState, useEffect } from "react";
import api from "../utils/api";

export default function MatchHistoryScreen({ onBack }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // "all", "today", "week", "month"

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await api.getMatches();
        setMatches(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError("Failed to load matches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Filter matches by date
  const getFilteredByDate = (matches) => {
    if (dateFilter === "all") return matches;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dateFilter === "today") {
      return matches.filter((match) => new Date(match.date) >= today);
    }

    if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matches.filter((match) => new Date(match.date) >= weekAgo);
    }

    if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return matches.filter((match) => new Date(match.date) >= monthAgo);
    }

    return matches;
  };

  // Filter matches by search term (player name)
  const getFilteredBySearch = (matches) => {
    if (!searchTerm.trim()) return matches;

    return matches.filter(
      (match) =>
        match.player1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.player2Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Apply all filters
  const filteredMatches = getFilteredBySearch(getFilteredByDate(matches));

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Get winner of a match
  const getWinner = (match) => {
    const player1Wins = match.gameScores.filter(
      (game) => game.player1 > game.player2
    ).length;
    const player2Wins = match.gameScores.filter(
      (game) => game.player2 > game.player1
    ).length;

    if (player1Wins > player2Wins) {
      return match.player1Name;
    } else if (player2Wins > player1Wins) {
      return match.player2Name;
    } else {
      return "Tie";
    }
  };

  // Get score display (e.g., "3-1")
  const getScoreDisplay = (match) => {
    const player1Wins = match.gameScores.filter(
      (game) => game.player1 > game.player2
    ).length;
    const player2Wins = match.gameScores.filter(
      (game) => game.player2 > game.player1
    ).length;

    return `${player1Wins}-${player2Wins}`;
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 mr-2">
              &larr;
            </button>
            <h1 className="text-2xl font-bold">Match History</h1>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Match
          </button>
        </div>

        {/* Search and filter controls */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setDateFilter("all")}
              className={`px-3 py-1 rounded ${
                dateFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter("today")}
              className={`px-3 py-1 rounded ${
                dateFilter === "today"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter("week")}
              className={`px-3 py-1 rounded ${
                dateFilter === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateFilter("month")}
              className={`px-3 py-1 rounded ${
                dateFilter === "month"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-xl text-gray-500">Loading matches...</div>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Retry
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {searchTerm || dateFilter !== "all"
              ? "No matches found with the current filters."
              : "No matches recorded yet."}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div
                key={match._id}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    {formatDate(match.date)}
                  </span>
                  <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                    {getScoreDisplay(match)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium">{match.player1Name}</div>
                    <div className="text-sm text-gray-500">
                      {getWinner(match) === match.player1Name && "Winner"}
                    </div>
                  </div>

                  <div className="text-lg font-bold mx-4">vs</div>

                  <div className="flex-1 text-right">
                    <div className="font-medium">{match.player2Name}</div>
                    <div className="text-sm text-gray-500">
                      {getWinner(match) === match.player2Name && "Winner"}
                    </div>
                  </div>
                </div>

                {/* Game details (expandable) */}
                <div className="mt-3 pt-2 border-t text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>
                      {match.matchSettings.pointsToWin} points,
                      {match.matchSettings.clearPoints === 2 ? " 2 clear" : ""}
                    </span>
                    <span>Best of {match.matchSettings.bestOf}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
