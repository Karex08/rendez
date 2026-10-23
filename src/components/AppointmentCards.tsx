import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { barbers, salon, services } from '../data/salon';
import { formatDayTitle, formatMonthShort, formatTime } from '../domain/format';
import type { Appointment } from '../domain/types';
import { colors, fonts, radius, space } from '../theme/tokens';
import { BarberAvatar, T } from './ui';

export const barberName = (id: string) => barbers.find((b) => b.id === id)?.name ?? '—';
export const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? '—';

/** Carte « Ton prochain rendez-vous » de l'accueil. */
export function NextAppointmentCard({ appointment }: { appointment: Appointment }) {
  const start = new Date(appointment.startsAt);
  const barber = barberName(appointment.barberId);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Prochain rendez-vous le ${formatDayTitle(start)} à ${formatTime(start)} avec ${barber}`}
      onPress={() => router.navigate({ pathname: '/rdv/[id]', params: { id: appointment.id } })}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        padding: space.md,
        backgroundColor: colors.surface,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: colors.goldFaint,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ alignItems: 'center', width: 56 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 40, color: colors.text, lineHeight: 42 }}>{start.getDate()}</Text>
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textMuted }}>{formatMonthShort(start)}</Text>
      </View>
      <BarberAvatar name={barber} size={52} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 22, color: colors.text, letterSpacing: 1 }}>{salon.shortName}</Text>
        <T variant="muted">avec {barber}</T>
        <T style={{ fontFamily: fonts.bodyBold }}>
          {formatDayTitle(start)}, {formatTime(start)}
        </T>
      </View>
    </Pressable>
  );
}

/** Ligne d'un rendez-vous (écran « Mes rendez-vous » et historique de l'accueil). */
export function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const start = new Date(appointment.startsAt);
  const barber = barberName(appointment.barberId);
  const service = serviceName(appointment.serviceId);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${service}, ${formatDayTitle(start)} à ${formatTime(start)}, avec ${barber}`}
      onPress={() => router.navigate({ pathname: '/rdv/[id]', params: { id: appointment.id } })}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        paddingVertical: space.md,
        borderBottomWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View style={{ alignItems: 'center', width: 48 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 32, color: colors.text, lineHeight: 36 }}>{start.getDate()}</Text>
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.textMuted }}>{formatMonthShort(start)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <T style={{ fontFamily: fonts.bodySemiBold }}>{service}</T>
        <T variant="muted" style={{ fontSize: 14 }}>
          {formatDayTitle(start)}, {formatTime(start)} · avec {barber}
        </T>
      </View>
      <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
    </Pressable>
  );
}
