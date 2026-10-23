import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentRow, NextAppointmentCard } from '@/components/AppointmentCards';
import { illustrations, salonPhotos } from '@/components/Brand';
import { Button, T, TextLink } from '@/components/ui';
import { salon } from '@/data/salon';
import { pastAppointments, upcomingAppointments, useApp } from '@/store/AppStore';
import { colors, fonts, gutter, radius, space } from '@/theme/tokens';

export default function Accueil() {
  const { profile, appointments } = useApp();
  const now = new Date();
  const upcoming = upcomingAppointments(appointments, now);
  const next = upcoming[0];
  const past = pastAppointments(appointments, now);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: gutter, gap: space.lg }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 40, color: colors.text, letterSpacing: 0.5 }}>
          <Text style={{ color: colors.textMuted }}>Salut, </Text>
          {profile?.firstName}
        </Text>

        {next ? (
          <View style={{ gap: space.sm }}>
            <T variant="eyebrow">Ton prochain rendez-vous</T>
            <NextAppointmentCard appointment={next} />
            {upcoming.length >= 2 ? (
              <TextLink title={`Voir tous mes rendez-vous (${upcoming.length})`} onPress={() => router.push('/rendez-vous')} />
            ) : null}
          </View>
        ) : null}

        <View style={{ borderRadius: radius.card, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
          <View>
            <Image source={salonPhotos.comptoir} style={{ width: '100%', aspectRatio: 1.15 }} contentFit="cover" />
            <View style={{ position: 'absolute', inset: 0, backgroundColor: colors.overlay }} />
          </View>
          <View style={{ padding: space.lg, gap: space.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
              <View style={{ width: 52, height: 52, borderWidth: 1, borderColor: colors.goldFaint, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={illustrations.ciseaux} style={{ width: 30, height: 34 }} contentFit="contain" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.display, fontSize: 26, color: colors.text, letterSpacing: 1 }}>{salon.shortName}</Text>
                <T variant="muted">{salon.street}, {salon.city}</T>
              </View>
            </View>
            <Button title="Réserver" onPress={() => router.push('/reservation')} />
          </View>
        </View>

        {past.length > 0 ? (
          <View style={{ gap: space.xs }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <T variant="eyebrow">Tes derniers rendez-vous</T>
              {past.length > 3 ? <TextLink title="Tout voir" onPress={() => router.push('/rendez-vous')} /> : null}
            </View>
            {past.slice(0, 3).map((a) => (
              <AppointmentRow key={a.id} appointment={a} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
