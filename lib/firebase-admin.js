import admin from 'firebase-admin';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY_RAW;

if (privateKey && privateKey.includes('\\n')) {
  // already contains escaped newlines
} else if (privateKey) {
  // env var may have literal newlines encoded as \n
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  if (!projectId || !clientEmail || !privateKey) {
    // Do not initialize if missing creds; routes that need admin should handle missing config.
    // This allows local dev without service account (you can still use client SDK).
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
}

export async function verifyIdToken(idToken) {
  if (!admin.apps.length) throw new Error('Firebase Admin not initialized. Set service account env vars.');
  return admin.auth().verifyIdToken(idToken);
}

export const firestore = admin.apps.length ? admin.firestore() : null;

export default admin;
