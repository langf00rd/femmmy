import { PropsWithChildren } from "react";
import { SansText } from "./text";

export default function Label(props: PropsWithChildren) {
  return (
    <SansText
      className="mb-2 text-neutral-400 uppercase"
      style={{ fontWeight: 600 }}
    >
      {props.children}
    </SansText>
  );
}
