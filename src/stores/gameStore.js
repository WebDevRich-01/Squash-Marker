import { create } from "zustand";
import api from "../utils/api";

const getUniqueTimestamp = () => {
  return new Date().getTime();
};

const useGameStore = create((set, get) => ({
  // Match settings
  matchSettings: {
    pointsToWin: 15,
    clearPoints: 2,
    bestOf: 5,
  },

  // Match state
  currentGame: 1,
  gameScores: [], // [{player1: 15, player2: 13}, ...]
  matchWon: false,

  // Current game state
  gameNumber: 1,
  player1: {
    name: "",
    color: "border-red-500",
    score: 0,
    serving: true,
    serveSide: "R",
  },
  player2: {
    name: "",
    color: "border-blue-500",
    score: 0,
    serving: false,
    serveSide: "R",
  },

  // Match history
  gamesWon: {
    player1: 0,
    player2: 0,
  },

  // Initialize score history with starting position
  scoreHistory: [
    {
      type: "initial",
      player1Score: 0,
      player2Score: 0,
      initialServeSide: "R",
      servingPlayer: "player1",
      timestamp: getUniqueTimestamp(),
    },
  ],

  firstServiceComplete: false,

  // Add error state
  saveError: null,
  isSaving: false,

  // Actions
  setPlayerDetails: (playerNum, details) =>
    set((state) => ({
      [`player${playerNum}`]: {
        ...state[`player${playerNum}`],
        ...details,
      },
    })),

  // Add back checkGameWin for the modal
  checkGameWin: () => {
    const state = get();
    const { pointsToWin, clearPoints } = state.matchSettings;
    const { player1, player2 } = state;

    if (
      player1.score >= pointsToWin &&
      player1.score - player2.score >= clearPoints
    ) {
      return 1;
    }
    if (
      player2.score >= pointsToWin &&
      player2.score - player1.score >= clearPoints
    ) {
      return 2;
    }
    return 0;
  },

  addPoint: (playerNum) =>
    set((state) => {
      const player = `player${playerNum}`;
      const opponent = `player${playerNum === 1 ? 2 : 1}`;
      const newScore = state[player].score + 1;
      const isHandout = !state[player].serving;

      const newHistory = [...state.scoreHistory];

      if (isHandout) {
        // Only add the losing player's score above the handout line
        newHistory.push({
          type: "score",
          player: opponent,
          score: state[opponent].score,
          serveSide: state[opponent].serveSide,
          isHandout: true,
          timestamp: getUniqueTimestamp(),
        });
      } else {
        // For normal points (no handout), add the previous score
        newHistory.push({
          type: "score",
          player,
          score: state[player].score,
          serveSide: state[player].serveSide,
          timestamp: getUniqueTimestamp(),
        });
      }

      // Check for win conditions
      const { pointsToWin, clearPoints } = state.matchSettings;
      const newPlayerScore = newScore;
      const opponentScore = state[opponent].score;

      const isWinningPoint =
        newPlayerScore >= pointsToWin &&
        newPlayerScore - opponentScore >= clearPoints;

      if (isWinningPoint) {
        // Only record the game score here, not in recordGameWin
        const newGameScores = [
          ...state.gameScores,
          {
            player1: playerNum === 1 ? newPlayerScore : opponentScore,
            player2: playerNum === 2 ? newPlayerScore : opponentScore,
          },
        ];

        const playerWins = newGameScores.filter((s) =>
          playerNum === 1 ? s.player1 > s.player2 : s.player2 > s.player1
        ).length;
        const matchWon = playerWins > state.matchSettings.bestOf / 2;

        return {
          ...state,
          [player]: {
            ...state[player],
            score: newScore,
            serving: true,
            serveSide: isHandout
              ? "R"
              : state[player].serveSide === "R"
              ? "L"
              : "R",
          },
          [opponent]: {
            ...state[opponent],
            serving: false,
          },
          scoreHistory: newHistory,
          gameScores: newGameScores,
          matchWon,
        };
      }

      return {
        ...state,
        [player]: {
          ...state[player],
          score: newScore,
          serving: true,
          serveSide: isHandout
            ? "R"
            : state[player].serveSide === "R"
            ? "L"
            : "R",
        },
        [opponent]: {
          ...state[opponent],
          serving: false,
        },
        scoreHistory: newHistory,
      };
    }),

  toggleServeSide: (playerNum) =>
    set((state) => {
      const player = `player${playerNum}`;
      const newServeSide = state[player].serveSide === "R" ? "L" : "R";

      // If no points scored yet, update the initial serve side in history
      const newHistory = [...state.scoreHistory];
      if (state.player1.score === 0 && state.player2.score === 0) {
        newHistory[0] = {
          ...newHistory[0],
          initialServeSide: newServeSide,
        };
      }

      return {
        [player]: {
          ...state[player],
          serveSide: newServeSide,
        },
        scoreHistory: newHistory,
      };
    }),

  resetGame: () =>
    set(() => ({
      // Match settings reset to defaults
      matchSettings: {
        pointsToWin: 15,
        clearPoints: 2,
        bestOf: 5,
      },
      // Reset player details
      player1: {
        name: "",
        color: "border-red-500",
        score: 0,
        serving: true,
        serveSide: "R",
      },
      player2: {
        name: "",
        color: "border-blue-500",
        score: 0,
        serving: false,
        serveSide: "R",
      },
      // Reset match state
      currentGame: 1,
      gameScores: [],
      matchWon: false,
      // Reset score history
      scoreHistory: [
        {
          type: "initial",
          player1Score: 0,
          player2Score: 0,
          initialServeSide: "R",
          servingPlayer: "player1",
          timestamp: getUniqueTimestamp(),
        },
      ],
      // Reset error states
      saveError: null,
      isSaving: false,
    })),

  undoLastPoint: () =>
    set((state) => {
      if (state.scoreHistory.length <= 1) return state;

      // Get the last entry and remove it
      const lastEntry = state.scoreHistory[state.scoreHistory.length - 1];
      let newHistory = state.scoreHistory.slice(0, -1);

      // If it's a let entry, remove the previous entry too
      if (lastEntry.type === "let" && newHistory.length > 1) {
        newHistory = newHistory.slice(0, -1);
        return { scoreHistory: newHistory };
      }

      // If it's a stroke entry, remove the previous entries and reduce score
      if (lastEntry.type === "stroke") {
        const player = lastEntry.player;
        const opponent = player === "player1" ? "player2" : "player1";
        newHistory = newHistory.slice(0, -1);

        // If it was a handout stroke, restore serving state
        if (lastEntry.isHandout) {
          return {
            [player]: {
              ...state[player],
              score: state[player].score - 1,
              serving: false,
            },
            [opponent]: {
              ...state[opponent],
              serving: true,
            },
            scoreHistory: newHistory,
          };
        }

        // Regular stroke undo
        return {
          [player]: {
            ...state[player],
            score: state[player].score - 1,
          },
          scoreHistory: newHistory,
        };
      }

      // If it's a no let entry with handout, remove the previous score too
      if (
        lastEntry.type === "nolet" &&
        lastEntry.isHandout &&
        newHistory.length > 1
      ) {
        newHistory = newHistory.slice(0, -1);
        return { scoreHistory: newHistory };
      }

      // Handle regular scoring entries
      if (lastEntry.type === "score") {
        const player = lastEntry.player;
        const opponent = player === "player1" ? "player2" : "player1";

        // If this was a handout, we need to restore the previous serving state
        if (lastEntry.isHandout) {
          return {
            [player]: {
              ...state[player],
              serving: true,
            },
            [opponent]: {
              ...state[opponent],
              score: state[opponent].score - 1,
              serving: false,
            },
            scoreHistory: newHistory,
          };
        }

        // Regular point undo
        return {
          [player]: {
            ...state[player],
            score: state[player].score - 1,
            serveSide: lastEntry.serveSide, // Restore previous serve side
          },
          scoreHistory: newHistory,
        };
      }

      // For any other type of entry, just remove it without changing scores
      return { scoreHistory: newHistory };
    }),

  // Add let to score history
  addLet: (playerNum) =>
    set((state) => {
      const player = `player${playerNum}`;
      const newHistory = [...state.scoreHistory];

      newHistory.push({
        type: "let",
        player,
        score: state[player].score,
        serveSide: state[player].serving ? state[player].serveSide : null,
        timestamp: getUniqueTimestamp(),
      });

      return {
        scoreHistory: newHistory,
      };
    }),

  handleLetDecision: (playerNum, decision) =>
    set((state) => {
      const player = `player${playerNum}`;
      const opponent = `player${playerNum === 1 ? 2 : 1}`;
      const newHistory = [...state.scoreHistory];

      switch (decision) {
        case "let": {
          // For a let, no score changes, just replay the rally
          // No need to add anything to score history
          return state; // Return unchanged state
        }

        case "stroke": {
          const isHandout = !state[player].serving;
          const newScore = state[player].score + 1;

          if (isHandout) {
            // Only add the losing player's score above the handout line
            newHistory.push({
              type: "score",
              player: opponent,
              score: state[opponent].score,
              serveSide: state[opponent].serveSide,
              isHandout: true,
              timestamp: getUniqueTimestamp(),
            });
            // Don't add any score for the new serving player
          } else {
            // For normal points (no handout), add the previous score
            newHistory.push({
              type: "score",
              player,
              score: state[player].score,
              serveSide: state[player].serveSide,
              timestamp: getUniqueTimestamp(),
            });
          }

          return {
            [player]: {
              ...state[player],
              score: newScore,
              serving: true,
              serveSide: isHandout
                ? "R"
                : state[player].serveSide === "R"
                ? "L"
                : "R",
            },
            [opponent]: {
              ...state[opponent],
              serving: false,
            },
            scoreHistory: newHistory,
          };
        }

        case "nolet": {
          const isServingPlayerCalling = state[player].serving;
          const willHandout = isServingPlayerCalling;
          const newScore = state[opponent].score + 1;

          if (willHandout) {
            // Only add the losing player's score above the handout line
            newHistory.push({
              type: "score",
              player,
              score: state[player].score,
              serveSide: state[player].serveSide,
              isHandout: true,
              timestamp: getUniqueTimestamp(),
            });
            // Don't add any score for the new serving player
          } else {
            // For normal points (no handout), add the previous score
            newHistory.push({
              type: "score",
              player: opponent,
              score: state[opponent].score,
              serveSide: state[opponent].serveSide,
              timestamp: getUniqueTimestamp(),
            });
          }

          return {
            [opponent]: {
              ...state[opponent],
              score: newScore,
              serving: true,
              serveSide: willHandout
                ? "R"
                : state[opponent].serveSide === "R"
                ? "L"
                : "R",
            },
            [player]: {
              ...state[player],
              serving: false,
            },
            scoreHistory: newHistory,
          };
        }

        default:
          return state;
      }
    }),

  // Record game result and check for match win
  recordGameWin: (winningPlayer) =>
    set((state) => {
      console.log("Recording win for player", winningPlayer, "Current state:", {
        currentGame: state.currentGame,
        gameScores: state.gameScores,
        player1Score: state.player1.score,
        player2Score: state.player2.score,
      });

      // Don't modify gameScores here, it's already handled in addPoint
      // Just return the state with matchWon set to false
      return {
        ...state,
        matchWon: false, // We'll handle match win check separately
      };
    }),

  // Start next game
  startNextGame: () =>
    set((state) => ({
      ...state,
      currentGame: state.currentGame + 1,
      player1: {
        ...state.player1,
        score: 0,
        serving: true,
        serveSide: "R",
      },
      player2: {
        ...state.player2,
        score: 0,
        serving: false,
        serveSide: "R",
      },
      scoreHistory: [
        {
          type: "initial",
          player1Score: 0,
          player2Score: 0,
          initialServeSide: "R",
          servingPlayer: "player1",
          timestamp: getUniqueTimestamp(),
        },
      ],
    })),

  // Initialize game with settings
  initializeGame: (settings) => {
    set(() => ({
      matchSettings: {
        pointsToWin: settings.pointsToWin,
        clearPoints: settings.clearPoints,
        bestOf: settings.bestOf,
      },
      player1: {
        name: settings.player1Name,
        color: settings.player1Color,
        score: 0,
        serving: settings.player1Serving,
        serveSide: "R",
      },
      player2: {
        name: settings.player2Name,
        color: settings.player2Color,
        score: 0,
        serving: !settings.player1Serving,
        serveSide: "R",
      },
      currentGame: 1,
      gameScores: [],
      matchWon: false,
      scoreHistory: [
        {
          type: "initial",
          player1Score: 0,
          player2Score: 0,
          initialServeSide: "R",
          servingPlayer: settings.player1Serving ? "player1" : "player2",
          timestamp: getUniqueTimestamp(),
        },
      ],
    }));
  },

  // Updated save method with error handling
  saveCompletedMatch: async () => {
    const state = get();
    set({ isSaving: true, saveError: null });

    const matchData = {
      player1Name: state.player1.name,
      player2Name: state.player2.name,
      player1Color: state.player1.color,
      player2Color: state.player2.color,
      gameScores: state.gameScores,
      matchSettings: state.matchSettings,
      date: new Date(),
    };

    try {
      await api.saveMatch(matchData);
      set({ isSaving: false });
      return true;
    } catch (error) {
      console.error("Error saving match:", error);
      set({
        saveError: "Failed to save match. Please try again.",
        isSaving: false,
      });
      return false;
    }
  },

  // Updated game completion handler
  handleGameCompletion: async () => {
    const state = get();
    const { currentGame } = state;

    // Check if match is won
    const matchWon = get().checkMatchWin();
    if (matchWon) {
      set({ matchWon: true });
      const savedSuccessfully = await get().saveCompletedMatch();
      if (!savedSuccessfully) {
        console.error("Match save failed");
      }
    }

    // Start next game if match isn't over
    if (!matchWon) {
      // Reset scores but DON'T increment game number here
      // The game number will be incremented in startNextGame
      set((state) => ({
        player1: { ...state.player1, score: 0 },
        player2: { ...state.player2, score: 0 },
      }));
    }
  },

  // Add method to clear error
  clearSaveError: () => set({ saveError: null }),

  checkMatchWin: () => {
    const state = get();
    const { bestOf } = state.matchSettings;
    const { gameScores } = state;

    // Calculate wins for each player
    const player1Wins = gameScores.filter(
      (score) => score.player1 > score.player2
    ).length;
    const player2Wins = gameScores.filter(
      (score) => score.player2 > score.player1
    ).length;

    // Check if either player has won more than half of the total games
    if (player1Wins > bestOf / 2) {
      return 1;
    }
    if (player2Wins > bestOf / 2) {
      return 2;
    }

    return 0; // No winner yet
  },

  // Add this method to the store
  updateGameSettings: (settings) => {
    set((state) => ({
      matchSettings: {
        ...state.matchSettings,
        pointsToWin: settings.pointsToWin,
        clearPoints: settings.clearPoints,
        bestOf: settings.bestOf,
      },
      player1: {
        ...state.player1,
        name: settings.player1Name,
        color: settings.player1Color,
        // Don't update score or serving status
      },
      player2: {
        ...state.player2,
        name: settings.player2Name,
        color: settings.player2Color,
        // Don't update score or serving status
      },
      // Don't reset currentGame, gameScores, or matchWon
    }));
  },
}));

export default useGameStore;
