import { Outlet } from "react-router";

const BudgetTracker = () => {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg tracking-wide">
        Budget Tracker
      </h1>
      <Outlet></Outlet>
    </div>
  );
};

export default BudgetTracker;
