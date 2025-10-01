import { TextAttributes } from "@opentui/core";
import { useCallback, useRef, useState } from "react";
import { Theme } from "../theme";

export const useExitPrompt = (onExit: () => void, onClearInput: () => void) => {
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const lastCtrlCRef = useRef<number>(0);

  const handleCtrlC = useCallback(() => {
    const now = Date.now();
    const timeSinceLastPress = now - lastCtrlCRef.current;

    if (timeSinceLastPress < 1000) {
      // Double press within 1000ms - exit
      onExit();
    } else {
      // First press - clear input and show exit prompt
      onClearInput();
      setShowExitPrompt(true);
      lastCtrlCRef.current = now;

      // Clear exit prompt after 1000ms
      setTimeout(() => {
        setShowExitPrompt(false);
      }, 1000);
    }
  }, [onExit, onClearInput]);

  return { handleCtrlC, showExitPrompt };
};

interface ExitPromptStatusProps {
  show: boolean;
}

export const ExitPromptStatus = ({ show }: ExitPromptStatusProps) => {
  if (!show) return null;

  return (
    <text fg={Theme.warning} attributes={TextAttributes.DIM}>
      Press Ctrl+C again to exit
    </text>
  );
};
