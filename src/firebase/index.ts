import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import type { FirebaseServices } from './types';

export function initializeFirebase(): FirebaseServices {
  const apps = getApps();
  const firebaseApp = !apps.length
    ? initializeApp(firebaseConfig)
    : apps[0];

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return { firebaseApp, auth, firestore };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
