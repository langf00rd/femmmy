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
}

const variantStyles = {
  primary: {
    button: "bg-black",
    text: "text-white",
    indicator: "#fff",
  },
  danger: {
    button: "bg-white border-2 border-red-600",
    text: "text-red-600",
    indicator: "#dc2626",
  },
  secondary: {
    button: "bg-white border border-gray-200",
    text: "text-gray-700",
    indicator: "#dc2626",
  },
} as const;

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  style,
}: ButtonProps) {
  const v = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center py-4 rounded-full ${v.button} ${isDisabled ? "opacity-60" : ""}`}
      style={style}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={v.indicator} />
      ) : (
        <Text className={`font-semibold ${v.text}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
