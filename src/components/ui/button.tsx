import { Pressable, Text, type PressableProps } from 'react-native';

type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  /** primary: tombol utama selebar layar. link: teks hijau tanpa latar. */
  variant?: 'primary' | 'link';
  className?: string;
};

export function Button({ label, variant = 'primary', className, disabled, ...rest }: ButtonProps) {
  if (variant === 'link') {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        className={`self-center rounded-[10px] px-2.5 py-1.5 active:opacity-60 ${className ?? ''}`}
        {...rest}
      >
        <Text className="text-[13.5px] font-semibold leading-5 text-primary">{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={`w-full items-center rounded-pill bg-primary py-[15px] active:opacity-90 ${
        disabled ? 'opacity-50' : ''
      } ${className ?? ''}`}
      {...rest}
    >
      <Text className="text-[15px] font-medium leading-[22px] text-on-primary">{label}</Text>
    </Pressable>
  );
}
