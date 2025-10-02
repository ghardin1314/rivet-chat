import { RGBA, TextAttributes } from "@opentui/core";
import type { ReactNode } from "react";
import { useCallback, useEffect } from "react";
import { useFocus } from "../providers/focus-provider";
import { Theme } from "../theme";

interface SectionProps {
  title: string;
  focusIndex: number;
  focusSlug: string;
  children: ReactNode;
  width?: number;
  flexGrow?: number;
  flexShrink?: number;
}

export const Section = ({
  title,
  focusIndex,
  focusSlug,
  children,
  width,
  flexGrow,
  flexShrink,
}: SectionProps) => {
  const { registerSection, unregisterSection, isFocused, setFocusedSlug } = useFocus();

  useEffect(() => {
    registerSection({ focusIndex, focusSlug });
    return () => unregisterSection(focusSlug);
  }, [focusIndex, focusSlug, registerSection, unregisterSection]);

  const focused = isFocused(focusSlug);

  const handleMouseDown = useCallback(() => {
    setFocusedSlug(focusSlug);
  }, [setFocusedSlug, focusSlug]);

  return (
    <box
      width={width}
      flexGrow={flexGrow}
      flexShrink={flexShrink}
      flexDirection="column"
      position="relative"
      border
      borderColor={RGBA.fromHex(focused ? Theme.borderFocused : Theme.border)}
      borderStyle="rounded"
      onMouseDown={handleMouseDown}
    >
      <box
        flexDirection="row"
        flexShrink={0}
        top={-1}
        left={1}
        zIndex={1}
        gap={1}
      >
        <text
          flexShrink={0}
          fg={focused ? Theme.primary : Theme.textMuted}
          attributes={TextAttributes.BOLD}
          bg={RGBA.fromHex(Theme.background)}
        >
          [{focusIndex}]
        </text>
        <text
          flexShrink={0}
          fg={focused ? Theme.primary : Theme.textMuted}
          attributes={TextAttributes.BOLD}
          bg={RGBA.fromHex(Theme.background)}
        >
          {title}
        </text>
      </box>
      {children}
    </box>
  );
};
