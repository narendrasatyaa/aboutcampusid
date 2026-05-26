import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function initFirebase() {
  if (getApps().length) return;

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  initializeApp(config);
}

export async function signInWithGoogle() {
  initFirebase();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();

  return {
    idToken,
    user: {
      uid: result.user.uid,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    },
  };
}

export function getFirebaseAuth() {
  initFirebase();
  return getAuth();
}

export function getFirebaseFirestore() {
  initFirebase();
  return getFirestore();
}

export default initFirebase;
