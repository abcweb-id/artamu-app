import { Text } from 'react-native';

import { Screen } from './screen';

/** Layar kerangka sampai fiturnya dikerjakan. */
export function Placeholder({ title }: { title: string }) {
  return (
    <Screen className="pt-6">
      <Text className="font-display text-2xl text-text">{title}</Text>
      <Text className="mt-2 text-muted">Belum dibuat.</Text>
    </Screen>
  );
}
