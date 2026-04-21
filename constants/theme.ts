import { Platform } from 'react-native';

const primaryPink = '#ec4899';
const primaryPinkDark = '#f472b6';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: primaryPink,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryPink,
    fertile: '#dbeafe',
    fertileBorder: '#3b82f6',
    period: '#fce7f3',
    periodBorder: primaryPink,
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: primaryPinkDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryPinkDark,
    fertile: '#1e3a5f',
    fertileBorder: '#3b82f6',
    period: '#4a1a3a',
    periodBorder: primaryPinkDark,
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});