import type { ParsedKey } from "@opentui/core";
import type { InputProps } from "@opentui/react";
import { useCallback, useRef, useState } from "react";



export const PasswordInput = ({ onInput, onSubmit, ...props }: InputProps) => {
  const [password, setPassword] = useState("");
  const inputRef = useRef<any>(null);

  const handlePasswordKeyDown = useCallback(
    (evt: ParsedKey) => {
      if (
        evt.name === "return" ||
        evt.name === "tab" ||
        evt.name === "up" ||
        evt.name === "down"
      ) {
        return; // Let the default handlers deal with it
      }

      if (evt.name === "backspace") {
        setPassword((prev) => {
          const newPassword = prev.slice(0, -1);
          if (inputRef.current) {
            inputRef.current.value = "*".repeat(newPassword.length);
          }
          onInput?.(newPassword);
          return newPassword;
        });
        return false;
      }

      if (evt.sequence && evt.sequence.length === 1 && !evt.ctrl && !evt.meta) {
        setPassword((prev) => {
          const newPassword = prev + evt.sequence;
          if (inputRef.current) {
            inputRef.current.value = "*".repeat(newPassword.length);
          }
          onInput?.(newPassword);
          return newPassword;
        });
        return false;
      }
    },
    [onInput]
  );

  const handleOnSubmit = useCallback(() => {
    onSubmit?.(password);
  }, [onSubmit, password]);

  return (
    <input
      {...props}
      ref={inputRef}
      onSubmit={handleOnSubmit}
      onKeyDown={handlePasswordKeyDown}
    />
  );
};
