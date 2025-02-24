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
        timestamp: Date.now(),
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
          // Add current score first
          newHistory.push({
            type: "score",
            player: state[opponent].serving ? opponent : player,
            score: state[state[opponent].serving ? opponent : player].score,
            serveSide:
              state[state[opponent].serving ? opponent : player].serveSide,
            timestamp: Date.now() - 1,
          });
          // Add "Let" on next line
          newHistory.push({
            type: "let",
            player,
            timestamp: Date.now(),
          });
          return { scoreHistory: newHistory };
        }

        case "stroke": {
          const isHandout = !state[player].serving;

          if (isHandout) {
            // Add losing player's score first
            newHistory.push({
              type: "score",
              player: opponent,
              score: state[opponent].score,
              serveSide: state[opponent].serveSide,
              timestamp: Date.now() - 2,
            });
            // Add "Stroke" before the handout line
            newHistory.push({
              type: "stroke",
              player,
              timestamp: Date.now() - 1,
              isHandout: true, // This will trigger the handout line
            });
          } else {
            // Add current score first if not a handout
            if (state[player].score > 0) {
              newHistory.push({
                type: "score",
                player,
                score: state[player].score,
                serveSide: state[player].serveSide,
                timestamp: Date.now() - 1,
              });
            }
            // Add "Stroke" on next line
            newHistory.push({
              type: "stroke",
              player,
              timestamp: Date.now(),
            });
          }

          return {
            [player]: {
              ...state[player],
              score: state[player].score + 1,
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

          if (willHandout) {
            // Add serving player's current score first
            newHistory.push({
              type: "score",
              player,
              score: state[player].score,
              serveSide: state[player].serveSide,
              timestamp: Date.now() - 2,
            });

            // Add "No Let" with handout flag
            newHistory.push({
              type: "nolet",
              player,
              isHandout: true,
              timestamp: Date.now() - 1,
            });
          } else {
            // For non-serving player, just add "No Let"
            newHistory.push({
              type: "nolet",
              player,
              timestamp: Date.now() - 1,
            });

            // Add opponent's score if they had points
            if (state[opponent].score > 0) {
              newHistory.push({
                type: "score",
                player: opponent,
                score: state[opponent].score,
                serveSide: state[opponent].serveSide,
                timestamp: Date.now(),
              });
            }
          }

          return {
            [opponent]: {
              ...state[opponent],
              score: state[opponent].score + 1,
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
}));

export default useGameStore;
