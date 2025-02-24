export default function LetDecisionModal({ playerNum, onDecision, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-80 max-w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Let Decision</h2>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onDecision("let")}
            className="w-full p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded"
          >
            Let
          </button>

          <button
            onClick={() => onDecision("stroke")}
            className="w-full p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded"
          >
            Stroke
          </button>

          <button
            onClick={() => onDecision("nolet")}
            className="w-full p-3 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded"
          >
            No Let
          </button>
        </div>

        <button
          onClick={onCancel}
          className="w-full mt-4 p-3 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
