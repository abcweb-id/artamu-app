import { useState } from 'react';
import { Platform, TextInput, View, type TextInputProps } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { Icon } from './icon';

/** Kolom cari dengan ikon kaca pembesar di kiri. Garis tepi hijau saat aktif. */
export function SearchField({ onFocus, onBlur, ...props }: TextInputProps) {
  const c = usePalette();
  const [focused, setFocused] = useState(false);
  return (
    <View
      className={`flex-1 flex-row items-center gap-2 rounded-xl border bg-surface pl-3 pr-1 ${
        focused ? 'border-primary' : 'border-line'
      }`}
    >
      <Icon name="search" color={c.muted} size={18} />
      <TextInput
        placeholderTextColor={c.muted}
        returnKeyType="search"
        autoCorrect={false}
        className="min-w-0 flex-1 py-[11px] text-sm text-text"
        // Kotak fokus bawaan browser diganti garis tepi hijau di pembungkus.
        style={Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : undefined}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
}
