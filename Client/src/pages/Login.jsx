import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import loginImage from "../assets/auth/login.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password)
      .then((res) => {
        console.log("Login ", res);
        // an alert
        navigate("/");
      })
      .catch((err) => {
        console.log("Error ", err);
        // an alert
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl w-full">
        {/* Image section: above on small, left on md+ */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#2C394B] p-8 order-0 md:order-none">
          <img
            src={loginImage}
            alt="Login"
            className="w-40 h-40 md:w-64 md:h-64 object-contain"
          />
        </div>
        {/* Form section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-[#2C394B] flex flex-col justify-center order-1 md:order-none">
          <h2 className="text-2xl font-semibold text-center mb-6 text-white">
            Login
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 md:gap-8"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-md bg-[#FF4C29] text-white font-medium hover:bg-[#082032] transition-colors text-sm md:text-base"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
