import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = "primary", disabled, loading, style }: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = { ...styles.button };
    if (variant === "primary") Object.assign(base, styles.primaryButton);
    if (variant === "danger") Object.assign(base, styles.dangerButton);
    if (variant === "secondary") Object.assign(base, styles.secondaryButton);
    if (disabled) Object.assign(base, styles.disabledButton);
    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = { ...styles.text };
    if (variant === "primary") Object.assign(base, styles.primaryText);
    if (variant === "danger") Object.assign(base, styles.dangerText);
    if (variant === "secondary") Object.assign(base, styles.secondaryText);
    if (disabled) Object.assign(base, styles.disabledText);
    return base;
  };

  return (
    <TouchableOpacity style={[getButtonStyle(), style]} onPress={onPress} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? "#dc2626" : "#fff"} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: "#dc2626",
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dangerButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#dc2626",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontSize: 17,
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
  },
  dangerText: {
    color: "#dc2626",
  },
  secondaryText: {
    color: "#374151",
  },
  disabledText: {
    color: "#9ca3af",
  },
});