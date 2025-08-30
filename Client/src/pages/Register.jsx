import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import registerImage from "../assets/auth/register.svg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { updateUser, user, createUser } = useAuth();

  if (user) {
    // return navigate("/");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(email, password)
      .then(() => {
        return updateUser({ displayName: name });
      })
      .then((res) => {
        console.log("update ", res);
        // an alert
        navigate("/login");
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
            src={registerImage}
            alt="Register"
            className="w-40 h-40 md:w-64 md:h-64 object-contain"
          />
        </div>
        {/* Form section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-[#2C394B] flex flex-col justify-center order-1 md:order-none">
          <h2 className="text-2xl font-semibold text-center mb-6 text-white">
            Register
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 md:gap-8"
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
            />
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
              Register
            </button>
          </form>
          <div className="my-2 flex  gap-2 justify-end">
            <h1>Already have an account ?</h1>
            <Link className="text-blue-500" to={"/login"}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
