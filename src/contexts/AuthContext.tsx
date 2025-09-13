'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthUser, AuthContextType } from '@/lib/types';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { 
  generateMockUser, 
  validateCredentials, 
  validateSignupData, 
  simulateNetworkDelay,
  MOCK_USERS 
} from '@/lib/chatData';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing user session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER);
        if (savedUser) {
          const user = JSON.parse(savedUser) as AuthUser;
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate network delay
      await simulateNetworkDelay();

      // Validate credentials
      if (!validateCredentials(email, password)) {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid email or password' });
        return false;
      }

      // Check if user exists in mock data or create demo user
      const mockUser = MOCK_USERS.find(u => u.email === email);
      let authUser: AuthUser;

      if (mockUser) {
        authUser = {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          avatar: mockUser.avatar,
          isAuthenticated: true
        };
      } else {
        // Create demo user for any valid email/password combination
        const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        authUser = generateMockUser(username, email);
      }

      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));
      
      dispatch({ type: 'SET_USER', payload: authUser });
      return true;

    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Login failed. Please try again.' });
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate network delay
      await simulateNetworkDelay();

      // Validate signup data
      const validation = validateSignupData(username, email, password);
      if (!validation.valid) {
        dispatch({ type: 'SET_ERROR', payload: validation.error || 'Invalid signup data' });
        return false;
      }

      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        dispatch({ type: 'SET_ERROR', payload: 'User with this email already exists' });
        return false;
      }

      // Create new user
      const newUser = generateMockUser(username, email);
      
      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));
      
      dispatch({ type: 'SET_USER', payload: newUser });
      return true;

    } catch (error) {
      console.error('Signup error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Signup failed. Please try again.' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
    dispatch({ type: 'LOGOUT' });
  };

  const contextValue: AuthContextType = {
    user: state.user,
    login,
    signup,
    logout,
    isLoading: state.isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};