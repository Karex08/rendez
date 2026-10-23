// Aperçu de carte + adresse + itinéraire + calendrier (confirmation et fiche du rendez-vous).

import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { salon } from '../data/salon';
import type { Appointment } from '../domain/types';
import { addToCalendar, openDirections } from '../services/device';
import { colors, fonts, radius, space } from '../theme/tokens';
import { serviceName } from './AppointmentCards';
import { T, TextLink } from './ui';

const region = {
  latitude: salon.latitude,
  longitude: salon.longitude,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006,
};

export function SalonLocation({ appointment }: { appointment: Appointment }) {
  return (
    <View style={{ gap: space.md }}>
      <View style={{ flexDirection: 'row', gap: space.md }}>
        <View
          pointerEvents="none"
          accessibilityLabel={`Carte : ${salon.street}, ${salon.city}`}
          style={{ width: 112, height: 112, borderRadius: radius.card, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}
        >
          <MapView
            style={{ flex: 1 }}
            initialRegion={region}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            userInterfaceStyle="dark"
          >
            <Marker coordinate={region} pinColor={colors.gold} />
          </MapView>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T style={{ fontFamily: fonts.display, fontSize: 24, lineHeight: 30, letterSpacing: 1 }}>{salon.shortName}</T>
          <T variant="muted">
            {salon.street}, {salon.postcode} {salon.city}, {salon.country}
          </T>
          <TextLink title="Obtenir l'itinéraire" onPress={openDirections} style={{ marginTop: space.xs }} />
        </View>
      </View>
      <TextLink
        title="Ajouter au calendrier"
        onPress={() =>
          addToCalendar({
            title: `${serviceName(appointment.serviceId)} — The Barbershop`,
            start: new Date(appointment.startsAt),
            durationMin: appointment.durationMin,
            notes: 'Réservé avec l’app The Barbershop.',
          })
        }
      />
    </View>
  );
}
