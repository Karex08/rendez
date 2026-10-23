// Contenu du salon (source : the-barbershop.ch, validé avec Alex — docs/spec-v1.md §5).
// Données figées en v1 ; en v2 elles viendront du serveur via la couche repository.

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = dimanche (Date.getDay)

/** Plage horaire en minutes depuis minuit. */
export type TimeRange = { start: number; end: number };

export type WeeklySchedule = Partial<Record<Weekday, TimeRange>>;

export type Salon = {
  id: string;
  name: string;
  shortName: string;
  street: string;
  postcode: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string;
  phoneDisplay: string;
  email: string;
  hours: WeeklySchedule;
};

export type Barber = {
  id: string;
  name: string;
  schedule: WeeklySchedule;
};

export type ServiceCategory = {
  id: string;
  name: string;
};

export type Service = {
  id: string;
  categoryId: string;
  name: string;
  priceChf: number;
  durationMin: number;
  studentRate?: boolean;
};

const h = (hours: number, minutes = 0) => hours * 60 + minutes;

export const salon: Salon = {
  id: 'vesenaz',
  name: 'The Barbershop Geneva',
  shortName: 'VÉSENAZ',
  street: 'Chem. du Vieux-Vésenaz 31',
  postcode: '1222',
  city: 'Vésenaz',
  country: 'Suisse',
  latitude: 46.23869,
  longitude: 6.19763,
  phone: '+41223218661',
  phoneDisplay: '+41 22 321 86 61',
  email: 'info@the-barbershop.ch',
  hours: {
    1: { start: h(9), end: h(19) },
    2: { start: h(9), end: h(19) },
    3: { start: h(9), end: h(19) },
    4: { start: h(9), end: h(19) },
    5: { start: h(9), end: h(19) },
    6: { start: h(9), end: h(18) },
  },
};

export const barbers: Barber[] = [
  {
    id: 'raul',
    name: 'Raul',
    schedule: {
      2: { start: h(13, 30), end: h(19) },
      3: { start: h(9), end: h(19) },
      4: { start: h(9), end: h(19) },
      5: { start: h(10), end: h(19) },
      6: { start: h(9), end: h(18) },
    },
  },
  {
    id: 'youssef',
    name: 'Youssef',
    schedule: {
      2: { start: h(9), end: h(19) },
      3: { start: h(9), end: h(19) },
      5: { start: h(10), end: h(19) },
      6: { start: h(9), end: h(18) },
    },
  },
  {
    // Planning réel à fournir : horaires du salon en attendant.
    id: 'sophie',
    name: 'Sophie',
    schedule: salon.hours,
  },
];

export const serviceCategories: ServiceCategory[] = [
  { id: 'cheveux', name: 'Cheveux' },
  { id: 'barbe', name: 'Barbe' },
  { id: 'cheveux-barbe', name: 'Cheveux & Barbe' },
  { id: 'etudiants-enfants', name: 'Étudiants, Enfant & Bébé' },
  { id: 'soin', name: 'Soin' },
  { id: 'formule', name: 'Formule' },
];

export const services: Service[] = [
  { id: 'coupe', categoryId: 'cheveux', name: 'Coupe de cheveux', priceChf: 40, durationMin: 30 },
  { id: 'cheveux-rapide', categoryId: 'cheveux', name: 'Cheveux Rapide', priceChf: 40, durationMin: 20 },
  { id: 'coupe-longs', categoryId: 'cheveux', name: 'Coupe de cheveux longs', priceChf: 45, durationMin: 30 },

  { id: 'barbe-tondeuse', categoryId: 'barbe', name: 'Taille de barbe (Tondeuse)', priceChf: 25, durationMin: 30 },
  { id: 'rasage-tondeuse', categoryId: 'barbe', name: 'Rasage complet (Tondeuse)', priceChf: 29, durationMin: 30 },
  { id: 'barbe-courte', categoryId: 'barbe', name: 'Taille de barbe courte', priceChf: 37, durationMin: 30 },
  { id: 'barbe-longue', categoryId: 'barbe', name: 'Taille de barbe longue', priceChf: 37, durationMin: 30 },
  { id: 'rasage-complet', categoryId: 'barbe', name: 'Rasage complet de la barbe', priceChf: 40, durationMin: 30 },

  { id: 'cb-sans-linge', categoryId: 'cheveux-barbe', name: 'Cheveux & Barbe sans linge chaud', priceChf: 55, durationMin: 30 },
  { id: 'cb-rapide', categoryId: 'cheveux-barbe', name: 'Cheveux & Barbe Rapide', priceChf: 70, durationMin: 40 },
  { id: 'cb-linge-soin', categoryId: 'cheveux-barbe', name: 'Cheveux & Barbe avec linge chaud et soin', priceChf: 70, durationMin: 30 },

  { id: 'bebe', categoryId: 'etudiants-enfants', name: 'Coupe de bébé (-1 an)', priceChf: 20, durationMin: 30 },
  { id: 'enfant', categoryId: 'etudiants-enfants', name: 'Coupe enfant (-10 ans)', priceChf: 30, durationMin: 30 },
  { id: 'etudiant-coupe', categoryId: 'etudiants-enfants', name: 'Coupe étudiant (-25 ans)', priceChf: 33, durationMin: 30, studentRate: true },
  { id: 'etudiant-cb-sans-linge', categoryId: 'etudiants-enfants', name: 'Étudiant : Cheveux & Barbe sans linge chaud', priceChf: 50, durationMin: 30, studentRate: true },
  { id: 'etudiant-cb-linge', categoryId: 'etudiants-enfants', name: 'Étudiant : Cheveux & Barbe avec linge chaud', priceChf: 60, durationMin: 30, studentRate: true },

  { id: 'soin-classique', categoryId: 'soin', name: 'Soin classique', priceChf: 25, durationMin: 30 },
  { id: 'soin-massage', categoryId: 'soin', name: 'Soin complet avec massage', priceChf: 30, durationMin: 30 },

  { id: 'papa-fils', categoryId: 'formule', name: 'Formule Papa & Fils', priceChf: 65, durationMin: 60 },
];

/** Réservation possible jusqu'à 90 jours à l'avance. */
export const BOOKING_HORIZON_DAYS = 90;
/** Annulation possible jusqu'à 24 h avant le rendez-vous. */
export const CANCELLATION_NOTICE_HOURS = 24;

export const promoCodes: Record<string, { label: string; percentOff: number }> = {
  BIENVENUE10: { label: 'Bienvenue', percentOff: 10 },
};

export type LoyaltyTier = {
  id: string;
  name: string;
  threshold: number;
  tagline: string;
  perks: { title: string; detail: string }[];
};

// Niveaux PROVISOIRES, à faire valider par le salon (spec §4.5).
export const loyaltyTiers: LoyaltyTier[] = [
  {
    id: 'novice',
    name: 'Novice',
    threshold: 0,
    tagline: 'Niveau de départ',
    perks: [],
  },
  {
    id: 'habitue',
    name: 'Habitué',
    threshold: 100,
    tagline: 'Dès 100 pts',
    perks: [
      { title: '-10% sur les produits', detail: '3 utilisations par an.' },
      { title: 'Bon anniversaire', detail: '10 CHF offerts pendant ton mois anniversaire.' },
    ],
  },
  {
    id: 'connaisseur',
    name: 'Connaisseur',
    threshold: 250,
    tagline: 'Dès 250 pts',
    perks: [
      { title: '-10% sur les produits', detail: '5 utilisations par an.' },
      { title: 'Bon anniversaire', detail: '20 CHF offerts pendant ton mois anniversaire.' },
    ],
  },
  {
    id: 'gentleman',
    name: 'Gentleman',
    threshold: 500,
    tagline: 'Dès 500 pts',
    perks: [
      { title: '-15% sur les produits', detail: '8 utilisations par an.' },
      { title: 'Bon anniversaire', detail: '30 CHF offerts pendant ton mois anniversaire.' },
    ],
  },
  {
    id: 'icone',
    name: 'Icône',
    threshold: 1000,
    tagline: "Dès 1'000 pts",
    perks: [
      { title: '-15% sur les produits', detail: '10 utilisations par an.' },
      { title: 'Bon anniversaire', detail: '45 CHF offerts pendant ton mois anniversaire.' },
    ],
  },
];
