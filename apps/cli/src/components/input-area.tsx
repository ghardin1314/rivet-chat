import { InputRenderable, RGBA } from "@opentui/core";
import { useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import { useFocus } from "../providers/focus-provider";
import { useDisableGlobalKeybindings } from "../providers/keybinding-provider";
import { Theme } from "../theme";
import { useExitPrompt } from "./exit-prompt";
import { Section } from "./section";

interface InputAreaProps {
  inputRef: React.RefObject<InputRenderable | null>;
  value: string;
  onInput: (value: string) => void;
  onSubmit: () => void;
}

export const InputArea = ({ inputRef, value, onInput, onSubmit }: InputAreaProps) => {
  const { isFocused } = useFocus();
  const { handleCtrlC } = useExitPrompt(
    () => process.exit(0),
    () => onInput("")
  );

  // Disable global (app-level) keybindings when input is focused
  useDisableGlobalKeybindings(isFocused("input"));

  // Handle Ctrl+C only when this panel is focused
  const handleKeyboard = useCallback(
    (evt: any) => {
      if (evt.ctrl && evt.name === "c" && isFocused("input")) {
        handleCtrlC();
      }
    },
    [isFocused, handleCtrlC]
  );

  useKeyboard(handleKeyboard);

  return (
    <Section title="Input" focusIndex={2} focusSlug="input" flexShrink={0}>
      <box
        flexShrink={0}
        paddingLeft={2}
        paddingRight={2}
        paddingBottom={1}
      >
        <input
          ref={inputRef}
          value={value}
          onInput={onInput}
          onSubmit={onSubmit}
          placeholder="Type a message..."
          cursorColor={RGBA.fromHex(Theme.primary)}
          focusedTextColor={RGBA.fromHex(Theme.text)}
        />
      </box>
    </Section>
  );
};
