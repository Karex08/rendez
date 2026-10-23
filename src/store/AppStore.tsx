// État de l'app (profil + rendez-vous), persisté sur le téléphone en v1.
// Les écrans ne parlent qu'à ce store : en v2, seul `repository` changera pour appeler le serveur.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { salon } from '../data/salon';
import type { Appointment, Profile } from '../domain/types';
import { repository } from './repository';

type Session = { phone: string } | null;

type AppState = {
  ready: boolean;
  session: Session;
  profile: Profile | null;
  appointments: Appointment[];
  /** Points de fidélité : 0 en v1 (calcul en v2). */
  loyaltyPoints: number;
};

type AppActions = {
  signIn: (phone: string) => Promise<{ needsProfile: boolean }>;
  saveProfile: (profile: Profile) => Promise<void>;
  signOut: () => Promise<void>;
  book: (input: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'salonId'>) => Promise<Appointment>;
  cancel: (id: string) => Promise<void>;
};

const AppContext = createContext<(AppState & AppActions) | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    ready: false,
    session: null,
    profile: null,
    appointments: [],
    loyaltyPoints: 0,
  });

  useEffect(() => {
    (async () => {
      const [session, profile, appointments] = await Promise.all([
        repository.getSession(),
        repository.getProfile(),
        repository.getAppointments(),
      ]);
      setState((s) => ({ ...s, ready: true, session, profile, appointments }));
    })();
  }, []);

  const signIn = useCallback(async (phone: string) => {
    await repository.setSession({ phone });
    const profile = await repository.getProfile();
    const known = profile?.phone === phone ? profile : null;
    setState((s) => ({ ...s, session: { phone }, profile: known }));
    return { needsProfile: !known };
  }, []);

  const saveProfile = useCallback(async (profile: Profile) => {
    await repository.setProfile(profile);
    setState((s) => ({ ...s, profile }));
  }, []);

  const signOut = useCallback(async () => {
    await repository.setSession(null);
    setState((s) => ({ ...s, session: null }));
  }, []);

  const book = useCallback<AppActions['book']>(async (input) => {
    const appointment: Appointment = {
      ...input,
      id: `rdv-${Date.now().toString(36)}`,
      salonId: salon.id,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    const next = await repository.addAppointment(appointment);
    setState((s) => ({ ...s, appointments: next }));
    return appointment;
  }, []);

  const cancel = useCallback(async (id: string) => {
    const next = await repository.cancelAppointment(id);
    setState((s) => ({ ...s, appointments: next }));
  }, []);

  const value = useMemo(
    () => ({ ...state, signIn, saveProfile, signOut, book, cancel }),
    [state, signIn, saveProfile, signOut, book, cancel],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans <AppProvider>');
  return ctx;
}

/** Rendez-vous à venir (hors annulés), du plus proche au plus lointain. */
export function upcomingAppointments(appointments: Appointment[], now: Date): Appointment[] {
  return appointments
    .filter((a) => a.status === 'confirmed' && new Date(a.startsAt).getTime() > now.getTime())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/** Rendez-vous passés (hors annulés), du plus récent au plus ancien. */
export function pastAppointments(appointments: Appointment[], now: Date): Appointment[] {
  return appointments
    .filter((a) => a.status === 'confirmed' && new Date(a.startsAt).getTime() <= now.getTime())
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}
