import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useEffectEvent, useState } from 'react';
import { create } from 'zustand';

/** Naik setiap kali ada penulisan ke database, supaya semua query dimuat ulang. */
export const useDbVersion = create<{ version: number; bump: () => void }>((set) => ({
  version: 0,
  bump: () => set((s) => ({ version: s.version + 1 })),
}));

/** Panggil setelah menulis ke database. */
export const notifyDbChanged = () => useDbVersion.getState().bump();

/**
 * Jalankan query dan muat ulang saat deps berubah atau database ditulis.
 * data berisi hasil terakhir (tetap tampil selama query baru berjalan, tanpa kedip).
 */
export function useDbQuery<T>(query: (db: SQLiteDatabase) => Promise<T>, deps: unknown[]) {
  const db = useSQLiteContext();
  const version = useDbVersion((s) => s.version);
  const [data, setData] = useState<T | undefined>(undefined);
  const run = useEffectEvent(() => query(db));

  useEffect(() => {
    let active = true;
    run().then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, version, ...deps]);

  return data;
}
