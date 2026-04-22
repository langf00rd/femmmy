import { COLORS } from "@/lib/theme";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  className?: string;
}

// const variantStyles = {
//   primary: {
//     button: `bg-[${COLORS.primary}]`,
//     text: "text-white",
//     indicator: "#fff",
//   },
//   danger: {
//     button: "bg-white border-2 border-red-600",
//     text: "text-red-600",
//     indicator: "#dc2626",
//   },
//   secondary: {
//     button: "bg-white border border-gray-200",
//     text: "text-gray-700",
//     indicator: "#dc2626",
//   },
// } as const;

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  style,
  className,
}: ButtonProps) {
  // const v = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center py-4 rounded-full ${isDisabled ? "opacity-60" : ""} ${className ?? ""}`}
      style={[
        style,
        {
          backgroundColor: COLORS.primary,
        },
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text className={`font-semibold text-white`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
