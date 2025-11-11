import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Inicialización idempotente y robusta de Firebase
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Obtener servicios directamente de la app inicializada
const auth: Auth = getAuth(firebaseApp);
const firestore: Firestore = getFirestore(firebaseApp);

export { firebaseApp, auth, firestore };

// Exportar hooks y providers necesarios
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
