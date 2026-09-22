import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { usePalette } from '@/theme/use-palette';

type TextFieldProps = TextInputProps & { label: string };

/** Label kecil di atas kolom isian. */
export function TextField({ label, ...rest }: TextFieldProps) {
  const c = usePalette();
  return (
    <View>
      <Text className="mb-[5px] text-[12.5px] text-muted">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={c.muted}
        className="rounded-xl border border-line bg-surface px-3 py-[13px] text-[15px] text-text"
        {...rest}
      />
    </View>
  );
}
