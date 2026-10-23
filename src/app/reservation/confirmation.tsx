import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { barberName, serviceName } from '@/components/AppointmentCards';
import { SalonLocation } from '@/components/SalonLocation';
import { Button, Card, DetailRow, GoldRule, ModalHeader, T } from '@/components/ui';
import { formatChf, formatRange } from '@/domain/format';
import { useApp } from '@/store/AppStore';
import { colors, gutter, space } from '@/theme/tokens';

export default function Confirmation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const appointment = useApp().appointments.find((a) => a.id === id);
  const close = () => router.navigate('/');
  if (!appointment) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: gutter, gap: space.lg }}>
        <ModalHeader onClose={close} />
        <View style={{ alignItems: 'center', gap: space.md, marginTop: space.lg }}>
          <View
            style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: 34, color: colors.gold }}>✓</Text>
          </View>
          <T variant="display" style={{ textAlign: 'center' }}>Rendez-vous confirmé</T>
        </View>

        <Card bordered>
          <DetailRow label="Barbier" value={barberName(appointment.barberId)} />
          <DetailRow label="Prestation" value={serviceName(appointment.serviceId)} />
          <DetailRow label="Date" value={formatRange(new Date(appointment.startsAt), appointment.durationMin)} />
          <DetailRow label="Prix" value={formatChf(appointment.totalChf)} note="À payer sur place" />
        </Card>

        <GoldRule />
        <SalonLocation appointment={appointment} />
        <Button title="Terminer" onPress={close} style={{ marginTop: space.md }} />
      </ScrollView>
    </SafeAreaView>
  );
}
