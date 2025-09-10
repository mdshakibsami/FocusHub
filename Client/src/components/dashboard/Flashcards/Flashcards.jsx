import React, { useEffect, useState } from "react";
import { api } from "../../../utils/api";

const Flashcards = () => {
  const [showModal, setShowModal] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await api.get("/flashcard");
      // console.log(result.data);
      console.log(result.data);
      setCards(result.data);
    })();
  }, []);

  const handleFlashcard = async (e) => {
    e.preventDefault();
    alert();
    const form = e.target;
    const subject = form.subject.value;
    const content = form.content.value;
    const flashData = {
      subject,
      content,
    };
    const result = await api.post("/flashcard", flashData);
    console.log(result.data.insertedId);
    if (result.data.insertedId) {
      setShowModal(false);
      // an sucess sweetalret
    } else {
      // an error sweetalert
    }
  };

  return (
    <div className="mx-4">
      <div className="py-8">
        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-lg tracking-wide">
          Quiz, Questions and Answers Generator
        </h2>
      </div>

      <div className="bg-[#23272f] p-4 rounded-2xl shadow-xl border-2 border-[#4c22d5]">
        <div>
          <div className="flex items-center justify-between ">
            <div className="text-lg font-bold text-white">
              Manage your notes and flashcards for each subject or topic.
            </div>
            <button
              className="bg-[#4c22d5] text-white py-2 px-6 rounded-xl font-bold shadow hover:bg-[#3b1bb3] transition-colors border-2 border-[#23272f]"
              onClick={() => setShowModal(true)}
            >
              Add Flashcard
            </button>
          </div>
        </div>
      </div>

      {cards.map((card, idx) => {
        const cardId = card._id || idx;
        const isFlipped = flippedCards[cardId] || false;
        return (
          <div
            key={cardId}
            className="flip-card cursor-pointer w-80 h-48 mx-auto my-8"
            onClick={() =>
              setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }))
            }
            style={{ perspective: "1000px" }}
          >
            <div
              className={`flip-card-inner transition-transform duration-500 ease-in-out ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                className="flip-card-front absolute w-full h-full bg-[#181a20] rounded-xl flex flex-col items-center justify-center text-white"
                style={{ backfaceVisibility: "hidden" }}
              >
                <h2>{card.subject || "Front Side"}</h2>
                <p>{card.content || "This is the front content"}</p>
              </div>
              <div
                className="flip-card-back absolute w-full h-full bg-[#23272f] rounded-xl flex flex-col items-center justify-center text-white"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <h2>Back Side</h2>
                <p>{card.content || "This is the back content"}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#23272f] p-8 rounded-2xl shadow-xl border-2 border-[#4c22d5] w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Add New Flashcard
            </h2>
            <form onSubmit={handleFlashcard} className="space-y-4">
              <input
                name="subject"
                type="text"
                placeholder="Subject / Topic"
                className="p-3 rounded-xl bg-[#181a20] text-white border-2 border-[#3b424f] focus:border-[#4c22d5] w-full"
              />
              <textarea
                name="content"
                placeholder="Note content"
                className="p-3 rounded-xl bg-[#181a20] text-white border-2 border-[#3b424f] focus:border-[#4c22d5] w-full"
              />

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-6 rounded-xl font-bold hover:bg-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4c22d5] text-white py-2 px-6 rounded-xl font-bold shadow hover:bg-[#3b1bb3] transition-colors border-2 border-[#23272f]"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
