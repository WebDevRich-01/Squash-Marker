import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function MatchHistoryScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await api.getMatches();
      setMatches(data);
      setError(null);
    } catch (err) {
      setError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(
    (match) =>
      match.player1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.player2Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onClick={fetchMatches}
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
          <h1 className="text-2xl font-bold">Match History</h1>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Match
          </Link>
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
                  <div className="font-semibold">
                    {match.player1Name} vs {match.player2Name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(match.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-1">
                  {match.gameScores.map((score, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>Game {index + 1}:</span>
                      <span className="font-mono">
                        {score.player1} - {score.player2}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                  {match.matchSettings.pointsToWin} points, Best of{" "}
                  {match.matchSettings.bestOf}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
