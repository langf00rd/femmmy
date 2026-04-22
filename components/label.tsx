import { PropsWithChildren } from "react";
import { Text } from "react-native";

export default function Label(props: PropsWithChildren) {
  return (
    <Text className="mb-2 text-neutral-400 font-medium uppercase">
      {props.children}
    </Text>
  );
}
