'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider as InternalFirebaseProvider } from '@/firebase/provider';
import { firebaseApp } from '@/lib/config';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return (
    <InternalFirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </InternalFirebaseProvider>
  );
}
