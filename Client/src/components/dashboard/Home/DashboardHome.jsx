import React from "react";
import { Link } from "react-router";
import {
  FaClipboardList,
  FaMoneyCheckAlt,
  FaBookOpen,
  FaRegLightbulb,
  FaRegCalendarAlt,
  FaRegStickyNote,
} from "react-icons/fa";

const features = [
  {
    title: "Class Scheduler",
    description: "Organize your classes and schedule with ease.",
    link: "/class-scheduler/saturday",
    icon: <FaRegCalendarAlt className="text-3xl text-[#4c22d5]" />,
    color: "bg-gradient-to-br from-[#23272f] to-[#181a20]",
  },
  {
    title: "Budget Tracker",
    description: "Track your expenses and manage your budget efficiently.",
    link: "/budget-tracker",
    icon: <FaMoneyCheckAlt className="text-3xl text-[#22c55e]" />,
    color: "bg-gradient-to-br from-[#23272f] to-[#181a20]",
  },
  {
    title: "Exam & Q&A Generator",
    description: "Generate quiz questions and answers for any subject.",
    link: "/QA-generator",
    icon: <FaRegLightbulb className="text-3xl text-[#e64524]" />,
    color: "bg-gradient-to-br from-[#23272f] to-[#181a20]",
  },
  {
    title: "Study Planner",
    description: "Plan your study sessions and stay productive.",
    link: "/study-planner",
    icon: <FaClipboardList className="text-3xl text-[#4c22d5]" />,
    color: "bg-gradient-to-br from-[#23272f] to-[#181a20]",
  },
  {
    title: "Flashcards",
    description: "Create, review, and manage flashcards for fast learning.",
    link: "/flashcards",
    icon: <FaBookOpen className="text-3xl text-[#22c55e]" />,
    color: "bg-gradient-to-br from-[#23272f] to-[#1a1d23]",
  },
  {
    title: "Class Overview",
    description: "Get a quick overview and notes for your classes.",
    link: "/class-scheduler/overview",
    icon: <FaRegStickyNote className="text-3xl text-[#e64524]" />,
    color: "bg-gradient-to-br from-[#23272f] to-[#23272f]",
  },
];

const DashboardHome = () => {
  return (
    <div className="min-h-screen bg-[#181a20] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg tracking-wide">
          FocusHub Dashboard
        </h1>
        <p className="text-lg text-gray-300 text-center mb-10">
          Welcome! Choose a feature below to get started.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <Link
              to={feature.link}
              key={idx}
              className={`block rounded-2xl shadow-xl p-8 transition-transform hover:scale-105 border-2 border-[#4c22d5] ${feature.color}`}
            >
              <div className="flex items-center gap-4 mb-4">
                {feature.icon}
                <span className="text-2xl font-bold text-white">
                  {feature.title}
                </span>
              </div>
              <p className="text-gray-300">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
