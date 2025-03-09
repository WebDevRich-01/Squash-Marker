import { useState, useEffect } from "react";
import api from "../utils/api";

export default function MatchHistoryScreen({ onBack }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredMatches = matches.filter(
    (match) =>
      match.player1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.player2Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

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

  const getScoreDisplay = (match) => {
    const player1Wins = match.gameScores.filter(
      (game) => game.player1 > game.player2
    ).length;
    const player2Wins = match.gameScores.filter(
      (game) => game.player2 > game.player1
    ).length;

    return `${player1Wins}-${player2Wins}`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading matches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

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

        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex-1 overflow-auto p-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {searchTerm ? "No matches found" : "No matches recorded yet"}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div
                key={match._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">{formatDate(match.date)}</div>
                  <div className="text-sm text-gray-500">
                    {getScoreDisplay(match)}
                  </div>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
