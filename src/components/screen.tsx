import { View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageTitle } from './page-title';

type ScreenProps = ViewProps & {
  /** Nama halaman untuk judul tab browser di web. */
  pageTitle: string;
  /** Layar tanpa bottom bar (onboarding, PIN) butuh jarak aman di bawah juga. */
  bottomInset?: boolean;
};

/** Latar dan jarak tepi layar standar: 6 di bawah status bar, 20 di kiri-kanan. Tanpa bayangan. */
export function Screen({ className, children, pageTitle, bottomInset, ...rest }: ScreenProps) {
  return (
    <SafeAreaView edges={bottomInset ? ['top', 'bottom'] : ['top']} className="flex-1 bg-canvas">
      <PageTitle title={pageTitle} />
      <View className={`flex-1 px-5 pt-1.5 ${className ?? ''}`} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}
