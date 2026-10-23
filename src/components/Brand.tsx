// Logo provisoire « THE BARBERSHOP · Geneva » (spec §2), en attendant le SVG officiel.

import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { colors, fonts } from '../theme/tokens';

export const illustrations = {
  ciseaux: require('../../assets/images/illustrations/ciseaux.png'),
  peigne: require('../../assets/images/illustrations/peigne.png'),
  blaireau: require('../../assets/images/illustrations/blaireau.png'),
  flacon: require('../../assets/images/illustrations/flacon.png'),
};

export const salonPhotos = {
  comptoir: require('../../assets/images/salon/comptoir-logo.jpg'),
};

export function BrandMark({ scale = 1 }: { scale?: number }) {
  return (
    <View accessible accessibilityLabel="The Barbershop Geneva" style={{ alignItems: 'center' }}>
      <Image source={illustrations.ciseaux} style={{ width: 34 * scale, height: 40 * scale }} contentFit="contain" />
      <Text style={{ fontFamily: fonts.display, color: colors.gold, fontSize: 13 * scale, letterSpacing: 5 * scale, marginTop: 8 * scale }}>
        THE
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 * scale }}>
        <View style={{ width: 18 * scale, height: 1, backgroundColor: colors.gold }} />
        <Text style={{ fontFamily: fonts.display, color: colors.gold, fontSize: 30 * scale, letterSpacing: 2 * scale, lineHeight: 32 * scale }}>
          BARBERSHOP
        </Text>
        <View style={{ width: 18 * scale, height: 1, backgroundColor: colors.gold }} />
      </View>
      <Text style={{ fontFamily: fonts.script, color: colors.gold, fontSize: 14 * scale }}>Geneva</Text>
    </View>
  );
}
