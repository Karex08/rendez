// Calendrier du mois pour sauter à une date (bandeau « Octobre 2026 · Jeu. 22 »).

import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { formatMonthYear } from '../domain/format';
import { startOfDay } from '../domain/slots';
import { colors, fonts, gutter, radius, space } from '../theme/tokens';

const WEEKDAY_HEADERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export function MonthPicker({
  visible,
  value,
  min,
  max,
  onSelect,
  onClose,
}: {
  visible: boolean;
  value: Date;
  min: Date;
  max: Date;
  onSelect: (day: Date) => void;
  onClose: () => void;
}) {
  const [month, setMonth] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
  const firstWeekday = (month.getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];

  const canPrev = month > new Date(min.getFullYear(), min.getMonth(), 1);
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= max;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: gutter }}>
        <Pressable style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.goldFaint, borderRadius: radius.card, padding: space.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.md }}>
            <Arrow label="‹" disabled={!canPrev} onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} />
            <Text style={{ fontFamily: fonts.display, fontSize: 26, color: colors.text, letterSpacing: 1 }}>{formatMonthYear(month)}</Text>
            <Arrow label="›" disabled={!canNext} onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            {WEEKDAY_HEADERS.map((d, i) => (
              <Text key={i} style={{ flex: 1, textAlign: 'center', color: colors.textFaint, fontFamily: fonts.label, fontSize: 12 }}>
                {d}
              </Text>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: space.sm }}>
            {cells.map((day, i) => {
              if (!day) return <View key={`empty-${i}`} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
              const disabled = day < startOfDay(min) || day > max || day.getDay() === 0;
              const selected = day.getTime() === startOfDay(value).getTime();
              return (
                <Pressable
                  key={day.toISOString()}
                  disabled={disabled}
                  onPress={() => onSelect(day)}
                  accessibilityRole="button"
                  accessibilityState={{ disabled, selected }}
                  style={{ width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selected ? colors.text : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.bodySemiBold,
                        fontSize: 16,
                        color: selected ? colors.background : disabled ? colors.textFaint : colors.text,
                      }}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Arrow({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} hitSlop={12} accessibilityRole="button">
      <Text style={{ fontSize: 28, color: disabled ? colors.textFaint : colors.gold, paddingHorizontal: space.sm }}>{label}</Text>
    </Pressable>
  );
}

