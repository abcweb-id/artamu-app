import type { IconProps as PhosphorProps } from 'phosphor-react-native';
import { ArrowDownIcon } from 'phosphor-react-native/src/icons/ArrowDown';
import { ArrowDownLeftIcon } from 'phosphor-react-native/src/icons/ArrowDownLeft';
import { ArrowUpIcon } from 'phosphor-react-native/src/icons/ArrowUp';
import { ArrowUpRightIcon } from 'phosphor-react-native/src/icons/ArrowUpRight';
import { ArrowsClockwiseIcon } from 'phosphor-react-native/src/icons/ArrowsClockwise';
import { ArrowsLeftRightIcon } from 'phosphor-react-native/src/icons/ArrowsLeftRight';
import { BackspaceIcon } from 'phosphor-react-native/src/icons/Backspace';
import { BankIcon } from 'phosphor-react-native/src/icons/Bank';
import { BellIcon } from 'phosphor-react-native/src/icons/Bell';
import { CalendarBlankIcon } from 'phosphor-react-native/src/icons/CalendarBlank';
import { CameraIcon } from 'phosphor-react-native/src/icons/Camera';
import { CaretDownIcon } from 'phosphor-react-native/src/icons/CaretDown';
import { CaretLeftIcon } from 'phosphor-react-native/src/icons/CaretLeft';
import { CaretRightIcon } from 'phosphor-react-native/src/icons/CaretRight';
import { ChartBarIcon } from 'phosphor-react-native/src/icons/ChartBar';
import { ChartPieIcon } from 'phosphor-react-native/src/icons/ChartPie';
import { CheckIcon } from 'phosphor-react-native/src/icons/Check';
import { ClockIcon } from 'phosphor-react-native/src/icons/Clock';
import { CloudIcon } from 'phosphor-react-native/src/icons/Cloud';
import { CopyIcon } from 'phosphor-react-native/src/icons/Copy';
import { DeviceMobileIcon } from 'phosphor-react-native/src/icons/DeviceMobile';
import { DotsThreeIcon } from 'phosphor-react-native/src/icons/DotsThree';
import { DownloadSimpleIcon } from 'phosphor-react-native/src/icons/DownloadSimple';
import { DropIcon } from 'phosphor-react-native/src/icons/Drop';
import { EyeIcon } from 'phosphor-react-native/src/icons/Eye';
import { EyeSlashIcon } from 'phosphor-react-native/src/icons/EyeSlash';
import { FingerprintIcon } from 'phosphor-react-native/src/icons/Fingerprint';
import { ForkKnifeIcon } from 'phosphor-react-native/src/icons/ForkKnife';
import { FunnelSimpleIcon } from 'phosphor-react-native/src/icons/FunnelSimple';
import { GiftIcon } from 'phosphor-react-native/src/icons/Gift';
import { GlobeIcon } from 'phosphor-react-native/src/icons/Globe';
import { HouseIcon } from 'phosphor-react-native/src/icons/House';
import { LightningIcon } from 'phosphor-react-native/src/icons/Lightning';
import { ListBulletsIcon } from 'phosphor-react-native/src/icons/ListBullets';
import { LockIcon } from 'phosphor-react-native/src/icons/Lock';
import { MagnifyingGlassIcon } from 'phosphor-react-native/src/icons/MagnifyingGlass';
import { MinusIcon } from 'phosphor-react-native/src/icons/Minus';
import { MoneyIcon } from 'phosphor-react-native/src/icons/Money';
import { MoonIcon } from 'phosphor-react-native/src/icons/Moon';
import { MotorcycleIcon } from 'phosphor-react-native/src/icons/Motorcycle';
import { MusicNotesIcon } from 'phosphor-react-native/src/icons/MusicNotes';
import { PencilSimpleIcon } from 'phosphor-react-native/src/icons/PencilSimple';
import { PlusIcon } from 'phosphor-react-native/src/icons/Plus';
import { PushPinIcon } from 'phosphor-react-native/src/icons/PushPin';
import { ReceiptIcon } from 'phosphor-react-native/src/icons/Receipt';
import { ShoppingBagIcon } from 'phosphor-react-native/src/icons/ShoppingBag';
import { SlidersHorizontalIcon } from 'phosphor-react-native/src/icons/SlidersHorizontal';
import { SquaresFourIcon } from 'phosphor-react-native/src/icons/SquaresFour';
import { StarIcon } from 'phosphor-react-native/src/icons/Star';
import { TagIcon } from 'phosphor-react-native/src/icons/Tag';
import { TrashIcon } from 'phosphor-react-native/src/icons/Trash';
import { UploadSimpleIcon } from 'phosphor-react-native/src/icons/UploadSimple';
import { UserIcon } from 'phosphor-react-native/src/icons/User';
import { WalletIcon } from 'phosphor-react-native/src/icons/Wallet';
import { WarningIcon } from 'phosphor-react-native/src/icons/Warning';
import { WifiHighIcon } from 'phosphor-react-native/src/icons/WifiHigh';
import { XIcon } from 'phosphor-react-native/src/icons/X';

/**
 * Nama ikon mengikuti prototipe (docs/situs-internal/index.html), gambarnya dari Phosphor.
 * Diimpor satu per satu, bukan dari 'phosphor-react-native', supaya ribuan ikon lain
 * tidak ikut masuk bundle.
 */
const icons = {
  home: HouseIcon,
  settings: SlidersHorizontalIcon,
  user: UserIcon,
  plus: PlusIcon,
  chevL: CaretLeftIcon,
  chevR: CaretRightIcon,
  chevD: CaretDownIcon,
  minus: MinusIcon,
  camera: CameraIcon,
  star: StarIcon,
  warn: WarningIcon,
  copy: CopyIcon,
  globe: GlobeIcon,
  filter: FunnelSimpleIcon,
  pin: PushPinIcon,
  grid: SquaresFourIcon,
  pie: ChartPieIcon,
  chart: ChartBarIcon,
  cloud: CloudIcon,
  up: ArrowUpIcon,
  down: ArrowDownIcon,
  eye: EyeIcon,
  eyeoff: EyeSlashIcon,
  bank: BankIcon,
  x: XIcon,
  check: CheckIcon,
  bolt: LightningIcon,
  wifi: WifiHighIcon,
  phone: DeviceMobileIcon,
  music: MusicNotesIcon,
  swap: ArrowsLeftRightIcon,
  repeat: ArrowsClockwiseIcon,
  list: ListBulletsIcon,
  search: MagnifyingGlassIcon,
  inn: ArrowDownLeftIcon,
  out: ArrowUpRightIcon,
  food: ForkKnifeIcon,
  moto: MotorcycleIcon,
  bag: ShoppingBagIcon,
  receipt: ReceiptIcon,
  cash: MoneyIcon,
  dots: DotsThreeIcon,
  calendar: CalendarBlankIcon,
  back: BackspaceIcon,
  finger: FingerprintIcon,
  lock: LockIcon,
  moon: MoonIcon,
  drop: DropIcon,
  download: DownloadSimpleIcon,
  upload: UploadSimpleIcon,
  tag: TagIcon,
  bell: BellIcon,
  wallet: WalletIcon,
  clock: ClockIcon,
  pencil: PencilSimpleIcon,
  trash: TrashIcon,
  gift: GiftIcon,
} as const;

export type IconName = keyof typeof icons;

export type IconProps = Omit<PhosphorProps, 'color'> & {
  name: IconName;
  color: string;
};

/** Bawaan 24 px untuk aksi dan tab. Pedoman: 20 daftar, 22 kategori, 32+ lembar dan kepala layar. */
export function Icon({ name, size = 24, weight = 'regular', ...rest }: IconProps) {
  const Glyph = icons[name];
  return <Glyph size={size} weight={weight} {...rest} />;
}
