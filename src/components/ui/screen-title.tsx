import { Text } from 'react-native';

/** Judul besar di atas layar menu: Transaksi, Pengaturan, Akun. */
export function ScreenTitle({ children }: { children: string }) {
  return <Text className="mb-[18px] mt-1 font-display text-[25px] text-text">{children}</Text>;
}
