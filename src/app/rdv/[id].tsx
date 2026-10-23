import { router, useLocalSearchParams } from 'expo-router';
import { ActionSheetIOS, Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { barberName, serviceName } from '@/components/AppointmentCards';
import { SalonLocation } from '@/components/SalonLocation';
import { Button, Card, DetailRow, GoldRule, T } from '@/components/ui';
import { salon } from '@/data/salon';
import { formatChf, formatDayShort, formatTime } from '@/domain/format';
import { canCancel } from '@/domain/pricing';
import { callSalon } from '@/services/device';
import { useApp } from '@/store/AppStore';
import { colors, fonts, gutter, space } from '@/theme/tokens';

export default function DetailRendezVous() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appointments, cancel } = useApp();
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) return null;

  const start = new Date(appointment.startsAt);
  const end = new Date(start.getTime() + appointment.durationMin * 60_000);
  const now = new Date();
  const isPast = start <= now;
  const isCancelled = appointment.status === 'cancelled';

  const doCancel = async () => {
    await cancel(appointment.id);
    router.back();
  };

  const askCancel = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Supprimer le rendez-vous', 'Annuler'], destructiveButtonIndex: 0, cancelButtonIndex: 1 },
        (i) => i === 0 && doCancel(),
      );
    } else {
      Alert.alert('Annuler le rendez-vous ?', undefined, [
        { text: 'Garder', style: 'cancel' },
        { text: 'Supprimer le rendez-vous', style: 'destructive', onPress: doCancel },
      ]);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: gutter, paddingTop: space.xl, gap: space.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <T variant="heading">Ton rendez-vous</T>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button">
          <Text style={{ fontFamily: fonts.label, fontSize: 14, letterSpacing: 2, color: colors.textMuted, textTransform: 'uppercase' }}>Fermer</Text>
        </Pressable>
      </View>

      <Card bordered>
        <T variant="title" style={{ fontSize: 28, marginBottom: space.sm }}>Détails du rendez-vous</T>
        <DetailRow label="Barbier" value={barberName(appointment.barberId)} />
        <DetailRow label="Prestation" value={serviceName(appointment.serviceId)} />
        <DetailRow label="Date" value={`${formatDayShort(start)}, ${formatTime(start)}`} note={`Fin prévue à ${formatTime(end)}`} />
        <DetailRow label="Paiement" value={`Sur place · ${formatChf(appointment.totalChf)}`} />
        {isCancelled ? <DetailRow label="Statut" value="Annulé" /> : null}
        <GoldRule style={{ marginVertical: space.md }} />
        <SalonLocation appointment={appointment} />
        <T variant="muted" style={{ fontSize: 14, marginTop: space.md }}>
          Pour bénéficier du tarif étudiant, présente ta carte à la réception du salon.
        </T>
      </Card>

      {!isPast && !isCancelled ? (
        canCancel(start, now) ? (
          <Button title="Annuler le rendez-vous ?" kind="danger" onPress={askCancel} />
        ) : (
          <View style={{ gap: space.sm }}>
            <T variant="muted" style={{ textAlign: 'center' }}>
              Ton rendez-vous est dans moins de 24 h : contacte le salon pour annuler.
            </T>
            <Button title={`Appeler le ${salon.phoneDisplay}`} kind="outline" onPress={callSalon} />
          </View>
        )
      ) : null}
    </ScrollView>
  );
}
