import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { barberName } from '@/components/AppointmentCards';
import { Button, Card, DetailRow, Field, ModalHeader, T } from '@/components/ui';
import { CANCELLATION_NOTICE_HOURS, salon, services } from '@/data/salon';
import { formatChf, formatRange } from '@/domain/format';
import { applyPromo, type PromoResult } from '@/domain/pricing';
import { useApp } from '@/store/AppStore';
import { colors, fonts, gutter, space } from '@/theme/tokens';

export default function Finaliser() {
  const params = useLocalSearchParams<{ serviceId: string; barberId: string; startsAt: string }>();
  const service = services.find((s) => s.id === params.serviceId)!;
  const start = new Date(params.startsAt);
  const { book } = useApp();

  const [code, setCode] = useState('');
  const [promo, setPromo] = useState<PromoResult | null>(null);
  const [busy, setBusy] = useState(false);

  const total = promo?.ok ? promo.totalChf : service.priceChf;

  const confirm = async () => {
    setBusy(true);
    const appointment = await book({
      barberId: params.barberId,
      serviceId: service.id,
      startsAt: start.toISOString(),
      durationMin: service.durationMin,
      priceChf: service.priceChf,
      promoCode: promo?.ok ? promo.code : undefined,
      totalChf: total,
      payment: 'sur-place',
    });
    router.replace({ pathname: '/reservation/confirmation', params: { id: appointment.id } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: gutter, gap: space.lg }} keyboardShouldPersistTaps="handled">
          <ModalHeader onBack={() => router.back()} onClose={() => router.navigate('/')} />
          <T variant="display">Finalise ta réservation</T>

          <Card bordered>
            <T variant="title" style={{ fontSize: 28, marginBottom: space.sm }}>Ton rendez-vous</T>
            <DetailRow label="Barbier" value={barberName(params.barberId)} />
            <DetailRow label="Prestation" value={service.name} />
            <DetailRow label="Date" value={formatRange(start, service.durationMin)} />
            <DetailRow label="Salon" value={salon.shortName} />
            <DetailRow label="Prix" value={formatChf(service.priceChf)} />

            <T variant="heading" style={{ marginTop: space.lg, marginBottom: space.sm }}>Code promo</T>
            <View style={{ flexDirection: 'row', gap: space.sm }}>
              <Field
                style={{ flex: 1 }}
                value={code}
                onChangeText={(v) => {
                  setCode(v);
                  setPromo(null);
                }}
                placeholder="Ton code"
                autoCapitalize="characters"
                autoCorrect={false}
                accessibilityLabel="Code promo"
              />
              <Button title="Appliquer" onPress={() => setPromo(applyPromo(code, service.priceChf))} style={{ minHeight: 56 }} />
            </View>
            {promo ? (
              <T style={{ marginTop: space.sm, color: promo.ok ? colors.gold : colors.danger }}>
                {promo.ok ? `Code ${promo.code} appliqué : -${promo.percentOff}%` : promo.error}
              </T>
            ) : null}
            <T variant="muted" style={{ fontSize: 14, marginTop: space.md }}>
              Pour bénéficier du tarif étudiant, présente ta carte à la réception du salon.
            </T>
          </Card>

          <T variant="muted" style={{ fontSize: 14 }}>
            Annulation gratuite jusqu'à {CANCELLATION_NOTICE_HOURS} h avant le rendez-vous, directement dans l'app. Au-delà, contacte le salon.
          </T>
        </ScrollView>

        {/* Total et paiement toujours visibles en bas de l'écran. */}
        <View
          style={{
            paddingHorizontal: gutter,
            paddingTop: space.md,
            paddingBottom: space.sm,
            gap: space.sm,
            borderTopWidth: 1,
            borderColor: colors.goldFaint,
            backgroundColor: colors.background,
          }}
        >
          <View style={{ gap: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T variant="muted">Sous-total</T>
              <T>{formatChf(service.priceChf)}</T>
            </View>
            {promo?.ok ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T variant="muted">Code {promo.code}</T>
                <T style={{ color: colors.gold }}>-{formatChf(promo.discountChf)}</T>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T style={{ fontFamily: fonts.bodyBold, fontSize: 18 }}>Total</T>
              <T style={{ fontFamily: fonts.bodyBold, fontSize: 18 }}>{formatChf(total)}</T>
            </View>
          </View>

          <Button title="Payer par carte" subtitle="Bientôt disponible" kind="disabled" />
          <Button title="Payer sur place" kind="outline" loading={busy} onPress={confirm} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
