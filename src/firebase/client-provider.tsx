'use client';

import { createContext, useContext } from 'react';
import { firebaseApp, auth, firestore } from '.';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

const FirebaseContext = createContext<{
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
} | null>(null);

export const FirebaseClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Services are initialized synchronously in `index.ts`
  const services = { app: firebaseApp, auth, firestore };

  return (
    <FirebaseContext.Provider value={services}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error(
      'useFirebaseApp must be used within a FirebaseClientProvider'
    );
  }
  return context.app;
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseClientProvider');
  }
  return context.auth;
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirebaseClientProvider');
  }
  return context.firestore;
};
