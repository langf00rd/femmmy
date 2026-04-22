import { AppFonts } from "@/lib/types";
import { Text, TextProps } from "react-native";

type FontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

const weightToFont: Record<FontWeight, { normal: AppFonts; italic: AppFonts }> =
  {
    "100": { normal: "DMSans_100Thin", italic: "DMSans_100Thin_Italic" },
    "200": {
      normal: "DMSans_200ExtraLight",
      italic: "DMSans_200ExtraLight_Italic",
    },
    "300": { normal: "DMSans_300Light", italic: "DMSans_300Light_Italic" },
    "400": { normal: "DMSans_400Regular", italic: "DMSans_400Regular_Italic" },
    "500": { normal: "DMSans_500Medium", italic: "DMSans_500Medium_Italic" },
    "600": {
      normal: "DMSans_600SemiBold",
      italic: "DMSans_600SemiBold_Italic",
    },
    "700": { normal: "DMSans_700Bold", italic: "DMSans_700Bold_Italic" },
    "800": {
      normal: "DMSans_800ExtraBold",
      italic: "DMSans_800ExtraBold_Italic",
    },
    "900": { normal: "DMSans_900Black", italic: "DMSans_900Black_Italic" },
  };

function resolveFont(weight?: TextProps["style"], italic?: boolean): AppFonts {
  const w = String(weight ?? "400") as FontWeight;
  return weightToFont[w]?.[italic ? "italic" : "normal"] ?? "DMSans_400Regular";
}

interface SansTextProps extends Omit<TextProps, "style"> {
  style?: TextProps["style"];
}

export function SansText({ style, ...props }: SansTextProps) {
  const flat = Array.isArray(style)
    ? Object.assign({}, ...style)
    : (style ?? {});
  const { fontWeight, fontStyle, ...restStyle } = flat as any;

  const fontFamily = resolveFont(fontWeight, fontStyle === "italic");

  return <Text {...props} style={[{ fontFamily }, restStyle]} />;
}
