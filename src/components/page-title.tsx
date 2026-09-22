import { useIsFocused } from 'expo-router';
import Head from 'expo-router/head';

/**
 * Judul tab browser di web: "{nama halaman} - ARTAMU". Layar tab tetap ter-mount saat
 * tidak dilihat, jadi Head hanya dirender di layar yang sedang aktif.
 */
export function PageTitle({ title }: { title: string }) {
  const focused = useIsFocused();
  if (!focused) return null;
  return (
    <Head>
      <title>{`${title} - ARTAMU`}</title>
    </Head>
  );
}
