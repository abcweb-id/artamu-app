import { Pressable, Text, type PressableProps } from 'react-native';

type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  /**
   * primary: tombol utama selebar layar. outline: garis tipis, teks hijau.
   * link: teks hijau tanpa latar. secondary dan danger: tombol di lembar bawah (Batal, Hapus).
   */
  variant?: 'primary' | 'outline' | 'link' | 'secondary' | 'danger';
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

  if (variant === 'secondary' || variant === 'danger') {
    const danger = variant === 'danger';
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        className={`items-center rounded-2xl py-[13px] active:opacity-80 ${
          danger ? 'bg-expense' : 'bg-key'
        } ${className ?? ''}`}
        {...rest}
      >
        <Text
          className={`text-[15px] font-semibold leading-[22px] ${danger ? 'text-canvas' : 'text-text'}`}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  if (variant === 'outline') {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        className={`w-full items-center rounded-pill border border-line py-[13px] active:opacity-60 ${
          className ?? ''
        }`}
        {...rest}
      >
        <Text className="text-sm font-medium leading-5 text-primary">{label}</Text>
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
