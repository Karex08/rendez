// Actions qui sortent de l'app : itinéraire et calendrier du téléphone.

import * as Calendar from 'expo-calendar';
import { Alert, Linking, Platform } from 'react-native';

import { salon } from '../data/salon';

export const salonAddress = `${salon.street}, ${salon.postcode} ${salon.city}`;

export async function openDirections() {
  const destination = encodeURIComponent(`${salon.street}, ${salon.postcode} ${salon.city}, ${salon.country}`);
  const url =
    Platform.OS === 'ios'
      ? `https://maps.apple.com/directions?destination=${destination}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  await Linking.openURL(url);
}

export async function callSalon() {
  await Linking.openURL(`tel:${salon.phone}`);
}

export async function addToCalendar(input: { title: string; start: Date; durationMin: number; notes?: string }) {
  try {
    const { status } = await Calendar.requestCalendarPermissions(true);
    if (status !== 'granted') {
      Alert.alert('Calendrier', "Autorise l'accès au calendrier dans les Réglages pour ajouter ton rendez-vous.");
      return false;
    }
    const calendar = Calendar.getDefaultCalendarSync();
    await calendar.createEvent({
      title: input.title,
      startDate: input.start,
      endDate: new Date(input.start.getTime() + input.durationMin * 60_000),
      location: `${salon.name}, ${salonAddress}`,
      notes: input.notes,
    });
    Alert.alert('Calendrier', 'Ton rendez-vous a été ajouté à ton calendrier.');
    return true;
  } catch {
    Alert.alert('Calendrier', "Impossible d'ajouter le rendez-vous au calendrier.");
    return false;
  }
}
