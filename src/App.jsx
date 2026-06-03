import { useState, useEffect } from 'react';
import { auth, googleProvider, firebaseReady } from './firebase/index';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { syncFromCloud } from './firebase/firestore';
import HeroJournal from './app/HeroJournal';
import LoginScreen from './app/LoginScreen';
import LoadingScreen from './app/LoadingScreen';
import ErrorBoundary from './app/ErrorBoundary';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import './styles/global.css';

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser]           = useState(null);
  const [loginLoading, setLogin]  = useState(false);
  const [appKey, setAppKey]       = useState(0);
  const [syncing, setSyncing]     = useState(false);

  useEffect(() => {
    if (!firebaseReady) { setAuthReady(true); return; }
    return onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        setSyncing(true);
        await syncFromCloud(firebaseUser.uid);
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
    setSyncing(true);
    await syncFromCloud(user.uid);
    setSyncing(false);
    setAppKey(k => k + 1);
  };

  if (!authReady || syncing) return <LoadingScreen/>;
  if (firebaseReady && !user)  return <LoginScreen onLogin={handleLogin} loading={loginLoading}/>;

  return (
    <Router hook={useHashLocation}>
      <ErrorBoundary onReset={() => setAppKey(k => k + 1)}>
        <HeroJournal
          key={appKey}
          user={user}
          onLogout={user ? handleLogout : null}
          onCloudRefresh={user ? handleCloudRefresh : null}
        />
      </ErrorBoundary>
    </Router>
  );
}
