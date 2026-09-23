import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { Icon, type IconName } from './icon';

type ListRowProps = {
  icon: IconName;
  title: string;
  subtitle?: string;
  /** Nilai di kanan, misalnya "1 menit" atau "Bahasa Indonesia". */
  value?: string;
  /** Isi kanan sendiri (sakelar, angka). Menggantikan value dan panah. */
  right?: ReactNode;
  onPress?: () => void;
  /** danger: ikon dan judul merah, untuk tindakan yang menghapus. */
  tone?: 'default' | 'danger';
  /** Panah kanan. Bawaan: tampil kalau baris bisa diketuk. */
  chevron?: boolean;
};

/** Baris daftar di Pengaturan dan Akun: ikon garis, judul, keterangan, nilai, panah. */
export function ListRow({
  icon,
  title,
  subtitle,
  value,
  right,
  onPress,
  tone = 'default',
  chevron = !!onPress,
}: ListRowProps) {
  const c = usePalette();
  const content = (
    <>
      <Icon name={icon} color={tone === 'danger' ? c.expense : c.muted} size={20} />
      <View className="min-w-0 flex-1">
        <Text
          className={`text-[15px] leading-[22px] ${tone === 'danger' ? 'font-medium text-expense' : 'text-text'}`}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-[12.5px] leading-[19px] text-muted">{subtitle}</Text>
        ) : null}
      </View>
      {right ?? (
        <View className="flex-row items-center gap-0.5">
          {value ? <Text className="text-[13px] text-muted">{value}</Text> : null}
          {chevron ? <Icon name="chevR" color={c.muted} size={17} /> : null}
        </View>
      )}
    </>
  );

  const className = 'flex-row items-center gap-4 py-3.5';
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`${className} active:opacity-60`}
    >
      {content}
    </Pressable>
  ) : (
    <View className={className}>{content}</View>
  );
}
