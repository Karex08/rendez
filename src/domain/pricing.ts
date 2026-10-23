import { CANCELLATION_NOTICE_HOURS, loyaltyTiers, promoCodes } from '../data/salon';

export type PromoResult =
  | { ok: true; code: string; percentOff: number; discountChf: number; totalChf: number }
  | { ok: false; error: string };

export function applyPromo(rawCode: string, priceChf: number): PromoResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: 'Saisis un code.' };
  const promo = promoCodes[code];
  if (!promo) return { ok: false, error: "Ce code n'est pas valide." };
  const discountChf = Math.round(priceChf * promo.percentOff) / 100;
  return { ok: true, code, percentOff: promo.percentOff, discountChf, totalChf: priceChf - discountChf };
}

/** Annulation possible jusqu'à 24 h avant le début. */
export function canCancel(startsAt: Date, now: Date): boolean {
  return startsAt.getTime() - now.getTime() >= CANCELLATION_NOTICE_HOURS * 3_600_000;
}

export function loyaltyProgress(points: number) {
  let currentIndex = 0;
  loyaltyTiers.forEach((tier, i) => {
    if (points >= tier.threshold) currentIndex = i;
  });
  const current = loyaltyTiers[currentIndex];
  const next = loyaltyTiers[currentIndex + 1];
  const ratio = next ? (points - current.threshold) / (next.threshold - current.threshold) : 1;
  return { currentIndex, current, next, ratio: Math.max(0, Math.min(1, ratio)) };
}
