import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

function AppContextProvider({ children }) {
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [accountVerified, setVerified] = useState(false);

  useEffect(() => {
    async function userLogStatus() {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND + "auth/isUserLoggedIn",
          {
            withCredentials: true,
          }
        );
        const { success, message, info, accountVerified } = res.data;
        if (success) {
          setUserLoggedIn(true);
          console.log(message);
          setUserInfo(info);
          setVerified(accountVerified);
        }
      } catch (err) {
        console.error("Login check error:", err.message);
      }
    }

    userLogStatus();
  }, []);

  const value = {
    isUserLoggedIn,
    setUserLoggedIn,
    userInfo,
    setUserInfo,
    setVerified,
    accountVerified,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
