import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentRow } from '@/components/AppointmentCards';
import { ModalHeader, T } from '@/components/ui';
import { pastAppointments, upcomingAppointments, useApp } from '@/store/AppStore';
import { colors, gutter, space } from '@/theme/tokens';

/** « Mes rendez-vous » : à venir puis passés. Une section vide n'est pas affichée. */
export default function MesRendezVous() {
  const { appointments } = useApp();
  const now = new Date();
  const upcoming = upcomingAppointments(appointments, now);
  const past = pastAppointments(appointments, now);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: gutter, gap: space.lg }}>
        <ModalHeader onBack={() => router.back()} />
        <T variant="display">Mes rendez-vous</T>

        {upcoming.length > 0 ? (
          <View>
            <T variant="eyebrow">À venir</T>
            {upcoming.map((a) => (
              <AppointmentRow key={a.id} appointment={a} />
            ))}
          </View>
        ) : null}

        {past.length > 0 ? (
          <View>
            <T variant="eyebrow">Passés</T>
            {past.map((a) => (
              <AppointmentRow key={a.id} appointment={a} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
