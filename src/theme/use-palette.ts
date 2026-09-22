import { useColorScheme } from 'nativewind';

import { palette } from './tokens';

export function usePalette() {
  const { colorScheme } = useColorScheme();
  return palette[colorScheme === 'dark' ? 'dark' : 'light'];
}
