import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string;
  userCountry: string;
  setIsAuthenticated: (isAuth: boolean) => void;
  setUserId: (id: string | null) => void;
  setUserName: (name: string) => void;
  setUserCountry: (country: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userCountry, setUserCountry] = useState('');

  return (
    <UserContext.Provider value={{ 
      isAuthenticated, 
      userId, 
      userName, 
      userCountry, 
      setIsAuthenticated, 
      setUserId, 
      setUserName, 
      setUserCountry 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
