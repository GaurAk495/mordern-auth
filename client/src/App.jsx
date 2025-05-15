import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthForm from "./pages/AuthForm";
import ResetPassword from "./pages/Reset-Password";
import VerifyEmail from "./pages/VerifyEmail";
import Navbar from "./components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </div>
  );
}

export default App;
