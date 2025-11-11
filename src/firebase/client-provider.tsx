'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import type { FirebaseServices } from './types';
import { initializeFirebase } from '.';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

// Create a context for the Firebase services
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
  const [services, setServices] =
    useState<FirebaseServices | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
       const firebaseServices = initializeFirebase();
       setServices(firebaseServices);
    }
  }, []);

  if (!services) {
    return null; // Or a loading component
  }

  return (
    <FirebaseContext.Provider value={services}>
      {children}
    </FirebaseContext.Provider>
  );
};


export const useFirebaseApp = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebaseApp must be used within a FirebaseClientProvider');
    }
    return context.firebaseApp;
}

export const useAuth = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useAuth must be used within a FirebaseClientProvider');
    }
    return context.auth;
}

export const useFirestore = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirestore must be used within a FirebaseClientProvider');
    }
    return context.firestore;
}
