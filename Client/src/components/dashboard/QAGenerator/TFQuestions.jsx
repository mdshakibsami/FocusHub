import React from "react";

const TFQuestions = ({ questionsSet }) => {
  return (
  <div className="space-y-8">
      {questionsSet.map((q, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row my-4 justify-between items-center p-6 rounded-2xl border-2 border-green-400 shadow-2xl bg-gradient-to-br from-[#23272f] via-[#334756] to-[#4c22d5] hover:scale-[1.01] transition-transform duration-200"
        >
          <div className="font-bold text-xl mb-2 text-green-400 drop-shadow-lg">
            {idx + 1}. {q.question}
          </div>
          <div className="flex gap-2 items-center text-white">
            <span className="font-bold">Answer: </span>
            <span
              className={` font-bold ${
                q.answer === "True" ? "text-green-500" : "text-red-500"
              }`}
            >
              {q.answer}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TFQuestions;
