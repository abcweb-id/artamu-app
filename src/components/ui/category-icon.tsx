import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

import { categoryColors, type CategoryColor } from '@/theme/tokens';

import { Icon, type IconName } from './icon';

type CategoryIconProps = {
  name: IconName;
  color: CategoryColor;
  /** list: 40 px di baris transaksi. sheet: 48 px di lembar input. */
  variant?: 'list' | 'sheet';
};

/**
 * Ikon kategori di dalam lingkaran berwarna. Satu-satunya tempat bobot fill dipakai.
 * Mode gelap: latar dari warna ikon berkepekatan rendah, ikon memakai nada pastelnya.
 */
export function CategoryIcon({ name, color, variant = 'list' }: CategoryIconProps) {
  const dark = useColorScheme().colorScheme === 'dark';
  const pair = categoryColors[color];
  const size = variant === 'sheet' ? 48 : 40;
  // 55 persen dari diameter, dibulatkan ke angka genap.
  const iconSize = Math.round((size * 0.55) / 2) * 2;

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: dark ? `${pair.fg}33` : pair.bg }}
    >
      <Icon name={name} color={dark ? pair.bg : pair.fg} size={iconSize} weight="fill" />
    </View>
  );
}
