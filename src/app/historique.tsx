import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PastAppointmentRow } from '@/components/AppointmentCards';
import { ModalHeader, T } from '@/components/ui';
import { pastAppointments, useApp } from '@/store/AppStore';
import { colors, gutter, space } from '@/theme/tokens';

export default function Historique() {
  const { appointments } = useApp();
  const past = pastAppointments(appointments, new Date());
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: gutter, gap: space.md }}>
        <ModalHeader onBack={() => router.back()} />
        <T variant="display">Tes rendez-vous passés</T>
        {past.map((a) => (
          <PastAppointmentRow key={a.id} appointment={a} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
