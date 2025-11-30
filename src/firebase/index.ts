import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getMessaging, type Messaging } from 'firebase/messaging';
import { firebaseConfig } from './config';

// Robust, idempotent Firebase initialization
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Get services directly from the initialized app
const auth: Auth = getAuth(firebaseApp);
const firestore: Firestore = getFirestore(firebaseApp);
let messaging: Messaging | null = null;

// Initialize messaging only on the client side
if (typeof window !== 'undefined') {
  messaging = getMessaging(firebaseApp);
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('✅ Firebase Messaging Service Worker registrado con éxito:', registration);
      })
      .catch((error) => {
        console.error('❌ Error al registrar el Firebase Messaging Service Worker:', error);
      });
  }
}


export { firebaseApp, auth, firestore, messaging };

// Export necessary hooks and providers
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
