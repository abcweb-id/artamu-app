import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { usePalette } from '@/theme/use-palette';

type SpendingChartProps = {
  /** Pengeluaran kumulatif per hari bulan ini, sampai hari ini. */
  current: number[];
  /** Pengeluaran kumulatif per hari bulan lalu, penuh. */
  previous: number[];
  label: string;
  onPress?: () => void;
};

const PLOT_HEIGHT = 118;
const DAYS = 31;
const AXIS = ['1', '10', '20', '31'];

/**
 * Garis pengeluaran kumulatif bulan ini (hijau, berarsir) dibanding bulan lalu (putus-putus).
 * Lebar diukur dari layar supaya tebal garis tetap, tidak ikut meregang.
 */
export function SpendingChart({ current, previous, label, onPress }: SpendingChartProps) {
  const c = usePalette();
  const [width, setWidth] = useState(0);
  const h = PLOT_HEIGHT - 8;
  const max = Math.max(current.at(-1) ?? 0, previous.at(-1) ?? 0, 1);
  const x = (day: number) => ((day - 1) / (DAYS - 1)) * width;
  const y = (v: number) => h - (v / max) * h + 4;
  const line = (values: number[]) =>
    values.map((v, i) => `${i ? 'L' : 'M'}${x(i + 1).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const last = current.length;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="mt-1.5 rounded-2xl bg-key px-3.5 pb-[26px] pt-3.5"
    >
      <View style={{ height: PLOT_HEIGHT }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 ? (
          <>
            <Svg width={width} height={PLOT_HEIGHT}>
              <Path
                d={line(previous)}
                fill="none"
                stroke={c.muted}
                strokeWidth={1.6}
                strokeDasharray="4 4"
              />
              <Path
                d={`${line(current)} L${x(last).toFixed(1)} ${h + 4} L0 ${h + 4} Z`}
                fill={c.primary}
                fillOpacity={0.12}
              />
              <Path
                d={line(current)}
                fill="none"
                stroke={c.primary}
                strokeWidth={2.6}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </Svg>
            {/* Titik hari ini, dengan cincin sewarna latar kotak. */}
            <View
              className="absolute h-2.5 w-2.5 rounded-full bg-primary"
              style={{
                left: x(last) - 5,
                top: y(current[last - 1] ?? 0) - 5,
                borderWidth: 0,
                boxShadow: `0 0 0 3px ${c.key}`,
              }}
            />
          </>
        ) : null}
      </View>
      <View className="absolute bottom-2 left-3.5 right-3.5 flex-row justify-between">
        {AXIS.map((d) => (
          <Text key={d} className="text-[11px] text-muted">
            {d}
          </Text>
        ))}
      </View>
    </Pressable>
  );
}
