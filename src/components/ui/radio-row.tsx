import { Pressable, Text, View } from 'react-native';

type RadioRowProps = {
  label: string;
  hint?: string;
  selected: boolean;
  onPress: () => void;
};

/** Pilihan tunggal di lembar bawah: lingkaran radio, label, keterangan. */
export function RadioRow({ label, hint, selected, onPress }: RadioRowProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      className="flex-row items-center gap-3 py-[11px] active:opacity-60"
    >
      <View
        className={`h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] ${
          selected ? 'border-primary' : 'border-muted'
        }`}
      >
        {selected ? <View className="h-3 w-3 rounded-full bg-primary" /> : null}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[14.5px] text-text">{label}</Text>
        {hint ? <Text className="text-[12.5px] text-muted">{hint}</Text> : null}
      </View>
    </Pressable>
  );
}
