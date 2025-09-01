import { Outlet } from "react-router";

const BudgetTracker = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Budget Tracker</h2>
      <Outlet></Outlet>
    </div>
  );
};

export default BudgetTracker;
