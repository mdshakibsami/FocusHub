import { useState } from "react";
import Swal from "sweetalert2";

const TrueFalse = ({ questionsSet }) => {
  const [answers, setAnswers] = useState({});
  console.log(questionsSet);
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
    console.log(score)
    
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
          className=" flex items-center justify-between my-6 p-6 border-2 border-green-400 rounded-xl shadow-lg  from-[#23272f]  hover:scale-[1.01] transition-transform duration-200"
        >
          <legend className="font-bold text-lg mb-4 text-white">
            {qIndex + 1}. {oneQS.question}
          </legend>

          <div className="flex gap-8 justify-center ">
            {["True", "False"].map((opt, optIndex) => {
              const id = `q${qIndex}-opt${optIndex}`;
              return (
                <div
                  key={id}
                  className="flex items-center bg-[#3b424f]rounded-lg shadow px-3 py-2 hover:bg-green-500 transition-colors"
                >
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
                    className="ml-2 text-white font-bold cursor-pointer"
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
          className="bg-green-600 mb-5 text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-green-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TrueFalse;
