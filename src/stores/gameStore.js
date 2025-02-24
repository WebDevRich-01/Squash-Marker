import { create } from "zustand";

const useGameStore = create((set, get) => ({
  // Match settings
  matchSettings: {
    pointsToWin: 15,
    clearPoints: 2,
    bestOf: 5,
  },

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
      timestamp: Date.now(),
    },
  ],

  firstServiceComplete: false,

  // Actions
  setPlayerDetails: (playerNum, details) =>
    set((state) => ({
      [`player${playerNum}`]: {
        ...state[`player${playerNum}`],
        ...details,
      },
    })),

  addPoint: (playerNum) =>
    set((state) => {
      const player = `player${playerNum}`;
      const opponent = `player${playerNum === 1 ? 2 : 1}`;
      const newScore = state[player].score + 1;
      const isHandout = !state[player].serving;

      const newHistory = [...state.scoreHistory];

      if (isHandout) {
        // Add the losing player's score first
        newHistory.push({
          type: "score",
          player: opponent,
          score: state[opponent].score,
          serveSide: state[opponent].serveSide,
          isHandout: true,
          timestamp: Date.now(),
        });
      } else if (state[player].score > 0) {
        // Only add winning player's score if not a handout and not the first point
        newHistory.push({
          type: "score",
          player,
          score: state[player].score,
          serveSide: state[player].serveSide,
          isHandout: false,
          timestamp: Date.now(),
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
    set((state) => ({
      player1: { ...state.player1, score: 0, serving: true, serveSide: "R" },
      player2: { ...state.player2, score: 0, serving: false, serveSide: "R" },
      scoreHistory: [
        {
          type: "initial",
          player1Score: 0,
          player2Score: 0,
          initialServeSide: "R",
          servingPlayer: "player1",
          timestamp: Date.now(),
        },
      ],
    })),

  undoLastPoint: () =>
    set((state) => {
      if (state.scoreHistory.length <= 1) return state;

      const lastScore = state.scoreHistory[state.scoreHistory.length - 1];
      const player = lastScore.player;
      const opponent = player === "player1" ? "player2" : "player1";

      // If we're undoing a handout, remove both the handout score and the previous score
      const newHistory = state.scoreHistory.slice(
        0,
        lastScore.isHandout ? -2 : -1
      );

      return {
        [player]: {
          ...state[player],
          score: state[player].score - 1,
          serving: !lastScore.isHandout,
        },
        [opponent]: {
          ...state[opponent],
          serving: lastScore.isHandout,
        },
        scoreHistory: newHistory,
      };
    }),
}));

export default useGameStore;
