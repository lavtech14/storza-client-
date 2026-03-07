// import { useState } from "react";
// import type { ReactNode } from "react";
// import { AuthContext } from "./auth.context";

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [token, setToken] = useState<string | null>(
//     localStorage.getItem("token"),
//   );

//   const login = (newToken: string) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User } from "./auth.context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem("user");
    console.log("Initial user from localStorage:", userStr); // Debug log
    return userStr ? JSON.parse(userStr) : null;
  });

  const login = (newToken: string, userData?: User) => {
    console.log("Login called with:", { newToken, userData }); // Debug log

    localStorage.setItem("token", newToken);
    setToken(newToken);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      console.log("User saved:", userData); // Debug log
    }
  };

  const logout = () => {
    console.log("Logout called"); // Debug log
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  console.log("AuthProvider state:", { token, user }); // Debug log

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
