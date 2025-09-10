import React from "react";

const MCQQuestions = ({ questionsSet }) => {
  return (
    <div className="space-y-6">
      {questionsSet.map((q, idx) => (
        <div
          key={idx}
          className="p-6 my-4 rounded-xl  border-green-500 border-1 shadow-lg bg-gradient-to-br from-[#23272f] to-[#1a1d23]"
        >
          <div className="font-bold text-lg mb-2 text-green-500">
            {idx + 1}. {q.question}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {q.options.map((opt, optIdx) => (
              <div
                key={optIdx}
                className="bg-[#23272f] rounded-lg shadow px-4 py-2 text-white font-medium border border-[#3b424f]"
              >
                {opt}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <span className="  font-semibold text-white ">
              <span className="text-green-500">Answer:</span> {q.answer}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MCQQuestions;
