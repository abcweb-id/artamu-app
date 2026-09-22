import { Text, View } from 'react-native';

type SectionLabelProps = {
  children: string;
  /** Bagian pertama tidak memakai garis pemisah di atasnya. */
  first?: boolean;
};

/** Label kelompok berwarna hijau di Pengaturan dan Akun, dengan garis pemisah di atas. */
export function SectionLabel({ children, first }: SectionLabelProps) {
  return (
    <View className={first ? '' : 'mt-[22px] border-t border-line pt-3.5'}>
      <Text className="mb-1 text-[13px] font-medium text-primary">{children}</Text>
    </View>
  );
}
