import { RGBA, TextAttributes } from "@opentui/core";
import type { ReactNode } from "react";
import { Theme } from "../theme";

interface SectionProps {
  title: string;
  isFocused: boolean;
  children: ReactNode;
  width?: number;
  flexGrow?: number;
  flexShrink?: number;
}

export const Section = ({
  title,
  isFocused,
  children,
  width,
  flexGrow,
  flexShrink,
}: SectionProps) => {
  return (
    <box
      width={width}
      flexGrow={flexGrow}
      flexShrink={flexShrink}
      flexDirection="column"
      position="relative"
      border
      borderColor={RGBA.fromHex(isFocused ? Theme.borderFocused : Theme.border)}
      borderStyle="rounded"
    >
      <box flexDirection="row" flexShrink={0} top={-1} left={1} zIndex={1}>
        <text
          flexShrink={0}
          fg={isFocused ? Theme.primary : Theme.textMuted}
          attributes={TextAttributes.BOLD}
          bg={RGBA.fromHex(Theme.background)}
        >
          {" "}
          {title}{" "}
        </text>
      </box>
      {children}
    </box>
  );
};
