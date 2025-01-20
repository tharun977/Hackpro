import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, ParentalControls, UserPreferences, PlayerStats } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateParentalControls: (controls: ParentalControls) => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
  updateStats: (stats: Partial<PlayerStats>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user database
interface StoredUser extends User {
  password: string;
}

const USERS_KEY = 'users';
const SESSION_KEY = 'session';

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  theme: 'light',
  notifications: true,
  soundEffects: true,
};

const DEFAULT_PARENTAL_CONTROLS: ParentalControls = {
  dailyPlayTimeLimit: 120, // 2 hours
  isEnabled: false,
  restrictedHours: {
    start: '22:00',
    end: '06:00',
  },
  contentFilter: 'moderate',
};

const DEFAULT_STATS: PlayerStats = {
  totalPlayTime: 0,
  winRate: 0,
  reactionTime: 0,
  skillLevel: 1,
  achievements: [],
  lastActive: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      const sessionUser = JSON.parse(storedSession);
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  const getUsers = (): StoredUser[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const updateStoredUser = (updatedUser: User) => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      saveUsers(users);
      setUser(updatedUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    }
  };

  const signUp = async (email: string, password: string) => {
    const users = getUsers();
    
    if (users.some(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: StoredUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      createdAt: new Date().toISOString(),
      preferences: DEFAULT_PREFERENCES,
      parentalControls: DEFAULT_PARENTAL_CONTROLS,
      stats: DEFAULT_STATS,
    };

    users.push(newUser);
    saveUsers(users);
  };

  const signIn = async (email: string, password: string) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...sessionUser } = user;
    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    const updatedUser = { ...user, ...data };
    updateStoredUser(updatedUser);
  };

  const updateParentalControls = async (controls: ParentalControls) => {
    if (!user) throw new Error('No user logged in');
    const updatedUser = { ...user, parentalControls: controls };
    updateStoredUser(updatedUser);
  };

  const updatePreferences = async (preferences: UserPreferences) => {
    if (!user) throw new Error('No user logged in');
    const updatedUser = { ...user, preferences };
    updateStoredUser(updatedUser);
  };

  const updateStats = async (stats: Partial<PlayerStats>) => {
    if (!user) throw new Error('No user logged in');
    const updatedUser = {
      ...user,
      stats: { ...user.stats, ...stats },
    };
    updateStoredUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
      updateParentalControls,
      updatePreferences,
      updateStats,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}