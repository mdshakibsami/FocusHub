import { NavLink, Outlet } from "react-router";

const daysOfWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const ClassScheduler = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Weekly Class Scheduler
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 mx-auto">
        {daysOfWeek.map((day) => (
          <NavLink
            key={day}
            to={`/class-scheduler/${day.toLowerCase()}`}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-center font-semibold transition-colors shadow-md ${
                isActive
                  ? "bg-[#e64524] text-white"
                  : "bg-[#23272F] text-white hover:bg-[#2C394B]"
              }`
            }
          >
            {day}
          </NavLink>
        ))}
      </div>

      <Outlet></Outlet>
    </div>
  );
};

export default ClassScheduler;
