import React from "react";

const TFQuestions = ({ questionsSet }) => {
  return (
    <div className="space-y-6">
      {questionsSet.map((q, idx) => (
        <div
          key={idx}
          className="flex my-4 justify-between items-center p-6 border-2 border-green-400 rounded-xl shadow-lg "
        >
          <div className="font-semibold text-lg  text-green-500">
            {idx + 1}. {q.question}
          </div>
          <div className="flex gap-2 items-center ">
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
