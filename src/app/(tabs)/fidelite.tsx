import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { illustrations } from '@/components/Brand';
import { T } from '@/components/ui';
import { loyaltyTiers } from '@/data/salon';
import { formatPoints } from '@/domain/format';
import { loyaltyProgress } from '@/domain/pricing';
import { useApp } from '@/store/AppStore';
import { colors, fonts, gutter, radius, space } from '@/theme/tokens';

export default function Fidelite() {
  const { loyaltyPoints } = useApp();
  const { width } = useWindowDimensions();
  const { currentIndex, current, next, ratio } = loyaltyProgress(loyaltyPoints);
  const cardWidth = width - gutter * 2 - 24;
  const [page, setPage] = useState(currentIndex);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingVertical: gutter, gap: space.lg }}>
        <View style={{ marginHorizontal: gutter, padding: space.lg, borderWidth: 1, borderColor: colors.goldFaint, borderRadius: radius.card, backgroundColor: colors.surface, gap: space.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <T variant="eyebrow">Programme fidélité</T>
              <T variant="display" style={{ marginTop: space.sm }}>{current.name}</T>
              <T variant="muted">Ton niveau actuel</T>
            </View>
            <View style={{ backgroundColor: colors.gold, paddingHorizontal: space.md, paddingVertical: space.sm }}>
              <Text style={{ fontFamily: fonts.label, color: colors.background, fontSize: 15 }}>{formatPoints(loyaltyPoints)} PTS</Text>
            </View>
          </View>
          {next ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: space.md }}>
                <T variant="muted" style={{ fontFamily: fonts.bodySemiBold }}>Vers {next.name}</T>
                <T style={{ fontFamily: fonts.bodyBold }}>{Math.round(ratio * 100)}%</T>
              </View>
              <View style={{ height: 6, backgroundColor: colors.surfaceRaised }}>
                <View style={{ height: 6, width: `${ratio * 100}%`, backgroundColor: colors.gold }} />
              </View>
            </>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: gutter }}>
          <T variant="heading" style={{ fontSize: 22 }}>Les niveaux</T>
          <T variant="muted">Glisse pour voir les avantages de chaque niveau.</T>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + space.md}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: gutter, gap: space.md }}
          contentOffset={{ x: currentIndex * (cardWidth + space.md), y: 0 }}
          onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / (cardWidth + space.md)))}
        >
          {loyaltyTiers.map((tier, i) => {
            const isCurrent = i === currentIndex;
            const missing = Math.max(0, tier.threshold - loyaltyPoints);
            const eyebrow = isCurrent ? 'Ton niveau' : i === currentIndex + 1 ? 'Prochain niveau' : i < currentIndex ? 'Débloqué' : 'À débloquer';
            return (
              <View
                key={tier.id}
                style={{
                  width: cardWidth,
                  minHeight: 380,
                  padding: space.lg,
                  borderWidth: 1,
                  borderColor: isCurrent ? colors.gold : colors.border,
                  borderRadius: radius.card,
                  backgroundColor: colors.surface,
                  gap: space.sm,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <T variant="eyebrow" style={{ color: isCurrent ? colors.gold : colors.textMuted }}>{eyebrow}</T>
                  <T variant="muted" style={{ fontFamily: fonts.bodySemiBold }}>{i + 1} sur {loyaltyTiers.length}</T>
                </View>
                <T variant="title">{tier.name}</T>
                <T variant="muted" style={{ fontFamily: fonts.bodySemiBold }}>{tier.tagline}</T>
                {missing > 0 ? <T style={{ color: colors.gold, fontFamily: fonts.bodyBold }}>Encore {formatPoints(missing)} pts</T> : null}

                {tier.perks.length === 0 ? (
                  <View style={{ gap: space.sm, marginTop: space.sm }}>
                    <T variant="heading">Comment ça marche</T>
                    <Step n={1} title="Réserve une prestation" detail="Chaque prestation payée te rapporte des points." />
                    <Step n={2} title="Achète un produit" detail="Les produits en salon comptent aussi." />
                    {next ? <Step n={3} title={`Passe ${next.name}`} detail={`Dès ${formatPoints(next.threshold)} pts.`} /> : null}
                  </View>
                ) : (
                  <View style={{ gap: space.sm, marginTop: space.sm }}>
                    <T variant="heading">{isCurrent || i < currentIndex ? 'Tes avantages' : 'Ce que tu débloques'}</T>
                    {tier.perks.map((perk) => (
                      <View key={perk.title} style={{ padding: space.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.card, backgroundColor: colors.surfaceRaised }}>
                        <T style={{ fontFamily: fonts.bodyBold }}>{missing > 0 ? '🔒  ' : ''}{perk.title}</T>
                        <T variant="muted" style={{ fontSize: 14 }}>{perk.detail}</T>
                      </View>
                    ))}
                  </View>
                )}
                <Image
                  source={[illustrations.blaireau, illustrations.peigne, illustrations.flacon, illustrations.ciseaux, illustrations.blaireau][i]}
                  style={{ position: 'absolute', right: space.md, bottom: space.md, width: 48, height: 64, opacity: 0.35 }}
                  contentFit="contain"
                />
              </View>
            );
          })}
        </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
          {loyaltyTiers.map((t, i) => (
            <View key={t.id} style={{ height: 6, width: i === page ? 22 : 6, backgroundColor: i === page ? colors.gold : colors.textFaint }} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Step({ n, title, detail }: { n: number; title: string; detail: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: space.md, padding: space.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.card, backgroundColor: colors.surfaceRaised }}>
      <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: fonts.label, color: colors.background }}>{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <T style={{ fontFamily: fonts.bodyBold }}>{title}</T>
        <T variant="muted" style={{ fontSize: 14 }}>{detail}</T>
      </View>
    </View>
  );
}
