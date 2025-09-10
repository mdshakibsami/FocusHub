import { useState } from "react";
import Swal from "sweetalert2";
import React from "react";

const TrueFalseQuiz = ({ questionsSet }) => {
  const [answers, setAnswers] = useState({});
  // Get actual answers array
  const actualAnswers = questionsSet.map((qs) => qs.answer);

  // handle change for each radio button
  const handleChange = (qIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: value,
    }));
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let wrongAnswer = 0;
    const totalAnswers = actualAnswers.length;
    for (let i = 0; i < totalAnswers; i++) {
      if (actualAnswers[i] !== answers[i]) wrongAnswer += 1;
    }
    const score = totalAnswers - wrongAnswer;

    Swal.fire({
      title: "Quiz Completed!",
      text: `Your score: ${score} / ${totalAnswers}`,
      icon: score === totalAnswers ? "success" : "info",
      confirmButtonText: "OK",
      background: "#23272f",
      color: "white",
      confirmButtonColor: "#22c55e",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {questionsSet.map((oneQS, qIndex) => (
        <div
          key={qIndex}
          className="flex flex-col sm:flex-row items-center justify-between my-6 p-6 border-2 border-green-400 rounded-2xl shadow-2xl bg-gradient-to-br from-[#23272f] via-[#334756] to-[#4c22d5] hover:scale-[1.01] transition-transform duration-200"
        >
          <legend className="font-bold text-xl mb-2 text-green-400 drop-shadow-lg">
            {qIndex + 1}. {oneQS.question}
          </legend>

          <div className="flex gap-8 justify-center text-white">
            {["True", "False"].map((opt, optIndex) => {
              const id = `q${qIndex}-opt${optIndex}`;
              return (
                <div key={id} className="flex items-center">
                  <input
                    type="radio"
                    id={id}
                    className="radio radio-error"
                    name={`question-${qIndex}`}
                    onChange={() => handleChange(qIndex, opt)}
                    required
                  />
                  <label
                    htmlFor={id}
                    className={`cursor-pointer ml-2 font-bold ${
                      opt === "True" ? "text-green-500" : "text-red-500"
                    } drop-shadow-lg`}
                  >
                    {opt}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-8">
        <button
          type="submit"
          className="bg-green-600 mb-5 text-white px-8 py-3 rounded-2xl font-extrabold shadow-lg hover:bg-green-700 transition-colors border-2 border-green-400"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TrueFalseQuiz;
