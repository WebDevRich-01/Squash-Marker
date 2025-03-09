// Mock API using localStorage
const STORAGE_KEY = "squash_matches";

// Helper to get matches from localStorage
const getStoredMatches = () => {
  const matches = localStorage.getItem(STORAGE_KEY);
  return matches ? JSON.parse(matches) : [];
};

// Helper to save matches to localStorage
const saveStoredMatches = (matches) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
};

const api = {
  // Get all matches
  getMatches: async () => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const matches = getStoredMatches();
        resolve(matches);
      }, 500);
    });
  },

  // Get a specific match
  getMatch: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const matches = getStoredMatches();
        const match = matches.find((m) => m._id === id);

        if (match) {
          resolve(match);
        } else {
          reject(new Error("Match not found"));
        }
      }, 300);
    });
  },

  // Save a match
  saveMatch: async (matchData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const matches = getStoredMatches();
        const newMatch = {
          ...matchData,
          _id: `match_${Date.now()}`, // Generate a simple ID
          date: new Date().toISOString(),
        };

        matches.unshift(newMatch); // Add to beginning of array
        saveStoredMatches(matches);

        resolve(newMatch);
      }, 300);
    });
  },

  // Delete a match
  deleteMatch: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const matches = getStoredMatches();
        const updatedMatches = matches.filter((match) => match._id !== id);

        // If the lengths are different, a match was removed
        const success = updatedMatches.length < matches.length;

        if (success) {
          saveStoredMatches(updatedMatches);
          resolve({ success: true });
        } else {
          resolve({ success: false, error: "Match not found" });
        }
      }, 300);
    });
  },
};

export default api;
