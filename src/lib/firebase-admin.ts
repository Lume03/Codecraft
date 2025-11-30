import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

// This file is now only for services that MUST use the Admin SDK, like FCM.
// User data management will be handled via MongoDB.

const apps = getApps();
let app: App;
let adminMessaging: Messaging;

if (!apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Vercel escapes newlines, so we need to replace them back
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Faltan variables de entorno para Firebase Admin: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
      );
    }

    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully for Messaging.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // In a real app, you might want to handle this more gracefully
    // For now, we will let the app crash if the admin SDK can't be initialized
    // as it's critical for notifications.
  }
} else {
  app = apps[0];
}

// Initialize messaging only if the app was initialized successfully
if (app) {
    adminMessaging = getMessaging(app);
}


// We no longer export adminDb as Firestore is not the source of truth for user profiles.
// We export adminMessaging but need to handle the case where it might not be initialized.
export { adminMessaging };
