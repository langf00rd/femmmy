import { TextInput } from "react-native";

export default function TextField({ ...props }) {
  return (
    <TextInput
      {...props}
      className={`border border-neutral-200 px-4 rounded-md shadow bg-white ${props.className}`}
    />
  );
}
