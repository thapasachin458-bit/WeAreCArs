
'use client';

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, app, db } from '@/lib/firebase';
import { AuthContext } from '@/hooks/use-auth';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

export interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

export const FirebaseContext = React.createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
    const [firebaseInstances, setFirebaseInstances] = useState<FirebaseContextType>({ app: null, auth: null, db: null });

    useEffect(() => {
        if (app && auth && db) {
            setFirebaseInstances({ app, auth, db });
        }
    }, []);

    return (
        <FirebaseContext.Provider value={firebaseInstances}>
            {children}
        </FirebaseContext.Provider>
    );
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { auth } = React.useContext(FirebaseContext);


  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
