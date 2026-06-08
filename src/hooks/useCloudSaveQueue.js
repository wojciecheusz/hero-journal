import { useEffect, useRef, useState } from 'react';
import { setCloudSaveHook, clearCloudSaveHook } from '../utils/storage';
import { cloudSave } from '../firebase/firestore';

/**
 * Kolejkuje zapisy do chmury (debounce 1.5 s per klucz) i zgłasza trwały błąd
 * synchronizacji po 3 nieudanych próbach z rzędu.
 */
export function useCloudSaveQueue(user) {
  const queueRef    = useRef(new Map());
  const errCountRef = useRef(0);
  const [syncFailed, setSyncFailed] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setCloudSaveHook(null); return; }
    const uid   = user.uid;
    const queue = queueRef.current;
    setCloudSaveHook((key, val) => {
      clearTimeout(queue.get(key));
      queue.set(key, setTimeout(() => {
        cloudSave(uid, key, val).catch(e => {
          console.warn('[HJ] cloudSave error:', e.message);
          errCountRef.current += 1;
          if (errCountRef.current >= 3) setSyncFailed(true);
        });
        queue.delete(key);
      }, 1500));
    });
    return () => { clearCloudSaveHook(); queue.forEach(clearTimeout); queue.clear(); };
  }, [user?.uid]);

  const dismissSyncError = () => { setSyncFailed(false); errCountRef.current = 0; };

  return { syncFailed, dismissSyncError };
}
