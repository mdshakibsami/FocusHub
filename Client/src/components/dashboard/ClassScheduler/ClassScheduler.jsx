import { NavLink, Outlet } from "react-router";

const ClassScheduler = () => {
  return (
    <div className="px-6 py-10">
      <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg tracking-wide">
        Weekly Class Scheduler
      </h1>
      <div className="my-4 flex gap-5  ">
        <NavLink
          className={({ isActive }) =>
            `block px-5 py-1 rounded-lg text-center font-semibold transition-colors shadow-md ${
              isActive
                ? "bg-green-500 text-white"
                : "bg-[#23272F] text-white hover:bg-[#2C394B]"
            }`
          }
          to={"/class-scheduler/overview"}
        >
          Classes Overview
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `block px-5 py-1 rounded-lg text-center font-semibold transition-colors shadow-md ${
              isActive
                ? "bg-green-500 text-white"
                : "bg-[#23272F] text-white hover:bg-[#2C394B]"
            }`
          }
          to={"/class-scheduler/saturday"}
        >
          Weekly Classes
        </NavLink>
      </div>
      <Outlet></Outlet>
    </div>
  );
};

export default ClassScheduler;
