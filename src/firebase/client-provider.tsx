'use client';

import { useEffect, useState } from 'react';
import { FirebaseProvider } from './provider';
import type { FirebaseServices } from './types';
import { initializeFirebase } from '.';

// This provider is a singleton that ensures Firebase is initialized only once on the client.
// It should be used inside the root layout.
export const FirebaseClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [firebaseServices, setFirebaseServices] =
    useState<FirebaseServices | null>(null);

  useEffect(() => {
    // Initialize Firebase on mount and store the services in state.
    // This ensures that `initializeApp` is only called once.
    if (!firebaseServices) {
      setFirebaseServices(initializeFirebase());
    }
  }, [firebaseServices]);

  // Render children only after Firebase has been initialized.
  if (!firebaseServices) {
    return null; // Or a loading indicator
  }

  return (
    <FirebaseProvider services={firebaseServices}>{children}</FirebaseProvider>
  );
};
