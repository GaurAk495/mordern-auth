import { useState, useRef, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AppContext } from "../components/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function OTPInput() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const { accountVerified, setVerified } = useContext(AppContext);

  useEffect(() => {
    if (accountVerified) {
      navigate("/");
    }
  }, [accountVerified]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (paste.length === 4) {
      const newOtp = paste.split("").slice(0, 4);
      setOtp(newOtp);
      newOtp.forEach((digit, i) => {
        if (inputsRef.current[i]) {
          inputsRef.current[i].value = digit;
        }
      });
      inputsRef.current[3]?.focus();
    }
  };

  const otpSubmmit = async (e) => {
    e.preventDefault();
    const formMap = new FormData(e.target);
    const formObj = Object.fromEntries(formMap);
    const values = Object.values(formObj);
    const otp = values.join("");
    const res = await axios.post(
      import.meta.env.VITE_BACKEND + "auth/verify-email",
      { otp },
      {
        withCredentials: true,
      }
    );
    const { success, message } = res.data;

    if (!success) {
      toast.error(message);
    } else {
      navigate("/");
      toast.success(message);
      setVerified(true);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
        <p className="text-sm text-center mb-6 text-white/80">
          We've sent a 4-digit code to your phone
        </p>

        <form className="space-y-6" onSubmit={otpSubmmit}>
          <div className="flex justify-between">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                name={`inputOTP${i}`}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={i === 0 ? handlePaste : undefined}
                ref={(el) => (inputsRef.current[i] = el)}
                className="w-12 h-12 text-center text-xl rounded-lg bg-white/10 border border-white/30 text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            Verify
          </button>
        </form>
      </div>
    </motion.div>
  );
}
