import { Link, useNavigate } from "react-router";
import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    Swal.fire({
      title: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      color: "#fff", // Set text color to white
      background: "#23272f",
      confirmButtonColor: "#e64524",
      cancelButtonColor: "#e64524",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          background: "#23272f",
          title: "Logout successful!",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/login");
      }
    });
  };

  return (
    <div className="py-2 bg-[#e64524] shadow-sm pr-4 sm:px-6">
      <div className="navbar-start">
        <a className="text-2xl hidden md:block font-bold">FocusHub</a>
      </div>

      {user && (
        <div className="navbar-end items-center space-x-5">
          <div>
            <h1 className="font-bold">{user?.displayName}</h1>
          </div>
          <div className="relative">
            <button
              className="avatar avatar-online focus:outline-none"
              onClick={() => setShowLogout((prev) => !prev)}
              aria-label="Profile"
            >
              <div className="w-10 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
              </div>
            </button>
            {showLogout && (
              <div className="absolute right-0 mt-4 px-4 py-2 hover:bg-[#FF4C29]  transition-colors bg-[#23272F] rounded shadow-lg z-50">
                <Link className="block text-white " onClick={handleLogOut}>
                  <div className="flex gap-3 justify-center items-center">
                    <FiLogOut className=" text-white text-xl" />
                    <h1 className="font-bold"> Logout</h1>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
