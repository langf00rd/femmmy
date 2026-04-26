import { Pressable, StyleSheet, View } from "react-native";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function Switch({
  value,
  onValueChange,
  disabled,
}: SwitchProps) {
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
    >
      <View
        style={[
          styles.track,
          { backgroundColor: value ? "#22c55e" : "#e5e7eb" },
          disabled && styles.disabled,
        ]}
      >
        <View
          style={[
            styles.thumb,
            { transform: [{ translateX: value ? 20 : 0 }] },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 51,
    height: 31,
    borderRadius: 16,
    padding: 2,
  },
  thumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#ffffff",
  },
  disabled: {
    opacity: 0.5,
  },
});
