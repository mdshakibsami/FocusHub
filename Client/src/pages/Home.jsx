import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

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
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-[#2C394B] transition-colors"
                >
                  <FiHome className="text-xl" />
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-[#2C394B] transition-colors"
                >
                  <FiUser className="text-xl" />
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-[#2C394B] transition-colors"
                >
                  <FiSettings className="text-xl" />
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 transition-all duration-300">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-3xl font-bold mb-4 text-[#FF4C29]">
              Welcome to FocusHub Dashboard
            </h1>
            <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
              This is your dashboard. Use the sidebar to navigate between
              different sections. The layout is fully responsive and adapts to
              all device sizes.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
