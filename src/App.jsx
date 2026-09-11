import { useState, useEffect } from 'react';
import { auth, googleProvider, firebaseReady } from './firebase/index';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { syncNow } from './firebase/firestore';
import { pruneOrphanedData, migrateSyncMarkers } from './utils/storage';
import { TRANSLATIONS, detectLang } from './i18n/translations';
import HeroJournal from './app/HeroJournal';
import LoginScreen from './app/LoginScreen';
import LoadingScreen from './app/LoadingScreen';
import ErrorBoundary from './app/ErrorBoundary';
import Icon from './shared/icons';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import './styles/global.css';

/* Wynik synchronizacji w jednym zdaniu. Blad pokazujemy DOSLOWNIE — ogolne
   "nie udalo sie" nie pozwala niczego zdiagnozowac. */
function describeSync(T, r) {
  if (r.error) return { text: T.SYNC.error(r.error), bad: true };
  const moved = r.pushed.length + r.pulled.length;
  let text = moved === 0 ? T.SYNC.upToDate : T.SYNC.summary(r.pushed.length, r.pulled.length);
  if (r.keptLocal.length > 0) text += T.SYNC.keptLocal(r.keptLocal.length);
  return { text, bad: false };
}

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser]           = useState(null);
  const [loginLoading, setLogin]  = useState(false);
  const [appKey, setAppKey]       = useState(0);
  const [syncing, setSyncing]     = useState(false);
  const [loadStage, setLoadStage] = useState('auth');
  const [toast, setToast]         = useState(null);

  const T = TRANSLATIONS[detectLang()];

  /* Udany wynik znika sam; blad zostaje, dopoki uzytkownik go nie zamknie. */
  useEffect(() => {
    if (!toast || toast.bad) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!firebaseReady) { pruneOrphanedData(); setAuthReady(true); return; }
    return onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        setLoadStage('sync');
        setSyncing(true);
        /* Migracja ze starego modelu znacznikow MUSI poprzedzac pierwszy sync. */
        migrateSyncMarkers();
        const r = await syncNow(firebaseUser.uid);
        pruneOrphanedData();
        setSyncing(false);
        setUser(firebaseUser);
        setAppKey(k => k + 1);
        if (r.error) setToast(describeSync(T, r));
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });
  }, [T]);

  const handleLogin = async () => {
    setLogin(true);
    try { await signInWithPopup(auth, googleProvider); }
    catch (e) { console.error('Login error:', e); setLogin(false); }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setAppKey(k => k + 1);
  };

  /* Przycisk "Synchronizuj dane" — jedno klikniecie zalatwia oba kierunki. */
  const handleSync = async () => {
    if (!user?.uid) return;
    setToast({ text: T.SYNC.running, bad: false });
    const r = await syncNow(user.uid);
    setToast(describeSync(T, r));
    setAppKey(n => n + 1);
  };

  // Callback wyciągnięty poza JSX — Rolldown (Linux) ma bug z `k => k+1` wewnątrz atrybutu JSX
  const handleReset = () => setAppKey(n => n + 1);
  const dismissToast = () => setToast(null);
  const loadingStage = loadStage;

  if (!authReady || syncing) return <LoadingScreen stage={loadingStage} />;
  if (firebaseReady && !user)  return <LoginScreen onLogin={handleLogin} loading={loginLoading}/>;

  return (
    <Router hook={useHashLocation}>
      <ErrorBoundary onReset={handleReset}>
        {toast && (
          <div style={{
            position:"fixed", bottom:"calc(var(--hj-nav-h,56px) + 0.5rem)", left:"50%",
            transform:"translateX(-50%)", zIndex:600, maxWidth:"92vw",
            background: toast.bad ? "#5a1a1a" : "rgba(30,34,52,0.97)",
            border: `1px solid ${toast.bad ? "#8a3a3a" : "var(--hj-accent-border)"}`,
            color: toast.bad ? "#f0c0c0" : "var(--hj-text)",
            fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.92rem",
            padding:"0.55rem 0.9rem", borderRadius:"var(--radius-md)",
            display:"flex", alignItems:"center", gap:"0.6rem",
            boxShadow:"0 4px 16px rgba(0,0,0,0.5)",
          }}>
            <Icon name="cloud" size="0.95em"/>
            <span>{toast.text}</span>
            <button onClick={dismissToast} aria-label="OK"
              style={{ background:"transparent", border:"none", color:"inherit", cursor:"pointer",
                       padding:"0.25rem", lineHeight:1, flexShrink:0, display:"flex" }}>
              <Icon name="close" size="0.95em"/>
            </button>
          </div>
        )}
        <HeroJournal
          key={appKey}
          user={user}
          onLogout={user ? handleLogout : null}
          onCloudRefresh={user ? handleSync : null}
        />
      </ErrorBoundary>
    </Router>
  );
}
