import { useState } from 'react';

import { AuthScreen } from '@/components/AuthScreen';
import { Button, Field, T } from '@/components/ui';
import { useApp } from '@/store/AppStore';
import { colors, space } from '@/theme/tokens';

export default function Inscription() {
  const { session, saveProfile } = useApp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!firstName.trim() || !lastName.trim()) return setError('Indique ton prénom et ton nom.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Indique une adresse e-mail valide.');
    await saveProfile({
      phone: session!.phone,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      referralCode: referralCode.trim() || undefined,
    });
  };

  return (
    <AuthScreen>
      <T variant="display">Saisis tes informations</T>
      <Field value={firstName} onChangeText={setFirstName} placeholder="Prénom" textContentType="givenName" autoComplete="given-name" />
      <Field value={lastName} onChangeText={setLastName} placeholder="Nom" textContentType="familyName" autoComplete="family-name" />
      <Field
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
        autoComplete="email"
      />
      <Field value={referralCode} onChangeText={setReferralCode} placeholder="Code de parrainage (optionnel)" autoCapitalize="characters" />
      {error ? <T style={{ color: colors.danger }}>{error}</T> : null}
      <Button title="Créer mon compte" onPress={submit} style={{ marginTop: space.md }} />
    </AuthScreen>
  );
}
