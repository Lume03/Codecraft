'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { FirebaseServices } from './types';

const FirebaseContext = createContext<FirebaseServices | null>(null);

export const FirebaseProvider = ({
  children,
  services,
}: {
  children: ReactNode;
  services: FirebaseServices;
}) => {
  return (
    <FirebaseContext.Provider value={services}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => useFirebase().firebaseApp;
export const useFirestore = () => useFirebase().firestore;
export const useAuth = () => useFirebase().auth;
