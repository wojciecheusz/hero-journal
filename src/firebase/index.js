import { initializeApp }             from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore }                from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const configured = Object.values(firebaseConfig).every(v => v && !v.startsWith('tu-wklej'));

let app, auth, db, googleProvider;

if (configured) {
  app            = initializeApp(firebaseConfig);
  auth           = getAuth(app);
  db             = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} else {
  console.warn('[HeroJournal] Firebase nie jest skonfigurowany – tryb offline.');
}

export { auth, db, googleProvider };
export const firebaseReady = configured;
