import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import NotFound from "../components/not-found/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardHome from "../components/dashboard/Home/DashboardHome";
import ClassScheduler from "../components/dashboard/ClassScheduler/ClassScheduler";
import BudgetTracker from "../components/dashboard/BudgetTracker/BudgetTracker";
import EachClass from "../components/dashboard/ClassScheduler/EachClass";
import ClassOverview from "../components/dashboard/ClassScheduler/ClassOverview";
import BudgetDetail from "../components/dashboard/BudgetTracker/BudgetDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        Component: Home,
        children: [
          {
            path: "/",
            Component: DashboardHome,
          },
          {
            path: "class-scheduler",
            Component: ClassScheduler,
            children: [
              {
                index: true,
                Component: ClassOverview,
              },
              {
                path: "overview",
                Component: ClassOverview,
              },
              {
                path: ":day",
                Component: EachClass,
              },
            ],
          },
          {
            path: "budget-tracker/",
            Component: BudgetTracker,
            children: [
              {
                index: true,
                Component: BudgetDetail,
              },
              {
                path: "overview",
                Component: BudgetDetail,
              },
            ],
          },
        ],
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
