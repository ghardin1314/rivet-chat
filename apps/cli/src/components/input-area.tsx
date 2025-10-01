import { InputRenderable, RGBA, TextAttributes } from "@opentui/core";
import { useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import { Theme } from "../theme";
import { useExitPrompt, ExitPromptStatus } from "./ExitPrompt";

interface InputAreaProps {
  inputRef: React.RefObject<InputRenderable | null>;
  value: string;
  onInput: (value: string) => void;
  onSubmit: () => void;
  isFocused: boolean;
}

export const InputArea = ({ inputRef, value, onInput, onSubmit, isFocused }: InputAreaProps) => {
  const { handleCtrlC, showExitPrompt } = useExitPrompt(
    () => process.exit(0),
    () => onInput("")
  );

  // Handle Ctrl+C only when this panel is focused
  const handleKeyboard = useCallback(
    (evt: any) => {
      if (evt.ctrl && evt.name === "c" && isFocused) {
        handleCtrlC();
      }
    },
    [isFocused, handleCtrlC]
  );

  useKeyboard(handleKeyboard);

  return (
    <box
      flexDirection="column"
      flexShrink={0}
      borderColor={RGBA.fromHex(isFocused ? Theme.borderFocused : Theme.border)}
    >
      <box
        height={1}
        paddingLeft={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <text
          fg={isFocused ? Theme.primary : Theme.textMuted}
          attributes={isFocused ? TextAttributes.BOLD : TextAttributes.DIM}
        >
          Input
        </text>
        <ExitPromptStatus show={showExitPrompt} />
      </box>
      <box
        flexShrink={0}
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
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
    </box>
  );
};
