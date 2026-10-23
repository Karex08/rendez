import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button, Field, T } from '@/components/ui';
import { colors, fonts, radius, space } from '@/theme/tokens';

export default function ConnexionNumero() {
  const [number, setNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const digits = number.replace(/\D/g, '').replace(/^0/, '');
  const valid = digits.length === 9;

  const submit = () => {
    if (!valid) {
      setError(`Ton numéro doit avoir 9 chiffres après le +41 (tu en as saisi ${digits.length}). Exemple : 79 123 45 67.`);
      return;
    }
    router.push({ pathname: '/connexion/code', params: { phone: `+41${digits}` } });
  };

  return (
    <AuthScreen>
      <T variant="display">Connexion</T>
      <T variant="muted">Saisis ton numéro pour recevoir un code unique par SMS.</T>
      <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.sm }}>
        <View
          accessibilityLabel="Indicatif Suisse +41"
          style={{
            minHeight: 56,
            paddingHorizontal: space.md,
            borderRadius: radius.field,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.sm,
          }}
        >
          <Text style={{ fontSize: 22 }}>🇨🇭</Text>
          <Text style={{ color: colors.text, fontFamily: fonts.body, fontSize: 17 }}>+41</Text>
        </View>
        <Field
          style={{ flex: 1 }}
          value={number}
          onChangeText={(v) => {
            setNumber(v);
            setError(null);
          }}
          placeholder="78 123 45 67"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          accessibilityLabel="Numéro de téléphone"
          returnKeyType="done"
          onSubmitEditing={submit}
          autoFocus
        />
      </View>
      {error ? <T style={{ color: colors.danger }}>{error}</T> : null}
      <Button title="Recevoir mon code" kind={valid ? 'primary' : 'outline'} onPress={submit} style={{ marginTop: space.sm }} />
    </AuthScreen>
  );
}
