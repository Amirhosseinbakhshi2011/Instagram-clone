import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { CURRENT_USER } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  register: (username: string, displayName: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(CURRENT_USER);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await api.getMe();
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.warn('Backend server loading me fallback', err);
      }
    }
    loadUser();
  }, []);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, displayName: string, email: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(username, displayName, email);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const res = await api.updateUserProfile(user.id, updates);
      if (res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
