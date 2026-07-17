import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState('');

  const loginAs = (newRole, name = '') => {
    setRole(newRole);
    setUserName(name);
  };

  const logout = () => {
    setRole(null);
    setUserName('');
  };

  return (
    <AuthContext.Provider value={{ role, userName, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}