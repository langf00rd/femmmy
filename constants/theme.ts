import { Platform } from "react-native";

/**
 * Material Design 3 Tonal Palettes
 * Primary: Pink/Rose (Period/Brand)
 * Secondary: Blue (Fertility)
 * Error: Red
 */
const primaryPink = "#9C4275"; // M3 Primary Pink
const primaryPinkLightContainer = "#FFD8E9";
const primaryPinkDarkContainer = "#7D295C";

const secondaryBlue = "#3F5F90"; // M3 Secondary Blue
const secondaryBlueLightContainer = "#D6E3FF";
const secondaryBlueDarkContainer = "#244777";

export const Colors = {
  light: {
    text: "#1D1A1C", // M3 On Surface
    background: "#FFF8F9", // M3 Surface
    tint: primaryPink,
    icon: "#4E444B", // M3 On Surface Variant
    tabIconDefault: "#4E444B",
    tabIconSelected: primaryPink,

    // Feature Specific
    fertile: secondaryBlueLightContainer,
    fertileBorder: secondaryBlue,
    period: primaryPinkLightContainer,
    periodBorder: primaryPink,

    // Status (M3 Standard Semantic)
    success: "#2E6C39",
    warning: "#895100",
    danger: "#BA1A1A",
  },
  dark: {
    text: "#E9E0E2", // M3 On Surface (Dark)
    background: "#161113", // M3 Surface (Dark)
    tint: "#FFB0D8", // M3 Primary (Lightened for dark mode)
    icon: "#D2C2C9", // M3 On Surface Variant (Dark)
    tabIconDefault: "#D2C2C9",
    tabIconSelected: "#FFB0D8",

    // Feature Specific
    fertile: secondaryBlueDarkContainer,
    fertileBorder: "#AAC7FF",
    period: primaryPinkDarkContainer,
    periodBorder: "#FFB0D8",

    // Status (M3 Standard Semantic)
    success: "#96D597",
    warning: "#FFB951",
    danger: "#FFB4AB",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
