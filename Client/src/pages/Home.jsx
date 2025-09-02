import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { FiHome, FiUser, FiSettings, FiMenu, FiX } from "react-icons/fi";
import { FaChalkboardTeacher, FaMoneyCheckAlt } from "react-icons/fa";
import { NavLink, Outlet } from "react-router";
import { FcPlanner } from "react-icons/fc";


const Home = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#1d232a] text-white">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar Drawer */}
        {/* Hamburger button for mobile */}
        <button
          className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-[#2C394B] text-white shadow-lg"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu className="text-2xl" />
        </button>
        {/* Overlay and Drawer */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-60 md:hidden"
            onClick={() => setDrawerOpen(false)}
          ></div>
        )}
        <aside
          className={`fixed z-40 inset-y-0 left-0 w-64 bg-[#23272F] text-white transform transition-transform duration-300 md:relative md:translate-x-0 md:w-64 flex flex-col ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close button for mobile */}
          <button
            className="md:hidden p-2 rounded-lg bg-[#FF4C29] text-white"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX className="text-xl" />
          </button>

          <nav className="flex-1 py-6">
            <ul className="space-y-2">
              <li>
                <NavLink
                  to={"/class-scheduler"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 rounded-lg transition-colors hover:bg-[#2C394B]${
                      isActive ? " bg-[#e64524]" : ""
                    }`
                  }
                >
                  <FaChalkboardTeacher className="text-xl" />
                  Class Scheduler
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/budget-tracker"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 rounded-lg transition-colors hover:bg-[#2C394B]${
                      isActive ? " bg-[#e64524]" : ""
                    }`
                  }
                >
                  <FaMoneyCheckAlt className="text-xl" />
                  Budget Tracker
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/study-planner"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 rounded-lg transition-colors hover:bg-[#2C394B]${
                      isActive ? " bg-[#e64524]" : ""
                    }`
                  }
                >
                  <FcPlanner className="text-xl" />
                  Study Planner
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet></Outlet>
        </main>
      </div>
    </div>
  );
};

export default Home;
