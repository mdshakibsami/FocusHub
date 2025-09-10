import React from "react";

const MCQQuestions = ({ questionsSet }) => {
  return (
    <div className="space-y-8">
      {questionsSet.map((q, idx) => (
        <div
          key={idx}
          className="p-6 my-4 rounded-2xl border-2 border-green-500 shadow-2xl bg-gradient-to-br from-[#23272f] via-[#334756] to-[#4c22d5] hover:scale-[1.01] transition-transform duration-200"
        >
          <div className="font-bold text-xl mb-4 text-green-400 drop-shadow-lg">
            {idx + 1}. {q.question}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {q.options.map((opt, optIdx) => (
              <div
                key={optIdx}
                className="bg-[#23272f] rounded-xl shadow px-4 py-3 text-white font-semibold border-2 border-[#3b424f] hover:bg-[#334756] transition-colors"
              >
                {opt}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <span className="font-semibold text-white">
              <span className="text-green-400">Answer:</span> {q.answer}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MCQQuestions;
