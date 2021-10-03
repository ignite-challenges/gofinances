import React, { createContext, ReactNode, useContext } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const user = {
    id: 'abcd',
    name: 'Tiago Oliveira',
    email: 'suubmundo@gmail.com',
    photo: 'https://avatars.githubusercontent.com/u/37402298?v=4'
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };