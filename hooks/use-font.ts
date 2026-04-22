import { DMSans_100Thin } from "@expo-google-fonts/dm-sans/100Thin";
import { DMSans_100Thin_Italic } from "@expo-google-fonts/dm-sans/100Thin_Italic";
import { DMSans_200ExtraLight } from "@expo-google-fonts/dm-sans/200ExtraLight";
import { DMSans_200ExtraLight_Italic } from "@expo-google-fonts/dm-sans/200ExtraLight_Italic";
import { DMSans_300Light } from "@expo-google-fonts/dm-sans/300Light";
import { DMSans_300Light_Italic } from "@expo-google-fonts/dm-sans/300Light_Italic";
import { DMSans_400Regular } from "@expo-google-fonts/dm-sans/400Regular";
import { DMSans_400Regular_Italic } from "@expo-google-fonts/dm-sans/400Regular_Italic";
import { DMSans_500Medium } from "@expo-google-fonts/dm-sans/500Medium";
import { DMSans_500Medium_Italic } from "@expo-google-fonts/dm-sans/500Medium_Italic";
import { DMSans_600SemiBold } from "@expo-google-fonts/dm-sans/600SemiBold";
import { DMSans_600SemiBold_Italic } from "@expo-google-fonts/dm-sans/600SemiBold_Italic";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans/700Bold";
import { DMSans_700Bold_Italic } from "@expo-google-fonts/dm-sans/700Bold_Italic";
import { DMSans_800ExtraBold } from "@expo-google-fonts/dm-sans/800ExtraBold";
import { DMSans_800ExtraBold_Italic } from "@expo-google-fonts/dm-sans/800ExtraBold_Italic";
import { DMSans_900Black } from "@expo-google-fonts/dm-sans/900Black";
import { DMSans_900Black_Italic } from "@expo-google-fonts/dm-sans/900Black_Italic";
import { useFonts } from "@expo-google-fonts/dm-sans/useFonts";

export function useLocalFont() {
  // const [loaded, error] = useFonts({
  //   DMSans: require("../assets/fonts/DM_Sans/DMSans-VariableFont_opsz,wght.ttf"),
  // });

  let [fontsLoaded] = useFonts({
    DMSans_100Thin,
    DMSans_200ExtraLight,
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
    DMSans_900Black,
    DMSans_100Thin_Italic,
    DMSans_200ExtraLight_Italic,
    DMSans_300Light_Italic,
    DMSans_400Regular_Italic,
    DMSans_500Medium_Italic,
    DMSans_600SemiBold_Italic,
    DMSans_700Bold_Italic,
    DMSans_800ExtraBold_Italic,
    DMSans_900Black_Italic,
  });

  return fontsLoaded;
}
