import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  measurementId: firebaseConfigJson.measurementId,
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Database ID: either the specific named database or default
export const firestoreDbId = firebaseConfigJson.firestoreDatabaseId || '(default)';

// Initialize Firestore with specific database ID if provided
export const db = firestoreDbId && firestoreDbId !== '(default)'
  ? getFirestore(app, firestoreDbId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
