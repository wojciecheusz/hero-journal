import { useState, useEffect } from 'react';
import { auth, googleProvider, firebaseReady } from './firebase/index';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  syncFromCloud, resolveKeepLocal, resolveTakeCloud, forcePushAll, forcePullAll,
} from './firebase/firestore';
import { pruneOrphanedData, migrateSyncMarkers, syncableKeys, isDirty } from './utils/storage';
import { TRANSLATIONS, detectLang } from './i18n/translations';
import HeroJournal from './app/HeroJournal';
import LoginScreen from './app/LoginScreen';
import LoadingScreen from './app/LoadingScreen';
import ErrorBoundary from './app/ErrorBoundary';
import SyncModal from './app/SyncModal';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import './styles/global.css';

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser]           = useState(null);
  const [loginLoading, setLogin]  = useState(false);
  const [appKey, setAppKey]       = useState(0);
  const [syncing, setSyncing]     = useState(false);
  const [loadStage, setLoadStage] = useState('auth');
  const [conflicts, setConflicts] = useState([]);
  const [legacy, setLegacy]       = useState([]);
  const [showSync, setShowSync]   = useState(false);

  const T = TRANSLATIONS[detectLang()];

  useEffect(() => {
    if (!firebaseReady) { pruneOrphanedData(); setAuthReady(true); return; }
    return onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        setLoadStage('sync');
        setSyncing(true);
        /* Migracja ze starego modelu znacznikow MUSI poprzedzac pierwszy sync —
           inaczej `hj_ts_*` z poprzedniej wersji nadal mialyby wplyw na to,
           co zostanie nadpisane. */
        migrateSyncMarkers();
        const r = await syncFromCloud(firebaseUser.uid);
        pruneOrphanedData();
        setConflicts(r.conflicts);
        setLegacy(r.legacy);
        /* Konflikt nigdy nie jest rozstrzygany po cichu — pokazujemy modal. */
        if (r.conflicts.length > 0) setShowSync(true);
        setSyncing(false);
        setUser(firebaseUser);
        setAppKey(k => k + 1);
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });
  }, []);

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

  const handleCloudRefresh = async () => {
    if (!user?.uid) return;
    setLoadStage('sync');
    setSyncing(true);
    const r = await syncFromCloud(user.uid);
    setConflicts(r.conflicts);
    setLegacy(r.legacy);
    setSyncing(false);
    if (r.conflicts.length > 0) setShowSync(true);
    setAppKey(n => n + 1);
  };

  /* Po kazdym rozstrzygnieciu przemontowujemy HeroJournal, zeby odczytal
     localStorage na nowo. */
  const remount = () => setAppKey(n => n + 1);

  const handleKeepLocal = async (keys) => {
    const { failed } = await resolveKeepLocal(user.uid, keys);
    setConflicts(failed);
    remount();
    return failed.length > 0 ? T.SYNC.failed : T.SYNC.pushDone(keys.length);
  };

  const handleTakeCloud = async (keys) => {
    const { applied } = await resolveTakeCloud(user.uid, keys);
    setConflicts(keys.filter(k => !applied.includes(k)));
    remount();
    return T.SYNC.pullDone(applied.length, 0);
  };

  const handleForcePush = async () => {
    const r = await forcePushAll(user.uid);
    setConflicts([]); setLegacy([]);
    remount();
    return r.failed.length > 0 ? T.SYNC.failed : T.SYNC.pushDone(r.pushed);
  };

  const handleForcePull = async () => {
    const r = await forcePullAll(user.uid);
    setConflicts([]); setLegacy([]);
    remount();
    return T.SYNC.pullDone(r.pulled, r.removed);
  };

  // Callback wyciągnięty poza JSX — Rolldown (Linux) ma bug z `k => k+1` wewnątrz atrybutu JSX
  const handleReset = () => setAppKey(n => n + 1);
  const openSyncTools = () => setShowSync(true);
  const closeSyncTools = () => setShowSync(false);
  const loadingStage = loadStage;

  if (!authReady || syncing) return <LoadingScreen stage={loadingStage} />;
  if (firebaseReady && !user)  return <LoginScreen onLogin={handleLogin} loading={loginLoading}/>;

  return (
    <Router hook={useHashLocation}>
      <ErrorBoundary onReset={handleReset}>
        {showSync && (
          <SyncModal
            T={T}
            conflicts={conflicts}
            legacy={legacy}
            dirtyCount={syncableKeys().filter(isDirty).length}
            signedIn={!!user}
            onKeepLocal={handleKeepLocal}
            onTakeCloud={handleTakeCloud}
            onForcePush={handleForcePush}
            onForcePull={handleForcePull}
            onClose={closeSyncTools}
          />
        )}
        <HeroJournal
          key={appKey}
          user={user}
          onLogout={user ? handleLogout : null}
          onCloudRefresh={user ? handleCloudRefresh : null}
          onSyncTools={user ? openSyncTools : null}
        />
      </ErrorBoundary>
    </Router>
  );
}
