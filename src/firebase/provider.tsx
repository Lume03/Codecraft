'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { initializeFirebase } from '.';
import type { FirebaseServices } from './types';

const FirebaseContext = createContext<FirebaseServices | null>(null);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // Initialize Firebase on the client
    const firebaseServices = initializeFirebase();
    setServices(firebaseServices);
  }, []);

  // Use a conditional rendering to avoid rendering children until Firebase is initialized.
  if (!services) {
    return null; // Or a loading indicator
  }

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
