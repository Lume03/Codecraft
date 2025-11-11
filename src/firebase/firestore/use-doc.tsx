'use client';

import { useState, useEffect } from 'react';
import {
  doc,
  onSnapshot,
  type DocumentData,
  type DocumentReference,
} from 'firebase/firestore';
import { useFirestore } from '../client-provider';

export function useDoc<T = DocumentData>(
  docRef: DocumentReference | string | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !docRef) {
      setLoading(false);
      return;
    }

    const ref = typeof docRef === 'string' ? doc(firestore, docRef) : docRef;

    const unsubscribe = onSnapshot(
      ref,
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef, firestore]);

  return { data, loading, error };
}
