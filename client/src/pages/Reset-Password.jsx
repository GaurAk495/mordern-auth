import { useState, useRef, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AppContext } from "../components/AppContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";

export default function OTPInput() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { accountVerified, setVerified } = useContext(AppContext);
  const [isOTPfilled, setOTPfilled] = useState(false);

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

  const otpFilled = () => {
    const isOTPfilled = otp.every((otpInput) => Boolean(otpInput) === true);
    console.log(isOTPfilled);
    if (isOTPfilled) {
      setOTPfilled(true);
    } else {
      toast.error("please filled OTP first.");
    }
  };

  const handleOnResetPassword = async (e) => {
    e.preventDefault();
    const inputOtp = otp.join("");
    const res = await axios.post(
      import.meta.env.VITE_BACKEND + "auth/verify-reset-password",
      { email, otp: inputOtp, newPassword },
      {
        withCredentials: true,
      }
    );
    const { success, message } = res.data;

    if (!success) {
      toast.error(message);
    } else {
      toast.success(message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white">
        {isOTPfilled ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
            <p className="text-sm text-center mb-6 text-white/80">
              We've sent a 4-digit code to your phone
            </p>{" "}
          </>
        ) : (
          <h2 className="text-xl font-bold mb-4 text-center">
            Set New Password
          </h2>
        )}

        <form className="space-y-6">
          {!isOTPfilled ? (
            <>
              {" "}
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
                className="w-full bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                onClick={otpFilled}
              >
                Verify
              </button>{" "}
            </>
          ) : (
            <>
              <div className="flex items-center border border-white/30 bg-white/10 rounded-lg px-3 py-2">
                <Lock className="w-5 h-5 text-white/70 mr-2" />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-transparent w-full outline-none placeholder-white"
                />
              </div>
              <div className="flex items-center border border-white/30 bg-white/10 rounded-lg px-3 py-2">
                <Lock className="w-5 h-5 text-white/70 mr-2" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-transparent w-full outline-none placeholder-white"
                />
              </div>
              <input type="hidden" value={email} name="email" />
              <button
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded cursor-pointer"
                onClick={handleOnResetPassword}
              >
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </motion.div>
  );
}
