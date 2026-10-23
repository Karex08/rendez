// Accès aux données. v1 : stockage local sur le téléphone. v2 : appels au serveur.

import type { Appointment, Profile } from '../domain/types';
import { kv } from './storage';

const KEYS = {
  session: 'rendez.session',
  profile: 'rendez.profile',
  appointments: 'rendez.appointments',
} as const;

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await kv.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function write(key: string, value: unknown): Promise<void> {
  if (value === null) await kv.removeItem(key);
  else await kv.setItem(key, JSON.stringify(value));
}

export const repository = {
  getSession: () => read<{ phone: string } | null>(KEYS.session, null),
  setSession: (session: { phone: string } | null) => write(KEYS.session, session),

  getProfile: () => read<Profile | null>(KEYS.profile, null),
  setProfile: (profile: Profile) => write(KEYS.profile, profile),

  getAppointments: () => read<Appointment[]>(KEYS.appointments, []),
  async addAppointment(appointment: Appointment) {
    const all = [...(await read<Appointment[]>(KEYS.appointments, [])), appointment];
    await write(KEYS.appointments, all);
    return all;
  },
  async cancelAppointment(id: string) {
    const all = (await read<Appointment[]>(KEYS.appointments, [])).map((a) =>
      a.id === id ? { ...a, status: 'cancelled' as const } : a,
    );
    await write(KEYS.appointments, all);
    return all;
  },
};
