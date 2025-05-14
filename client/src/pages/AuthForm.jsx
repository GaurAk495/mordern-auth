import { useState } from "react";
import { Mail, Lock, User, RotateCcw } from "lucide-react";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);

  const toggleForm = () => {
    setIsReset(false);
    setIsLogin(!isLogin);
  };

  const toggleReset = () => {
    setIsReset(true);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const formMap = new FormData(e.target);
    const formObj = Object.fromEntries(formMap);
    console.log(formObj);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isReset
            ? "Reset Your Password"
            : isLogin
            ? "Login to your account"
            : "Create a new account"}
        </h2>

        <form className="space-y-5" onSubmit={handleOnSubmit}>
          {!isLogin && !isReset && (
            <div className="flex items-center border border-white/30 bg-white/10 rounded-lg px-3 py-2">
              <User className="w-5 h-5 text-white mr-2" />
              <input
                type="text"
                placeholder="Full Name"
                className="bg-transparent w-full outline-none placeholder-white"
                name="fullName"
              />
            </div>
          )}

          <div className="flex items-center border border-white/30 bg-white/10 rounded-lg px-3 py-2">
            <Mail className="w-5 h-5 text-white/70 mr-2" />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="bg-transparent w-full outline-none placeholder-white"
            />
          </div>

          {!isReset && (
            <div className="flex items-center border border-white/30 bg-white/10 rounded-lg px-3 py-2">
              <Lock className="w-5 h-5 text-white/70 mr-2" />
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="bg-transparent w-full outline-none placeholder-white"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
          >
            {isReset ? "Send Reset Link" : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Extra Links */}
        {!isReset && (
          <div className="mt-4 text-sm flex justify-between">
            <button
              onClick={toggleReset}
              className="text-white hover:underline flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Forgot Password?
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-white">
          {isReset ? (
            <button
              onClick={() => setIsReset(false)}
              className="hover:underline"
            >
              Back to {isLogin ? "Login" : "Signup"}
            </button>
          ) : (
            <>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={toggleForm}
                className="text-white hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
