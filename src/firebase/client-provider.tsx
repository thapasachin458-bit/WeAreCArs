'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // initializeFirebase() now handles the client-side check and may return null
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  // If services are null (i.e., on the server), we can render a loading state or nothing,
  // but we must not try to pass null services to the provider.
  // The provider expects non-null values.
  if (!firebaseServices) {
    // Render nothing on the server. The client will re-render with the full provider.
    return <>{children}</>;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
