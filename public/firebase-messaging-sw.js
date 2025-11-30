// This file must be in the public folder.

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase products
// are not supported in the service worker.
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyzuwWnF29e3uDfAZolx00Xf4pZA-ol5w",
  authDomain: "studio-3220804462-4f87a.firebaseapp.com",
  projectId: "studio-3220804462-4f87a",
  storageBucket: "studio-3220804462-4f87a.appspot.com",
  messagingSenderId: "81912450805",
  appId: "1:81912450805:web:ce5ae7e420bebd9b7affbc",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// If you want to handle push notifications in the background, you can add a
// background message handler here.
// self.addEventListener('push', (event) => {
//   console.log('[firebase-messaging-sw.js] Received push event: ', event);
//   const payload = event.data.json();
//   // ... customize notification logic
// });
