import { View } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { Icon } from './icon';

/** Kotak centang 22 px. Hanya tampilan; baris pembungkusnya yang menangani sentuhan. */
export function Checkbox({ checked }: { checked: boolean }) {
  const c = usePalette();
  return (
    <View
      className={`h-[22px] w-[22px] items-center justify-center rounded-md border-[1.5px] ${
        checked ? 'border-primary bg-primary' : 'border-muted'
      }`}>
      {checked ? <Icon name="check" color={c['on-primary']} size={15} weight="bold" /> : null}
    </View>
  );
}
