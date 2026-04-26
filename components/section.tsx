import { PropsWithChildren } from "react";
import { View } from "react-native";

export default function Section(props: PropsWithChildren) {
  return (
    <View className="bg-gray-100 mb-4 rounded-xl border border-gray-200/40 p-5">
      {props.children}
    </View>
  );
}
