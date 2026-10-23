// Formats français écrits à la main : pas de dépendance à l'Intl du moteur JS.

const WEEKDAYS_SHORT = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const MONTHS_LONG = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const pad = (n: number) => String(n).padStart(2, '0');
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** 570 → "09:30" */
export function formatMinutes(minutes: number): string {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

export function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** "mar. 27 oct." */
export function formatDayShort(date: Date): string {
  return `${WEEKDAYS_SHORT[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

/** "Mar. 27 Oct." */
export function formatDayTitle(date: Date): string {
  return `${capitalize(WEEKDAYS_SHORT[date.getDay()])} ${date.getDate()} ${capitalize(MONTHS_SHORT[date.getMonth()])}`;
}

/** "Jeu. 22" */
export function formatDayCompact(date: Date): string {
  return `${capitalize(WEEKDAYS_SHORT[date.getDay()])} ${date.getDate()}`;
}

/** "Octobre 2026" */
export function formatMonthYear(date: Date): string {
  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

/** "Oct." */
export function formatMonthShort(date: Date): string {
  return capitalize(MONTHS_SHORT[date.getMonth()]);
}

/** "mar. 27 oct., 09:30 – 10:00" */
export function formatRange(start: Date, durationMin: number): string {
  const end = new Date(start.getTime() + durationMin * 60_000);
  return `${formatDayShort(start)}, ${formatTime(start)} – ${formatTime(end)}`;
}

/** 35 → "CHF 35.00" */
export function formatChf(amount: number): string {
  return `CHF ${amount.toFixed(2)}`;
}

/** 1000 → "1'000" (séparateur suisse) */
export function formatPoints(points: number): string {
  return String(points).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

/** "+41782480635" → "+41 78 248 06 35" */
export function formatSwissPhone(e164: string): string {
  const digits = e164.replace(/[^\d]/g, '');
  if (digits.startsWith('41') && digits.length === 11) {
    const n = digits.slice(2);
    return `+41 ${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 7)} ${n.slice(7, 9)}`;
  }
  return e164;
}
