export const theme = {
  colors: {
    primary: '#005AAA',
    primaryDark: '#003F7A',
    accent: '#FECC02',
    accentDark: '#E0B400',
    background: '#FAFAF7',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F2EE',
    border: '#E5E5E0',
    text: '#1A1A1A',
    textMuted: '#6B7280',
    success: '#16A34A',
    danger: '#DC2626',
    locked: '#9CA3AF',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    pill: '999px',
  },
  spacing: (n: number) => `${n * 4}px`,
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
  },
  font: {
    family: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },
} as const;

export type AppTheme = typeof theme;
