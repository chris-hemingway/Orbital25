import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Check token from localStorage on load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUsername(decoded.username);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    const decoded = jwtDecode(newToken);
    setToken(newToken);
    setUsername(decoded.username);
    setIsGuest(false); // ensure it's a real user not guest
  };

  const loginAsGuest = () => {
    setToken(null);
    setUsername("Guest");
    setIsGuest(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsername(null);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, loginAsGuest, logout, isGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

