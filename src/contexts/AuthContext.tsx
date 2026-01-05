import { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfile {
  name: string;
  email: string;
  imageUrl: string;
}

interface AuthContextType {
  isSignedIn: boolean;
  profile: UserProfile | null;
  signIn: (profile: UserProfile) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const signIn = (userProfile: UserProfile) => {
    setIsSignedIn(true);
    setProfile(userProfile);
  };

  const signOut = () => {
    setIsSignedIn(false);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, profile, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
