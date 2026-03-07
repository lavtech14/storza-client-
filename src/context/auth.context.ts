import { createContext } from "react";

export interface User {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  isAdmin?: boolean;
  // Add any other user properties you need
}
// export interface AuthContextType {
//   token: string | null;
//   login: (token: string) => void;
//   logout: () => void;
// }

export interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, userData?: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
