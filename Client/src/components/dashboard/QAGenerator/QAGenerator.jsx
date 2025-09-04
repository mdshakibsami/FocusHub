import { Outlet } from "react-router";
import { api } from "../../../utils/api";
import { useState } from "react";
import MCQ from "./MCQ";
import TrueFalse from "./TrueFalse";

const QAGenerator = () => {
  const [questionsSet, setQuestionsSet] = useState([]);
  const [questionsType, setQuestionsType] = useState("");
  const handleQuestionAnswerGenerator = async (e) => {
    e.preventDefault();
    const form = e.target;
    const subject = form.subject.value;
    const type = form.questionType.value;
    const number = form.numberOfQuestions.value;
    const difficulty = form.difficulty.value;
    // console.log(subject, type, number, difficulty);
    setQuestionsType(type);

    //qa-generator?subject=Math&type=MCQ&number=10
    const result = await api.get(
      `/qa-generator?subject=${subject}&type=${type}&difficulty=${difficulty}&number=${number}`
    );
    console.log(result.data);
    if (result.data.success) {
      setQuestionsSet(result.data.newQuestions);
    }
  };

  return (
    <div className="mx-2">
      <div className="py-6">
        <h2 className="text-2xl font-bold text-center">
          Questions and Answers Generator
        </h2>
      </div>

      <div className=" bg-green-500 p-6 rounded-lg  ">
        <form
          className="flex  gap-4  "
          onSubmit={handleQuestionAnswerGenerator}
        >
          <div className="flex justify-between gap-2 w-full ">
            <select
              name="subject"
              className="p-2   bg-[#23272f] rounded border"
            >
              <option value="">Choose Subject</option>
              <option value="Math">Math</option>
              <option value="English">English</option>
              <option value="Biology">Biology</option>
            </select>

            <select
              name="questionType"
              className="p-2  bg-[#23272f] rounded border"
            >
              <option value="">Question Type</option>
              <option value="MCQ">MCQ</option>
              <option value="TF">True/False</option>
            </select>

            <select
              name="numberOfQuestions"
              className="p-2  bg-[#23272f] rounded border"
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
              className="p-2  bg-[#23272f] rounded border"
            >
              <option value="">Difficulty Level</option>
              <option value="Easy">Easy</option>
              <option value="Hard">Hard</option>
            </select>

            <button
              type="submit"
              className="bg-[#e64524] text-white py-2 px-4 rounded font-bold hover:bg-[#c53b1f]"
            >
              Generate
            </button>
          </div>
        </form>
      </div>

      {questionsSet && questionsType === "MCQ" && (
        <MCQ questionsSet={questionsSet}></MCQ>
      )}
      {questionsSet && questionsType === "TF" && <TrueFalse questionsSet={questionsSet}></TrueFalse>}
    </div>
  );
};

export default QAGenerator;
