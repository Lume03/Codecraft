// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
// "Default" Firebase app (important for initialization)
firebase.initializeApp({
    apiKey: "AIzaSyDyzuwWnF29e3uDfAZolx00Xf4pZA-ol5w",
    authDomain: "studio-3220804462-4f87a.firebaseapp.com",
    projectId: "studio-3220804462-4f87a",
    storageBucket: "studio-3220804462-4f87a.appspot.com",
    messagingSenderId: "81912450805",
    appId: "1:81912450805:web:ce5ae7e420bebd9b7affbc",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/gato.png' // Puedes cambiar esto por el ícono de tu app
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
