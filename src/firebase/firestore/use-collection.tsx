'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  startAt,
  endAt,
  doc,
  getDoc,
  type DocumentData,
  type CollectionReference,
  type Query,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseCollectionOptions {
  where?: [string, any, any][];
  orderBy?: [string, 'asc' | 'desc'];
  limit?: number;
  startAfter?: any;
  endBefore?: any;
  startAt?: any;
  endAt?: any;
}

export function useCollection<T = DocumentData>(
  collectionPath: string | CollectionReference | Query | null,
  options?: UseCollectionOptions
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !collectionPath) {
      setLoading(false);
      return;
    }

    let colQuery: Query;

    if (typeof collectionPath === 'string') {
      let q = collection(firestore, collectionPath) as Query;
      if (options?.where) {
        options.where.forEach((w) => {
          q = query(q, where(w[0], w[1], w[2]));
        });
      }
      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy[0], options.orderBy[1]));
      }
      if (options?.startAt) {
        q = query(q, startAt(options.startAt));
      }
      if (options?.endAt) {
        q = query(q, endAt(options.endAt));
      }
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }
      if (options?.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }
      if (options?.endBefore) {
        q = query(q, endBefore(options.endBefore));
      }
      colQuery = q;
    } else {
      colQuery = collectionPath;
    }

    const unsubscribe = onSnapshot(
      colQuery,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath, firestore, options]);

  return { data, loading, error };
}
