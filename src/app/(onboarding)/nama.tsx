import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { IconMark } from '@/components/ui/icon-mark';
import { TextField } from '@/components/ui/text-field';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function Nickname() {
  const { t } = useTranslation();
  const nickname = useOnboardingStore((s) => s.nickname);
  const setNickname = useOnboardingStore((s) => s.setNickname);

  const next = (value: string) => {
    setNickname(value.trim());
    router.push('/dompet');
  };

  return (
    <Screen pageTitle={t('NICKNAME.PAGE_TITLE')} bottomInset className="pb-[30px]">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <BackButton />
        <View className="mt-3.5">
          <IconMark name="user" />
        </View>
        <Text className="mb-1.5 mt-[26px] font-display text-[25px] leading-[30px] text-text">
          {t('NICKNAME.TITLE')}
        </Text>
        <Text className="mb-5 text-sm leading-[21px] text-muted">{t('NICKNAME.SUBTITLE')}</Text>
        <TextField
          label={t('NICKNAME.LABEL')}
          placeholder={t('NICKNAME.PLACEHOLDER')}
          value={nickname}
          onChangeText={setNickname}
          maxLength={24}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => next(nickname)}
        />
        <View className="mt-auto">
          <Button label={t('NICKNAME.NEXT')} onPress={() => next(nickname)} />
          <Button
            variant="link"
            label={t('NICKNAME.SKIP')}
            className="mt-2.5"
            onPress={() => next('')}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
