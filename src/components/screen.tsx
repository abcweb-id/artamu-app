import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = ViewProps & {
  /** Layar tanpa bottom bar (onboarding, PIN) butuh jarak aman di bawah juga. */
  bottomInset?: boolean;
};

/** Latar dan jarak tepi layar standar: 20 di kiri-kanan. Tanpa bayangan. */
export function Screen({ className, children, bottomInset, ...rest }: ScreenProps) {
  return (
    <SafeAreaView edges={bottomInset ? ['top', 'bottom'] : ['top']} className="flex-1 bg-canvas">
      <View className={`flex-1 px-5 ${className ?? ''}`} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}
