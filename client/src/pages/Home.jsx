import { useContext } from "react";
import { AppContext } from "../components/AppContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { userInfo, isUserLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen header">
      <div className="bubbles">
        <span></span>
        <span></span>
        <span></span>

        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="flex flex-col items-center justify-center text-center gap-3 w-1/3">
        <img
          className="w-60"
          src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWd0end0enluMWR1bmxhdHlibGRlMjNobXQ4bTR4bGZjZGNzYzRjcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/jY1r8EHyk4Ye9KUOUb/giphy.gif"
          alt="ai-chatbot"
        />
        <h1 className="font-bold text-3xl -mt-5">
          Hey{" "}
          <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent font-bold text-2xl animate-rainbow">
            {isUserLoggedIn ? userInfo.name : "Developer"}
          </span>
        </h1>
        <h2 className="font-bold text-4xl">Welcome To Our App</h2>
        <h3 className="text-xl leading-5 mb-4">
          Lets Start with a quick roduct tour and we will have you up and
          running on in no time.
        </h3>
        <button
          className="px-8 py-2 flex justify-center items-center gap-2 border-2 border-blue-700 rounded-full text-xl bg-blue-700 hover:bg-gradient-to-br hover:from-blue-400 hover:to-blue-500 text-white duration-1000 cursor-pointer z-10"
          onClick={() => {
            navigate("/login");
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
