import { Pressable, View } from 'react-native';

type SwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
};

/** Sakelar 46×28: abu-abu saat mati, hijau saat menyala, bulatan putih bergeser. */
export function Switch({ value, onChange, label, disabled }: SwitchProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onChange(!value)}
      hitSlop={8}
      className={`h-7 w-[46px] justify-center rounded-full px-[3px] ${value ? 'bg-primary' : 'bg-line'} ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      <View
        className="h-[22px] w-[22px] rounded-full bg-white"
        style={{ transform: [{ translateX: value ? 18 : 0 }] }}
      />
    </Pressable>
  );
}
