import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MonthPicker } from '@/components/MonthPicker';
import { BarberAvatar, Button, ModalHeader, T } from '@/components/ui';
import { barbers, BOOKING_HORIZON_DAYS, salon, services } from '@/data/salon';
import { formatDayCompact, formatDayShort, formatDayTitle, formatMinutes, formatMonthYear } from '@/domain/format';
import { addDays, barberWorksOn, pickBarber, slotsForDay, startOfDay, type Slot } from '@/domain/slots';
import { useApp } from '@/store/AppStore';
import { colors, fonts, gutter, radius, space } from '@/theme/tokens';

const DAYS_SHOWN = 14;
const ANY = 'any';

export default function ChoixCreneau() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const service = services.find((s) => s.id === serviceId)!;
  const { appointments } = useApp();

  const now = useMemo(() => new Date(), []);
  const today = startOfDay(now);
  const lastDay = addDays(today, BOOKING_HORIZON_DAYS);

  const [barberChoice, setBarberChoice] = useState<string>(ANY);
  const [fromDay, setFromDay] = useState(today);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<{ day: Date; slot: Slot } | null>(null);

  const days = useMemo(() => {
    const list: { day: Date; slots: Slot[] }[] = [];
    for (let i = 0; i < DAYS_SHOWN; i++) {
      const day = addDays(fromDay, i);
      if (day > lastDay) break;
      if (day.getDay() === 0) continue; // salon fermé le dimanche
      list.push({ day, slots: slotsForDay(day, service, barberChoice === ANY ? null : barberChoice, appointments, now) });
    }
    return list;
  }, [fromDay, barberChoice, service, appointments, now, lastDay]);

  const chosenBarber = barbers.find((b) => b.id === barberChoice);

  const goNext = () => {
    if (!selected) return;
    const barberId = barberChoice === ANY ? pickBarber(selected.slot, selected.day) : barberChoice;
    const start = new Date(selected.day);
    start.setMinutes(selected.slot.minutes);
    router.push({
      pathname: '/reservation/finaliser',
      params: { serviceId: service.id, barberId, startsAt: start.toISOString() },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={{ paddingHorizontal: gutter }}>
          <ModalHeader onBack={() => router.back()} onClose={() => router.navigate('/')} />
          <T variant="eyebrow" style={{ marginTop: space.lg }}>{salon.shortName}</T>
          <T variant="display">Choisis ton créneau</T>
          <T variant="muted">{service.name}</T>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: gutter, gap: space.sm, paddingVertical: space.lg }}>
          {[{ id: ANY, name: 'Peu importe' }, ...barbers].map((b) => {
            const active = barberChoice === b.id;
            return (
              <Pressable
                key={b.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  setBarberChoice(b.id);
                  setSelected(null);
                }}
                style={{
                  width: 112,
                  height: 136,
                  padding: space.md,
                  borderWidth: active ? 1.5 : 1,
                  borderColor: active ? colors.gold : colors.border,
                  borderRadius: radius.card,
                  backgroundColor: colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: space.sm,
                }}
              >
                {b.id === ANY ? (
                  <View style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: fonts.display, fontSize: 26, color: colors.gold }}>✦</Text>
                  </View>
                ) : (
                  <BarberAvatar name={b.name} />
                )}
                <Text style={{ fontFamily: fonts.bodyBold, color: colors.text, fontSize: 15, textAlign: 'center' }}>{b.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: gutter }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choisir une date"
            onPress={() => setPickerOpen(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 56,
              paddingHorizontal: space.md,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.card,
              backgroundColor: colors.surface,
            }}
          >
            <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.text, letterSpacing: 1 }}>{formatMonthYear(fromDay)}</Text>
            <Text style={{ fontFamily: fonts.bodySemiBold, color: colors.textMuted, fontSize: 16 }}>{formatDayCompact(fromDay)}  ⌄</Text>
          </Pressable>

          {days.map(({ day, slots }) => (
            <View key={day.toISOString()} style={{ marginTop: space.lg, gap: space.sm }}>
              <T variant="heading">{formatDayTitle(day)}</T>
              {slots.length === 0 ? (
                <T variant="muted">
                  {chosenBarber
                    ? barberWorksOn(chosenBarber.id, day)
                      ? `${chosenBarber.name} est complet à cette date.`
                      : `${chosenBarber.name} n'est pas disponible à cette date.`
                    : 'Aucun créneau disponible à cette date.'}
                </T>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
                  {slots.map((slot) => {
                    const isSel = selected?.day.getTime() === day.getTime() && selected.slot.minutes === slot.minutes;
                    return (
                      <Pressable
                        key={slot.minutes}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSel }}
                        accessibilityLabel={`${formatDayTitle(day)} à ${formatMinutes(slot.minutes)}`}
                        onPress={() => setSelected({ day, slot })}
                        style={{
                          width: '31.5%',
                          minHeight: 52,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: isSel ? colors.text : colors.border,
                          borderRadius: radius.card,
                          backgroundColor: isSel ? colors.text : colors.surface,
                        }}
                      >
                        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 17, color: isSel ? colors.background : colors.text }}>
                          {formatMinutes(slot.minutes)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {selected ? (
        <View style={{ position: 'absolute', left: gutter, right: gutter, bottom: space.xl }}>
          <Button title="Continuer" subtitle={`${formatDayShort(selected.day)} à ${formatMinutes(selected.slot.minutes)}`} onPress={goNext} />
        </View>
      ) : null}

      <MonthPicker
        visible={pickerOpen}
        value={fromDay}
        min={today}
        max={lastDay}
        onClose={() => setPickerOpen(false)}
        onSelect={(day) => {
          setFromDay(day);
          setSelected(null);
          setPickerOpen(false);
        }}
      />
    </SafeAreaView>
  );
}
