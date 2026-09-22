import { View, type ViewProps } from 'react-native';

/** Kartu permukaan: sudut 20, tanpa bayangan. Kedalaman dari warna latar. */
export function Card({ className, ...rest }: ViewProps) {
  return <View className={`rounded-card bg-surface p-5 ${className ?? ''}`} {...rest} />;
}
