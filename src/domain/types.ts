export type PaymentMethod = 'sur-place';

export type AppointmentStatus = 'confirmed' | 'cancelled';

export type Appointment = {
  id: string;
  salonId: string;
  barberId: string;
  serviceId: string;
  /** Début du rendez-vous, ISO 8601. */
  startsAt: string;
  durationMin: number;
  priceChf: number;
  promoCode?: string;
  totalChf: number;
  payment: PaymentMethod;
  status: AppointmentStatus;
  createdAt: string;
};

export type Profile = {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode?: string;
};
