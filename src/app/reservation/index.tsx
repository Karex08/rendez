import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModalHeader, T } from '@/components/ui';
import { salon, serviceCategories, services } from '@/data/salon';
import { formatChf } from '@/domain/format';
import { colors, fonts, gutter, space } from '@/theme/tokens';

export default function ChoixPrestation() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: gutter, paddingBottom: space.xxl }}>
        <ModalHeader onClose={() => router.navigate('/')} />
        <T variant="eyebrow" style={{ marginTop: space.lg }}>{salon.shortName}</T>
        <T variant="display">Choisis une prestation</T>

        {serviceCategories.map((category) => (
          <View key={category.id} style={{ marginTop: space.xl }}>
            <Text style={{ fontFamily: fonts.label, fontSize: 12, letterSpacing: 2.5, color: colors.gold, textTransform: 'uppercase', marginBottom: space.xs }}>
              {category.name}
            </Text>
            {services
              .filter((s) => s.categoryId === category.id)
              .map((service) => (
                <Pressable
                  key={service.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${service.name}, ${service.durationMin} minutes, ${formatChf(service.priceChf)}`}
                  onPress={() => router.push({ pathname: '/reservation/creneau', params: { serviceId: service.id } })}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: space.md,
                    paddingVertical: space.md,
                    borderBottomWidth: 1,
                    borderColor: colors.goldFaint,
                    borderStyle: 'dashed',
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View style={{ flex: 1 }}>
                    <T style={{ fontFamily: fonts.bodyBold, fontSize: 17 }}>{service.name}</T>
                    <T variant="muted" style={{ fontSize: 14 }}>
                      {service.durationMin} min{service.studentRate ? ' · Carte étudiant à présenter au salon' : ''}
                    </T>
                  </View>
                  <View style={{ borderWidth: 1, borderColor: colors.border, paddingHorizontal: space.md, paddingVertical: space.sm }}>
                    <Text style={{ fontFamily: fonts.bodyBold, color: colors.text, fontSize: 15 }}>{formatChf(service.priceChf)}</Text>
                  </View>
                </Pressable>
              ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
