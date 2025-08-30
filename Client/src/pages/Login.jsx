import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import loginImage from "../assets/auth/login.svg";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customError, setCustomError] = useState("");
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  if (user) {
    // return navigate("/")
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password)
      .then(() => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          background: "#23272f",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/");
      })
      .catch((err) => {
        const error = new String(err);
        if (error.includes("auth/invalid-credential")) {
          setCustomError("Email or Password is wrong");
        } else {
          setCustomError("Something is wrong");
        }

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: customError,
          showConfirmButton: false,
          timer: 2000,
        });
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
          <div className="my-2 flex  gap-2 justify-end">
            <h1> Don't have an account ?</h1>
            <Link className="text-blue-500" to={"/register"}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
