import { FaArrowRightLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    userInfo,
    isUserLoggedIn,
    accountVerified,
    setUserLoggedIn,
    setUserInfo,
    setVerified,
  } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const verifyAccount = async () => {
    setIsOpen(false);
    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND + "auth/verify-email",
        {
          withCredentials: true,
        }
      );
      const { success, message } = res.data;
      console.log(res.data);
      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
        navigate("/verify-email");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong during verification."
      );
      console.error(error);
    }
  };

  const handleLogout = async () => {
    setIsOpen(false);
    const res = await axios.get(import.meta.env.VITE_BACKEND + "auth/logout", {
      withCredentials: true,
    });
    const { success, message } = res.data;
    if (!success) {
      toast.error(message);
    } else {
      toast.success(message);
      setTimeout(() => {
        setUserLoggedIn(false);
        setVerified(false);
        setUserInfo({});
        navigate("/login");
      }, 1000);
    }
  };
  return (
    <nav className="flex items-center justify-between px-20 py-5 fixed top-0 left-0 right-0 z-10">
      {/* Logo */}
      <div
        className="text-xl font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          className="w-15 rounded-full"
          src="/microsoft-authenticator.svg"
          alt="app-logo"
        />{" "}
        <span>Auth</span>
      </div>

      {/* Login Button */}
      {location.pathname === "/" &&
        (isUserLoggedIn ? (
          <div className="relative w-fit" ref={menuRef}>
            <div
              className="w-10 h-10 flex items-center justify-center font-bold rounded-full bg-red-600 text-white cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <p>{userInfo.name.toUpperCase().charAt(0)}</p>
            </div>

            {isOpen && (
              <ul className="flex flex-col bg-white text-black text-sm font-medium rounded-lg shadow-lg absolute right-0 mt-2 min-w-[140px] py-2 z-20">
                {!accountVerified && (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={verifyAccount}
                  >
                    Verify Email
                  </li>
                )}
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        ) : (
          <button
            className="px-8 py-2 flex justify-center items-center gap-2 border-2 border-blue-700 rounded-full text-xl bg-blue-700 hover:bg-gradient-to-br hover:from-blue-400 hover:to-blue-500 text-white duration-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
            <FaArrowRightLong />
          </button>
        ))}
    </nav>
  );
}

export default Navbar;
