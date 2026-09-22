import { SQLiteProvider } from 'expo-sqlite';
import { Component, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { IconMark } from '@/components/ui/icon-mark';

import { DATABASE_NAME, migrateDbIfNeeded } from './client';

type BoundaryProps = { children: ReactNode; fallback: (error: Error) => ReactNode };

class DatabaseErrorBoundary extends Component<BoundaryProps, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    return this.state.error ? this.props.fallback(this.state.error) : this.props.children;
  }
}

/**
 * Membuka database dan menjalankan migrasi. Kalau gagal, tampilkan penjelasan, bukan layar merah.
 * Di web, penyebab paling umum: Artamu terbuka di dua tab. Penyimpanan browser (OPFS) hanya bisa
 * dipegang satu tab, dan tab kedua gagal dengan "Invalid VFS state".
 */
export function DatabaseGate({ children }: { children: ReactNode }) {
  // Ganti key untuk membuka ulang database dari awal.
  const [attempt, setAttempt] = useState(0);
  return (
    <DatabaseErrorBoundary
      key={attempt}
      fallback={(error) => <DatabaseError error={error} onRetry={() => setAttempt((n) => n + 1)} />}
    >
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
        {children}
      </SQLiteProvider>
    </DatabaseErrorBoundary>
  );
}

function DatabaseError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const { t } = useTranslation();
  const web = Platform.OS === 'web';
  if (__DEV__) console.warn('[database]', error);

  return (
    <View className="flex-1 items-center justify-center bg-canvas px-8">
      <IconMark name="warn" tone="danger" />
      <Text className="mb-2 mt-[22px] text-center font-display text-[21px] leading-[26px] text-text">
        {t(web ? 'DB_ERROR.WEB_TITLE' : 'DB_ERROR.TITLE')}
      </Text>
      <Text className="mb-6 text-center text-sm leading-[21px] text-muted">
        {t(web ? 'DB_ERROR.WEB_BODY' : 'DB_ERROR.BODY')}
      </Text>
      <Button
        label={t(web ? 'DB_ERROR.WEB_RETRY' : 'DB_ERROR.RETRY')}
        onPress={web ? () => window.location.reload() : onRetry}
      />
    </View>
  );
}
