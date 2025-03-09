const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = {
  // Get all matches
  getMatches: async () => {
    const response = await fetch(`${API_URL}/matches`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  // Get a specific match
  getMatch: async (id) => {
    const response = await fetch(`${API_URL}/matches/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },

  // Save a match
  saveMatch: async (matchData) => {
    const response = await fetch(`${API_URL}/matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },
};

export default api;
