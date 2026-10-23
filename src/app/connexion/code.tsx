import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputInstance } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button, T } from '@/components/ui';
import { formatSwissPhone } from '@/domain/format';
import { useApp } from '@/store/AppStore';
import { colors, fonts, radius, space } from '@/theme/tokens';

/** v1 : pas de vrai SMS, le code de test est toujours celui-ci (spec §4.1). */
const TEST_CODE = '123456';

export default function ConnexionCode() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { signIn } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<TextInputInstance>(null);

  const verify = async (value = code) => {
    if (value.length !== 6) return;
    if (value !== TEST_CODE) {
      setError('Code incorrect. Réessaie.');
      return;
    }
    setBusy(true);
    // Le garde de navigation affiche ensuite l'inscription ou l'accueil.
    await signIn(phone);
  };

  return (
    <AuthScreen>
      <T variant="display">Connexion</T>
      <T variant="muted">Saisis le code à 6 chiffres envoyé à</T>
      <T style={{ fontFamily: fonts.bodyBold, fontSize: 18 }}>{formatSwissPhone(phone)}</T>

      <Pressable onPress={() => input.current?.focus()} accessibilityLabel="Code à 6 chiffres">
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          {Array.from({ length: 6 }, (_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                aspectRatio: 0.9,
                borderRadius: radius.field,
                borderWidth: 1,
                borderColor: i === code.length ? colors.gold : colors.border,
                backgroundColor: colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: colors.text, fontFamily: fonts.bodyBold, fontSize: 24 }}>{code[i] ?? ''}</Text>
            </View>
          ))}
        </View>
      </Pressable>
      <TextInput
        ref={input}
        value={code}
        onChangeText={(v) => {
          const next = v.replace(/\D/g, '').slice(0, 6);
          setCode(next);
          setError(null);
          if (next.length === 6) verify(next);
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={6}
        autoFocus
        style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
      />

      {error ? <T style={{ color: colors.danger }}>{error}</T> : null}
      <T variant="muted" style={{ fontSize: 13 }}>
        Mode test : le code est {TEST_CODE}.
      </T>

      <Button title="Vérifier le code" kind={code.length === 6 ? 'primary' : 'disabled'} loading={busy} onPress={() => verify()} />
    </AuthScreen>
  );
}
