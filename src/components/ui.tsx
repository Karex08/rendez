// Briques visuelles communes, au style the-barbershop.ch (spec §2).

import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radius, space } from '../theme/tokens';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'muted' | 'label' | 'eyebrow';

export function T({ variant = 'body', style, ...props }: TextProps & { variant?: Variant }) {
  return <Text {...props} style={[textStyles[variant], style]} />;
}

const textStyles = StyleSheet.create({
  display: { fontFamily: fonts.display, fontSize: 48, lineHeight: 52, color: colors.text, letterSpacing: 0.5 },
  title: { fontFamily: fonts.display, fontSize: 36, lineHeight: 40, color: colors.text, letterSpacing: 0.5 },
  heading: { fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 24, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.text },
  muted: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.textMuted },
  label: { fontFamily: fonts.label, fontSize: 13, letterSpacing: 2, color: colors.text, textTransform: 'uppercase' },
  eyebrow: { fontFamily: fonts.display, fontSize: 18, letterSpacing: 4, color: colors.gold },
});

type ButtonKind = 'primary' | 'outline' | 'danger' | 'disabled';

export function Button({
  title,
  onPress,
  kind = 'primary',
  subtitle,
  loading,
  style,
  accessibilityHint,
}: {
  title: string;
  onPress?: () => void;
  kind?: ButtonKind;
  subtitle?: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}) {
  const disabled = kind === 'disabled' || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyles.base,
        buttonStyles[kind],
        pressed && !disabled && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={kind === 'primary' ? colors.background : colors.text} />
      ) : (
        <>
          <Text style={[buttonStyles.text, buttonTextColor[kind]]}>{title}</Text>
          {subtitle ? <Text style={[buttonStyles.subtitle, buttonTextColor[kind]]}>{subtitle}</Text> : null}
        </>
      )}
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.none,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  primary: { backgroundColor: colors.text, borderColor: colors.text },
  outline: { backgroundColor: 'transparent', borderColor: colors.text },
  danger: { backgroundColor: 'transparent', borderColor: colors.dangerBorder },
  disabled: { backgroundColor: 'transparent', borderColor: colors.border },
  text: { fontFamily: fonts.label, fontSize: 14, letterSpacing: 2.2, textTransform: 'uppercase' },
  subtitle: { fontFamily: fonts.body, fontSize: 13, marginTop: 2, opacity: 0.7 },
});

const buttonTextColor: Record<ButtonKind, TextStyle> = {
  primary: { color: colors.background },
  outline: { color: colors.text },
  danger: { color: colors.danger },
  disabled: { color: colors.textFaint },
};

export function TextLink({ title, onPress, style }: { title: string; onPress: () => void; style?: StyleProp<TextStyle> }) {
  return (
    <Text accessibilityRole="link" onPress={onPress} style={[linkStyle, style]}>
      {title}
    </Text>
  );
}

const linkStyle: TextStyle = {
  fontFamily: fonts.bodySemiBold,
  fontSize: 16,
  color: colors.text,
  textDecorationLine: 'underline',
  textDecorationColor: colors.gold,
};

export function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.textFaint}
      selectionColor={colors.gold}
      {...props}
      style={[fieldStyle, props.style]}
    />
  );
}

const fieldStyle: TextStyle = {
  minHeight: 56,
  paddingHorizontal: space.md,
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.field,
  color: colors.text,
  fontFamily: fonts.body,
  fontSize: 17,
};

export function Card({ children, style, bordered }: { children: ReactNode; style?: StyleProp<ViewStyle>; bordered?: boolean }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.card,
          borderWidth: 1,
          borderColor: bordered ? colors.goldFaint : colors.border,
          padding: space.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Ligne libellé / valeur des récapitulatifs de rendez-vous. */
export function DetailRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 6, gap: space.md }}>
      <T variant="muted" style={{ fontSize: 16 }}>{label}</T>
      <View style={{ flexShrink: 1, alignItems: 'flex-end' }}>
        <T style={{ fontFamily: fonts.bodyBold, textAlign: 'right' }}>{value}</T>
        {note ? <T variant="muted" style={{ fontSize: 14 }}>{note}</T> : null}
      </View>
    </View>
  );
}

/** Filet doré en pointillés, comme les séparateurs du site. */
export function GoldRule({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ borderBottomWidth: 1, borderColor: colors.goldFaint, borderStyle: 'dashed' }, style]} />;
}

/** Barre « Retour / Fermer » des écrans de réservation. */
export function ModalHeader({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 }}>
      {onBack ? (
        <Pressable accessibilityRole="button" onPress={onBack} hitSlop={12}>
          <Text style={{ fontFamily: fonts.label, fontSize: 14, letterSpacing: 2, color: colors.text, textTransform: 'uppercase' }}>‹  Retour</Text>
        </Pressable>
      ) : (
        <View />
      )}
      {onClose ? (
        <Pressable accessibilityRole="button" onPress={onClose} hitSlop={12}>
          <Text style={{ fontFamily: fonts.label, fontSize: 14, letterSpacing: 2, color: colors.textMuted, textTransform: 'uppercase' }}>Fermer</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Avatar de barbier : initiale sur fond noir, filet doré (en attendant les portraits). */
export function BarberAvatar({ name, size = 56 }: { name: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.gold,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: fonts.display, fontSize: size * 0.5, color: colors.gold }}>{name.charAt(0)}</Text>
    </View>
  );
}
