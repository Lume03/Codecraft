'use client';

import { FirebaseProvider } from './provider';
import type { FirebaseServices } from './types';
import { initializeFirebase } from '.';

let firebaseServices: FirebaseServices | null = null;

// This provider is a singleton that ensures Firebase is initialized only once.
// It should be used as the root of the client-side app.
export const FirebaseClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (!firebaseServices) {
    firebaseServices = initializeFirebase();
  }

  return <FirebaseProvider>{children}</FirebaseProvider>;
};
