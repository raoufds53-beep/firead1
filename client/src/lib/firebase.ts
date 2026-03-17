console.log("ENV CHECK:", import.meta.env);
console.log("API KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const ADMIN_EMAILS = ["admin@firead.com", "admin@example.com"];

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function saveUserToFirestore(uid: string, email: string, role: "user" | "admin") {
  try {
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      role,
      createdAt: new Date().toISOString(),
      location: "",
      isActive: true,
    }, { merge: true });
  } catch (err) {
    console.error("Failed to save user to Firestore:", err);
  }
}

export async function getUserFromFirestore(uid: string) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("Failed to fetch user from Firestore:", err);
    return null;
  }
}
