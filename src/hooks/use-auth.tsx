
'use client';

import React, { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import type { FirebaseContextType } from '@/components/auth-provider';
import { FirebaseContext } from '@/components/auth-provider';


export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useFirebase = (): FirebaseContextType => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
}
