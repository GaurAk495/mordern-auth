import { FaArrowRightLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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
      {location.pathname === "/" && (
        <button
          className="px-8 py-2 flex justify-center items-center gap-2 border-2 border-blue-700 rounded-full text-xl bg-blue-700 hover:bg-gradient-to-br hover:from-blue-400 hover:to-blue-500 text-white duration-500 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
          <FaArrowRightLong />
        </button>
      )}
    </nav>
  );
}

export default Navbar;
