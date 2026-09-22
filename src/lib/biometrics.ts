import * as LocalAuthentication from 'expo-local-authentication';

/** Ponsel punya sensor dan sudah ada sidik jari terdaftar. Selalu false di web. */
export async function canUseBiometrics() {
  try {
    return (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
  } catch {
    return false;
  }
}

/**
 * Minta sistem memverifikasi sidik jari. Artamu hanya menerima berhasil atau gagal,
 * tidak pernah data biometriknya. Tanpa jalan pintas ke PIN atau pola layar ponsel,
 * supaya yang tahu kunci layar ponsel tidak otomatis bisa membuka Artamu.
 */
export async function authenticateWithBiometrics(promptMessage: string, cancelLabel: string) {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel,
      disableDeviceFallback: true,
      biometricsSecurityLevel: 'strong',
    });
    return result.success;
  } catch {
    return false;
  }
}
