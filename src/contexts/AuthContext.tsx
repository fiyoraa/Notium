import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signIn, signUp, getCurrentUser, signOut } from '../services/auth';
import type { User, AuthState } from '../types/auth';

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const loggedInUser = await signIn(username, password);
    setUser(loggedInUser);
    localStorage.setItem('userId', loggedInUser.id);
  };

  const signup = async (username: string, password: string) => {
    const newUser = await signUp(username, password);
    setUser(newUser);
    localStorage.setItem('userId', newUser.id);
  };

  const logout = () => {
    setUser(null);
    signOut();
  };

  const value: AuthState = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
