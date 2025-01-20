export interface User {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  parentalControls?: ParentalControls;
  preferences?: UserPreferences;
  stats?: PlayerStats;
  createdAt: string;
}

export interface ParentalControls {
  dailyPlayTimeLimit: number; // in minutes
  isEnabled: boolean;
  restrictedHours: {
    start: string;
    end: string;
  };
  contentFilter: 'strict' | 'moderate' | 'light';
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  soundEffects: boolean;
}

export interface PlayerStats {
  totalPlayTime: number;
  winRate: number;
  reactionTime: number;
  skillLevel: number;
  achievements: Achievement[];
  lastActive: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  icon: string;
}