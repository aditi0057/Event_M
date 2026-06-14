'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  fullname: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch(`${API_URL}/users/current-user`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false); 
      }
    };

    checkUserSession();
  }, []); 

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    // We will also need an API call to the backend's /logout endpoint here
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

