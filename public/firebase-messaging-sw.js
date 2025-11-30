// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Reemplaza con tu configuración de Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDyzuwWnF29e3uDfAZolx00Xf4pZA-ol5w",
  authDomain: "studio-3220804462-4f87a.firebaseapp.com",
  projectId: "studio-3220804462-4f87a",
  storageBucket: "studio-3220804462-4f87a.appspot.com",
  messagingSenderId: "81912450805",
  appId: "1:81912450805:web:ce5ae7e420bebd9b7affbc"
});

const messaging = firebase.messaging();

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] 📨 Mensaje recibido en segundo plano:', payload);
  console.log('[SW] 📨 Título:', payload.notification?.title);
  console.log('[SW] 📨 Cuerpo:', payload.notification?.body);
  
  const notificationTitle = payload.notification?.title || 'RavenCode';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una nueva notificación',
    icon: '/favicon.ico', // Usa el favicon como ícono temporal
    tag: 'ravencode-notification',
    requireInteraction: false,
    data: payload.data,
    vibrate: [200, 100, 200], // Vibración en móviles
    timestamp: Date.now()
  };

  console.log('[SW] 📨 Mostrando notificación con opciones:', notificationOptions);
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clic en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Clic en notificación:', event);
  event.notification.close();
  
  // Abrir la app o enfocar una pestaña existente
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('ravencode') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/learn');
      }
    })
  );
});
