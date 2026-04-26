import { COLORS } from "@/lib/theme";
import { ActivityIndicator, TouchableOpacity, ViewStyle } from "react-native";
import { SansText } from "./text";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  style,
  className,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          button: { backgroundColor: COLORS.destructive },
          text: "text-red-700",
        };
      case "secondary":
        return {
          button: {
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#d1d5db",
          },
          text: "#374151",
        };
      case "primary":
      default:
        return {
          button: { backgroundColor: COLORS.primary },
          text: "text-white",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center py-4 rounded-full ${isDisabled ? "opacity-60" : ""} ${className ?? ""}`}
      style={[style, variantStyles.button]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator
          color={variantStyles.text === "text-white" ? "#fff" : "#374151"}
        />
      ) : (
        <SansText className={variantStyles.text} style={{ fontWeight: 600 }}>
          {title}
        </SansText>
      )}
    </TouchableOpacity>
  );
}
