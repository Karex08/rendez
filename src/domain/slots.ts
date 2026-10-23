// Calcul des créneaux en v1, sans serveur (spec §5 « Calcul des créneaux »).

import { barbers, type Barber, type Service, type WeeklySchedule, type Weekday } from '../data/salon';
import type { Appointment } from './types';

export const SLOT_STEP_MIN = 15;
/** Part approximative des tranches de 30 min déjà prises chez un barbier. */
const BUSY_RATIO = 0.35;

export type Slot = {
  /** Minutes depuis minuit. */
  minutes: number;
  /** Barbiers libres sur toute la durée de la prestation. */
  barberIds: string[];
};

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function atMinutes(day: Date, minutes: number): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, minutes);
}

function scheduleFor(schedule: WeeklySchedule, day: Date) {
  return schedule[day.getDay() as Weekday];
}

/** Hash FNV-1a : même entrée → même résultat, pour des créneaux « déjà pris » stables. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) / 0xffffffff;
}

function isSimulatedBusy(barberId: string, day: Date, minutes: number): boolean {
  const block = Math.floor(minutes / 30);
  return hash(`${barberId}|${dateKey(day)}|${block}`) < BUSY_RATIO;
}

function overlapsAppointment(
  barberId: string,
  start: Date,
  durationMin: number,
  appointments: Appointment[],
): boolean {
  const s = start.getTime();
  const e = s + durationMin * 60_000;
  return appointments.some((a) => {
    if (a.status !== 'confirmed' || a.barberId !== barberId) return false;
    const as = new Date(a.startsAt).getTime();
    const ae = as + a.durationMin * 60_000;
    return s < ae && as < e;
  });
}

function barberFreeAt(
  barber: Barber,
  day: Date,
  minutes: number,
  durationMin: number,
  appointments: Appointment[],
): boolean {
  const range = scheduleFor(barber.schedule, day);
  if (!range || minutes < range.start || minutes + durationMin > range.end) return false;
  for (let m = minutes; m < minutes + durationMin; m += SLOT_STEP_MIN) {
    if (isSimulatedBusy(barber.id, day, m)) return false;
  }
  return !overlapsAppointment(barber.id, atMinutes(day, minutes), durationMin, appointments);
}

/**
 * Créneaux d'une journée pour une prestation.
 * `barberId` = null pour « Peu importe » : union des créneaux de tous les barbiers.
 */
export function slotsForDay(
  day: Date,
  service: Service,
  barberId: string | null,
  appointments: Appointment[],
  now: Date,
): Slot[] {
  const candidates = barberId ? barbers.filter((b) => b.id === barberId) : barbers;
  const slots: Slot[] = [];
  for (let m = 0; m < 24 * 60; m += SLOT_STEP_MIN) {
    if (atMinutes(day, m).getTime() <= now.getTime()) continue;
    const free = candidates.filter((b) => barberFreeAt(b, day, m, service.durationMin, appointments));
    if (free.length > 0) slots.push({ minutes: m, barberIds: free.map((b) => b.id) });
  }
  return slots;
}

/** Barbier attribué pour « Peu importe » : le premier libre, dans un ordre stable par créneau. */
export function pickBarber(slot: Slot, day: Date): string {
  const sorted = [...slot.barberIds].sort(
    (a, b) => hash(`${a}|${dateKey(day)}|${slot.minutes}`) - hash(`${b}|${dateKey(day)}|${slot.minutes}`),
  );
  return sorted[0];
}

export function barberWorksOn(barberId: string, day: Date): boolean {
  const barber = barbers.find((b) => b.id === barberId);
  return !!barber && !!scheduleFor(barber.schedule, day);
}
