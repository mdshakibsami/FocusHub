import { api } from "../../../utils/api";
import Swal from "sweetalert2";
import { useState } from "react";
import TrueFalseQuiz from "./TrueFalseQuiz";
import MCQQuiz from "./MCQQuiz";
import MCQQuestions from "./MCQQuestions";
import TFQuestions from "./TFQuestions";

const QAGenerator = () => {
  const [questionsSet, setQuestionsSet] = useState([]);
  const [questionsType, setQuestionsType] = useState("");
  const [questionsGenerate, setQuestionsGenerate] = useState(false);

  const handleExamQuestionsGenerator = async (e) => {
    e.preventDefault();
    setQuestionsSet([]);
    const action = e.nativeEvent.submitter.value;

    if (action === "quiz") {
      setQuestionsGenerate(false);
    } else if (action === "qaGenerator") {
      setQuestionsGenerate(true);
    }
    const form = e.target;
    const subject = form.subject.value;
    const type = form.questionType.value;
    const number = form.numberOfQuestions.value;
    const difficulty = form.difficulty.value;
    setQuestionsType(type);

    if (!subject || !type || !number || !difficulty) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please fill all fields.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    //qa-generator?subject=Math&type=MCQ&number=10
    const result = await api.get(
      `/qa-generator?subject=${subject}&type=${type}&difficulty=${difficulty}&number=${number}`
    );
    if (result.data.success) {
      setQuestionsSet(result.data.newQuestions);
    }
  };

  return (
    <div className="mx-2 sm:mx-4">
      <div className="py-10">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg tracking-wide">
          Quiz, Questions and Answers Generator
        </h1>
      </div>

      <div className="bg-gradient-to-br from-[#23272f] via-[#334756] to-[#4c22d5] p-4 sm:p-8 rounded-2xl shadow-2xl border-2 border-[#4c22d5]">
        <form
          className="flex flex-col gap-8"
          onSubmit={handleExamQuestionsGenerator}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <select
              name="subject"
              className="p-3 bg-[#181a20] text-white rounded-xl border-2 border-[#3b424f] focus:border-[#4c22d5] focus:outline-none font-semibold"
            >
              <option value="">Choose Subject</option>
              <option value="Math">Math</option>
              <option value="English">English</option>
              <option value="Biology">Biology</option>
            </select>

            <select
              name="questionType"
              className="p-3 bg-[#181a20] text-white rounded-xl border-2 border-[#3b424f] focus:border-[#4c22d5] focus:outline-none font-semibold"
            >
              <option value="">Question Type</option>
              <option value="MCQ">MCQ</option>
              <option value="TF">True/False</option>
            </select>

            <select
              name="numberOfQuestions"
              className="p-3 bg-[#181a20] text-white rounded-xl border-2 border-[#3b424f] focus:border-[#4c22d5] focus:outline-none font-semibold"
            >
              <option value="">Number of Questions</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
            </select>

            <select
              name="difficulty"
              className="p-3 bg-[#181a20] text-white rounded-xl border-2 border-[#3b424f] focus:border-[#4c22d5] focus:outline-none font-semibold"
            >
              <option value="">Difficulty Level</option>
              <option value="Easy">Easy</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-2">
            <button
              type="submit"
              name="action"
              value={"qaGenerator"}
              className="bg-green-500 text-white py-3 px-8 rounded-2xl font-extrabold shadow-lg transition-colors text-lg hover:bg-green-600 tracking-wide border-2 border-green-400 focus:ring-2 focus:ring-green-400"
            >
              Q&A Generator
            </button>

            <button
              type="submit"
              name="action"
              value={"quiz"}
              className="bg-green-500 text-white py-3 px-8 rounded-2xl font-extrabold shadow-lg hover:bg-green-600 transition-colors text-lg tracking-wide border-2 border-green-400 focus:ring-2 focus:ring-green-400"
            >
              Quiz
            </button>
          </div>
        </form>
      </div>

      {questionsGenerate && questionsType === "MCQ" && (
        <MCQQuestions questionsSet={questionsSet}></MCQQuestions>
      )}
      {questionsGenerate && questionsType === "TF" && (
        <TFQuestions questionsSet={questionsSet}></TFQuestions>
      )}

      {questionsSet && questionsType === "MCQ" && !questionsGenerate && (
        <MCQQuiz questionsSet={questionsSet}></MCQQuiz>
      )}

      {questionsSet && questionsType === "TF" && !questionsGenerate && (
        <TrueFalseQuiz questionsSet={questionsSet}></TrueFalseQuiz>
      )}
    </div>
  );
};

export default QAGenerator;
