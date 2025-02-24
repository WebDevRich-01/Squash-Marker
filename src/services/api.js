const API_URL =
  process.env.REACT_APP_API_URL || "https://squash-marker-backend.onrender.com";

export const api = {
  // Match endpoints
  async getMatches() {
    const response = await fetch(`${API_URL}/api/matches`);
    if (!response.ok) throw new Error("Failed to fetch matches");
    return response.json();
  },

  async getMatch(id) {
    const response = await fetch(`${API_URL}/api/matches/${id}`);
    if (!response.ok) throw new Error("Failed to fetch match");
    return response.json();
  },

  async saveMatch(matchData) {
    const response = await fetch(`${API_URL}/api/matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchData),
    });
    if (!response.ok) throw new Error("Failed to save match");
    return response.json();
  },

  // Event endpoints
  async getEvents() {
    const response = await fetch(`${API_URL}/api/events`);
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
  },

  async createEvent(eventData) {
    const response = await fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error("Failed to create event");
    return response.json();
  },
};
