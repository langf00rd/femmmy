import { View } from "react-native";
import { SansText } from "./text";

export function AppBar(props: {
  title?: string;
  titleSlot?: React.ReactNode;
  titleClassName?: string;
  leading?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`pt-10 flex-col h-[100px] bg-white justify-center ${props.className}`}
    >
      <View className="flex items-start justify-between flex-row px-4">
        {props.leading}
        {props.title && (
          <SansText
            className={`w-full text-3xl ${props.titleClassName}`}
            style={{
              fontWeight: 500,
            }}
          >
            {props.title}
          </SansText>
        )}
        {props.titleSlot}
        {props.action}
      </View>
    </View>
  );
}
