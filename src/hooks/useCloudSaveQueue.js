import { useEffect, useRef, useState } from 'react';
import { setCloudSaveHook, clearCloudSaveHook } from '../utils/storage';
import { cloudSave } from '../firebase/firestore';

/**
 * Kolejkuje zapisy do chmury (debounce 1.5 s per klucz).
 * syncWarning — pierwsze niepowodzenie (żółta ikona chmury w UI).
 * syncFailed  — 3+ kolejnych niepowodzeń (czerwony baner błędu).
 * Licznik resetuje się po każdym udanym zapisie.
 */
export function useCloudSaveQueue(user) {
  const queueRef    = useRef(new Map());
  const errCountRef = useRef(0);
  const [syncWarning, setSyncWarning] = useState(false);
  const [syncFailed,  setSyncFailed]  = useState(false);

  useEffect(() => {
    if (!user?.uid) { setCloudSaveHook(null); return; }
    const uid   = user.uid;
    const queue = queueRef.current;
    setCloudSaveHook((key, val) => {
      clearTimeout(queue.get(key));
      queue.set(key, setTimeout(() => {
        cloudSave(uid, key, val)
          .then(() => {
            errCountRef.current = 0;
            setSyncWarning(false);
            setSyncFailed(false);
          })
          .catch(e => {
            console.warn('[HJ] cloudSave error:', e.message);
            errCountRef.current += 1;
            setSyncWarning(true);
            if (errCountRef.current >= 3) setSyncFailed(true);
          });
        queue.delete(key);
      }, 1500));
    });
    return () => { clearCloudSaveHook(); queue.forEach(clearTimeout); queue.clear(); };
  }, [user?.uid]);

  const dismissSyncError = () => {
    setSyncFailed(false);
    setSyncWarning(false);
    errCountRef.current = 0;
  };

  return { syncWarning, syncFailed, dismissSyncError };
}
