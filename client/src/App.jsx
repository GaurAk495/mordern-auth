import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthForm from "./pages/AuthForm";
import ResetPassword from "./pages/Reset-Password";
import VerifyEmail from "./pages/VerifyEmail";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
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
