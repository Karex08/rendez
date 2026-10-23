import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Field, T } from '@/components/ui';
import { formatSwissPhone } from '@/domain/format';
import { useApp } from '@/store/AppStore';
import { colors, fonts, gutter, space } from '@/theme/tokens';

export default function Profil() {
  const { profile, saveProfile, signOut } = useApp();
  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [saved, setSaved] = useState(false);
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const save = async () => {
    if (!profile) return;
    await saveProfile({ ...profile, firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
    setSaved(true);
  };

  const confirmSignOut = () =>
    Alert.alert('Se déconnecter ?', 'Tu pourras te reconnecter avec ton numéro.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: signOut },
    ]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: gutter, gap: space.md }} keyboardShouldPersistTaps="handled">
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 1,
              borderColor: colors.gold,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: space.lg,
            }}
          >
            <Text style={{ fontFamily: fonts.display, fontSize: 34, color: colors.gold }}>{initials}</Text>
          </View>
          <T variant="display">Profil</T>
          <T variant="muted" style={{ marginTop: -space.sm }}>Gère tes informations de compte.</T>
          <Field value={firstName} onChangeText={(v) => (setFirstName(v), setSaved(false))} placeholder="Prénom" accessibilityLabel="Prénom" />
          <Field value={lastName} onChangeText={(v) => (setLastName(v), setSaved(false))} placeholder="Nom" accessibilityLabel="Nom" />
          <Field
            value={email}
            onChangeText={(v) => (setEmail(v), setSaved(false))}
            placeholder="E-mail"
            accessibilityLabel="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field value={profile ? formatSwissPhone(profile.phone) : ''} editable={false} accessibilityLabel="Téléphone" style={{ color: colors.textMuted }} />
          <Button title={saved ? 'Enregistré ✓' : 'Enregistrer'} onPress={save} style={{ marginTop: space.md }} />
          <Button title="Se déconnecter" kind="danger" onPress={confirmSignOut} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
