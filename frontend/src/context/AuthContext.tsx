import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken, fetchApi } from '../lib/api';

export interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  contact?: string;
  profileImageUrl?: string;
  roles?: string[];
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginUser: (token: string, user?: UserProfile) => void;
  logoutUser: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [user, setUser] = useState<UserProfile | null>(null);

  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await fetchApi('/view-profile');
      setUser(data);
    } catch (e) {
      console.warn('Failed to fetch profile:', e);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token]);

  const loginUser = (newToken: string, userProfile?: UserProfile) => {
    setAuthToken(newToken);
    setToken(newToken);
    if (userProfile) setUser(userProfile);
    else refreshUser();
  };

  const logoutUser = async () => {
    try {
      await fetchApi('/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    removeAuthToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loginUser,
        logoutUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
