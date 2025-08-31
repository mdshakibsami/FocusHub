import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ClassOverview = () => {
  const [dayCount, setDayCount] = useState([]);
  const [completed, setCompleted] = useState([]);
  useEffect(() => {
    (async () => {
      const resultClasses = await api.get("/all-day-count");
      const resultCompleted = await api.get("/completed");
      console.log(resultClasses.data);
      setDayCount(resultClasses.data);
      console.log(resultCompleted.data);
      setCompleted(resultCompleted.data);
    })();
  }, []);

  const allDays = [
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ];

  const allCounts = allDays.map((day) => {
    const found = dayCount.find((d) => d._id === day);
    return { _id: day, count: found ? found.count : 0 };
  });

  console.log(allCounts);

  // Pie chart data and options
  const pieData = {
    labels: allCounts.map(
      (item) => item._id.charAt(0).toUpperCase() + item._id.slice(1)
    ),
    datasets: [
      {
        label: "Classes per Day",
        data: allCounts.map((item) => item.count),
        backgroundColor: [
          "#e64524",
          "#23272f",
          "#FF4C29",
          "#2C394B",
          "#082032",
          "#334756",
          "#5C7AEA",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { size: 16 },
        },
      },
    },
  };

  return (
    <div className="flex flex-col  gap-8 p-4 ">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full  ">
        <div className="bg-[#23272f] shadow-lg rounded-xl p-6 flex flex-col items-center justify-center hover:scale-105 hover:bg-[#e64524] transition-all duration-200">
          <span className="text-3xl text-center font-bold text-white drop-shadow">
            Weekly Class Overview
          </span>
        </div>

        {allCounts.map(({ _id, count }) => (
          <div
            key={_id}
            className="bg-[#23272f] shadow-lg rounded-xl p-6 flex flex-col items-center justify-center hover:scale-105 hover:bg-[#e64524] transition-all duration-200"
          >
            <span className="text-lg font-semibold text-white capitalize mb-2">
              {_id}
            </span>
            <span className="text-4xl font-bold text-white drop-shadow">
              {count}
            </span>
            <span className="text-sm text-indigo-200 mt-2">
              {count === 1 ? "Class" : "Classes"}
            </span>
          </div>
        ))}
      </div>

      {/* Pie Charts Row */}
      <h1 className="my-4  text-3xl font-bold text-center">Visual Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="w-full  flex items-center justify-center">
          <div className="w-full  bg-[#23272f] rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Class Overview (Pie Chart)
            </h2>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 gap-6 ">
          <div className="hover:bg-[#23272f] w-full shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 bg-[#5C7AEA]">
            <span className="text-lg font-semibold text-white mb-2">
              Total Classes
            </span>
            <span className="text-3xl font-bold text-white">
              {completed.size}
            </span>
          </div>
          <div className="hover:bg-[#23272f] w-full shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 bg-[#29c76e]">
            <span className="text-lg font-semibold text-white mb-2">
              Completed Classes
            </span>
            <span className="text-3xl font-bold text-white">
              {completed.completed}
            </span>
          </div>
          <div className="hover:bg-[#23272f] w-full shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 bg-[#FF4C29]">
            <span className="text-lg font-semibold text-white mb-2">
              Pending Classes
            </span>
            <span className="text-3xl font-bold text-white">
              {completed.size - completed.completed}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassOverview;
