// DO NOT USE import, service workers do not support it.
// Use importScripts instead.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// This is the config from src/firebase/config.ts
const firebaseConfig = {
  apiKey: "AIzaSyDyzuwWnF29e3uDfAZolx00Xf4pZA-ol5w",
  authDomain: "studio-3220804462-4f87a.firebaseapp.com",
  projectId: "studio-3220804462-4f87a",
  storageBucket: "studio-3220804462-4f87a.appspot.com",
  messagingSenderId: "81912450805",
  appId: "1:81912450805:web:ce5ae7e420bebd9b7affbc",
};

// Initialize the Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Optional: Set a background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/gato.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
