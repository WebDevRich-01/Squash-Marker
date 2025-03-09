import React from "react";

export default function LandingScreen({ onNewMatch, onFindMatch }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-8">Squash Marker</h1>

        <div className="space-y-4">
          <button
            onClick={onNewMatch}
            className="w-full py-4 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-lg shadow-sm transition-colors"
          >
            Start New Match
          </button>

          <button
            onClick={onFindMatch}
            className="w-full py-4 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-lg shadow-sm transition-colors"
          >
            Find Match
          </button>
        </div>
      </div>
    </div>
  );
}
