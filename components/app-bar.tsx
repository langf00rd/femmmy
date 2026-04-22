import { Text, View } from "react-native";

export function AppBar(props: {
  title?: string;
  titleClassName?: string;
  leading?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <View className="pt-10 border-b border-b-neutral-200 flex-col h-[100px] bg-white justify-center">
      <View className="flex items-center justify-between flex-row px-4">
        {props.leading}
        <Text className={`text-3xl font-medium ${props.titleClassName}`}>
          {props.title}
        </Text>
        {props.action}
      </View>
    </View>
  );
}
