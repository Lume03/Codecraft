// Import the Firebase app and messaging packages
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyzuwWnF29e3uDfAZolx00Xf4pZA-ol5w",
  authDomain: "studio-3220804462-4f87a.firebaseapp.com",
  projectId: "studio-3220804462-4f87a",
  storageBucket: "studio-3220804462-4f87a.appspot.com",
  messagingSenderId: "81912450805",
  appId: "1:81912450805:web:ce5ae7e420bebd9b7affbc"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle incoming messages when the app is in the background
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  
  // Customize the notification here
  const notificationTitle = payload.notification?.title || 'Nuevo Mensaje';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una nueva notificación de RavenCode',
    icon: payload.notification?.image || '/gato.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event);
  event.notification.close();
  
  // This looks for an open window matching the origin and focuses it.
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then((clientList) => {
    for (const client of clientList) {
      if (client.url === '/' && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow('/learn');
  }));
});
