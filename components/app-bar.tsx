import { View } from "react-native";
import { SansText } from "./text";

export function AppBar(props: {
  title?: string;
  titleClassName?: string;
  leading?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`pt-10 flex-col h-[100px] bg-white justify-center ${props.className}`}
    >
      <View className="flex items-center justify-between flex-row px-4">
        {props.leading}
        <SansText className={`text-3xl ${props.titleClassName}`}>
          {props.title}
        </SansText>
        {props.action}
      </View>
    </View>
  );
}
