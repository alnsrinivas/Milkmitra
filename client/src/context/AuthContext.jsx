import React, {useState, createContext, useContext, useEffect } from "react";  
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = JSON.parse(atob(storedToken.split(".")[1]));
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({
            role: decoded.user.role,
            id: decoded.user.id,
            username: decoded.user.username,
          });
          setToken(storedToken);
        }
      } catch (e) {
        console.error("Invalid token found in storage.");
        logout();
      }
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    const decoded = JSON.parse(atob(newToken.split(".")[1]));
    setUser({
      role: decoded.user.role,
      id: decoded.user.id,
      username: decoded.user.username,
    });
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
