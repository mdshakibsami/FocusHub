import { NavLink, Outlet } from "react-router";

const BudgetTracker = () => {
    
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Budget Tracker</h2>
      <div className="my-4 flex gap-5  ">
        <NavLink
          className={({ isActive }) =>
            `block px-5 py-1 rounded-lg text-center font-semibold transition-colors shadow-md ${
              isActive
                ? "bg-green-500 text-white"
                : "bg-[#23272F] text-white hover:bg-[#2C394B]"
            }`
          }
          to={"/budget-tracker/overview"}
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
          to={"/budget-tracker/incomes"}
        >
          Incomes
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `block px-5 py-1 rounded-lg text-center font-semibold transition-colors shadow-md ${
              isActive
                ? "bg-green-500 text-white"
                : "bg-[#23272F] text-white hover:bg-[#2C394B]"
            }`
          }
          to={"/budget-tracker/expenses"}
        >
          Expenses
        </NavLink>
      </div>
      <Outlet></Outlet>
    </div>
  );
};

export default BudgetTracker;
