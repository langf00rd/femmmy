import { Text, View } from "react-native";

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
      <View className="flex items-center justify-between flex-row px-4 pl-0">
        {props.leading}
        <Text className={`text-3xl font-medium ${props.titleClassName}`}>
          {props.title}
        </Text>
        {props.action}
      </View>
    </View>
  );
}
