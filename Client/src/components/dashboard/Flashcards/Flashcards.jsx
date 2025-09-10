import React, { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import Swal from "sweetalert2";

const Flashcards = () => {
  const [showModal, setShowModal] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [cards, setCards] = useState([]);
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    (async () => {
      const result = await api.get("/flashcard");
      setCards(result.data);
    })();
  }, [refetch]);

  const handleFlashcard = async (e) => {
    e.preventDefault();
    const form = e.target;
    const subject = form.subject.value;
    const content = form.content.value;
    const flashData = {
      subject,
      content,
      completed: false,
    };
    const result = await api.post("/flashcard", flashData);
    if (result.data.insertedId) {
      setShowModal(false);
      setRefetch(refetch + 1);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Flashcard added successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to add flashcard.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-8">
      <div className="py-6 sm:py-10">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg tracking-wide">
         Flash Cards
        </h1>
      </div>

      <div className="bg-gradient-to-br from-[#23272f] via-[#334756] to-[#4c22d5] p-2 sm:p-4 rounded-2xl shadow-2xl border-2 border-[#4c22d5]">
        <div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-lg font-bold text-white text-center sm:text-left">
              Manage your notes and flashcards for each subject or topic.
            </div>
            <button
              className="bg-green-500 text-white py-2 px-6 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-colors border-2 border-green-400 focus:ring-2 focus:ring-green-400"
              onClick={() => setShowModal(true)}
            >
              Add Flashcard
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
        {cards.map((card, idx) => {
          // ...existing card logic...
          const cardId = card._id || idx;
          const isFlipped = flippedCards[cardId] || false;
          const handleDelete = async (e) => {
            e.stopPropagation();
            const resDelete = await api.delete(`/flashcard/${cardId}`);
            if (resDelete.data.deletedCount) {
              setRefetch(refetch - 1);
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Flashcard deleted!",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
            } else {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to delete flashcard.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
            }
          };
          const handleComplete = async (e) => {
            e.stopPropagation();
            const resComplete = await api.patch(`/flashcard/${cardId}`);
            if (resComplete.data.matchedCount) {
              setRefetch(refetch - 1);
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Marked as completed!",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
            } else {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to mark as completed.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
            }
          };
          return (
            <div
              key={cardId}
              className={`flip-card cursor-pointer w-full h-64 mx-auto my-6 sm:my-8 ${
                card.completed
                  ? "border-2 border-green-500 rounded-xl shadow-lg"
                  : "border-2 border-[#4c22d5] rounded-xl shadow-lg"
              } hover:scale-105 transition-transform duration-300`}
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
                  className="flip-card-front absolute w-full h-full bg-gradient-to-br from-[#181a20] via-[#334756] to-[#4c22d5] rounded-xl flex flex-col items-center justify-center text-white shadow-lg"
                  style={{ backfaceVisibility: "hidden" }}
                  onClick={() =>
                    setFlippedCards((prev) => ({
                      ...prev,
                      [cardId]: !prev[cardId],
                    }))
                  }
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center break-words drop-shadow-lg">
                      {card.subject}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6 sm:mt-10 justify-center">
                    <button
                      className="px-3 py-1 rounded bg-[#e64524] text-white font-bold hover:bg-[#c53b1f] shadow focus:ring-2 focus:ring-red-400"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-[#22c55e] text-white font-bold hover:bg-[#16a34a] shadow focus:ring-2 focus:ring-green-400"
                      onClick={handleComplete}
                    >
                      Complete
                    </button>
                  </div>
                </div>
                <div
                  className="flip-card-back absolute w-full h-full bg-gradient-to-br from-[#23272f] via-[#334756] to-[#4c22d5] rounded-xl flex flex-col items-center justify-center text-white shadow-lg"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  onClick={() =>
                    setFlippedCards((prev) => ({
                      ...prev,
                      [cardId]: !prev[cardId],
                    }))
                  }
                >
                  <p className="font-bold text-center break-words px-2 text-lg sm:text-xl drop-shadow-lg">
                    {card.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-2 animate-fadeIn">
          <div className="bg-gradient-to-br from-[#23272f] via-[#334756] to-[#4c22d5] p-4 sm:p-8 rounded-2xl shadow-2xl border-2 border-[#4c22d5] w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              Add New Flashcard
            </h2>
            <form onSubmit={handleFlashcard} className="space-y-4">
              <input
                name="subject"
                type="text"
                placeholder="Subject / Topic"
                className="p-3 rounded-xl bg-[#181a20] text-white border-2 border-[#3b424f] focus:border-[#4c22d5] w-full focus:ring-2 focus:ring-[#4c22d5]"
              />
              <textarea
                name="content"
                placeholder="Note content"
                className="p-3 rounded-xl bg-[#181a20] text-white border-2 border-[#3b424f] focus:border-[#4c22d5] w-full focus:ring-2 focus:ring-[#4c22d5]"
              />

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  className="bg-[#e64524] text-white py-2 px-6 rounded-xl font-bold hover:bg-[#9d2e18] shadow focus:ring-2 focus:ring-red-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-6 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-colors border-2 border-green-400 focus:ring-2 focus:ring-green-400"
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
