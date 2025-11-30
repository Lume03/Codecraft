import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export interface MessagePayload {
  from: string;
  data?: { [key: string]: string };
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
  // Y otros campos que pueda tener el payload
}
