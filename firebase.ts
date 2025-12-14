import * as firebaseApp from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console -> Project Settings -> General
const firebaseConfig = {
  apiKey: "AIzaSyBra9Kn2mpVMbvBBjWft8wM9LdVnsKzADs",
  authDomain: "mpgo-65912.firebaseapp.com",
  projectId: "mpgo-65912",
  storageBucket: "mpgo-65912.firebasestorage.app",
  messagingSenderId: "990141924286",
  appId: "1:990141924286:web:b43d6c59be104e3e2aefef",
  measurementId: "G-40J1GPZM89"
};

// Initialize Firebase
// Using namespace import and getApps check handles potential module resolution issues and prevents duplicate init
const app = firebaseApp.getApps().length > 0 ? firebaseApp.getApp() : firebaseApp.initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);