// Look and feel repris de the-barbershop.ch (voir docs/spec-v1.md §2).

export const colors = {
  background: '#131314',
  surface: '#1C1C1E',
  surfaceRaised: '#242426',
  border: 'rgba(255,255,255,0.12)',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.6)',
  textFaint: 'rgba(255,255,255,0.38)',
  gold: '#CEA46F',
  goldFaint: 'rgba(206,164,111,0.35)',
  danger: '#E5616B',
  dangerBorder: 'rgba(229,97,107,0.45)',
  success: '#5BBF6A',
  overlay: 'rgba(19,19,20,0.55)',
} as const;

export const fonts = {
  display: 'BebasNeue_400Regular',
  label: 'Inter_700Bold',
  labelMedium: 'Inter_600SemiBold',
  body: 'OpenSans_400Regular',
  bodySemiBold: 'OpenSans_600SemiBold',
  bodyBold: 'OpenSans_700Bold',
  script: 'OpenSans_600SemiBold_Italic',
} as const;

export const radius = {
  none: 0,
  field: 4,
  card: 4,
  pill: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const gutter = 24;
