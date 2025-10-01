import { TextAttributes, type InputRenderable } from "@opentui/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useModal, type ModalConfig, CreateChatModalKey } from "../../providers/modal-provider";
import { Theme } from "../../theme";

type CreateChatModalData = Extract<ModalConfig, { type: typeof CreateChatModalKey }>["data"];

export function CreateChatModalContent(props: CreateChatModalData) {
  const [chatName, setChatName] = useState("");
  const inputRef = useRef<InputRenderable>(null);
  const modal = useModal();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (chatName.trim()) {
      props.onConfirm?.(chatName);
      modal(null);
    }
  }, [chatName, props, modal]);

  return (
    <>
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text attributes={TextAttributes.BOLD} fg={Theme.text}>
          Create New Chat
        </text>
        <text fg={Theme.textMuted}>esc</text>
      </box>

      <box style={{ paddingBottom: 1 }}>
        <input
          value={chatName}
          onInput={setChatName}
          onSubmit={handleSubmit}
          ref={inputRef}
          placeholder="Enter chat name..."
          focusedBackgroundColor={Theme.backgroundPanel}
          cursorColor={Theme.primary}
          focusedTextColor={Theme.text}
        />
      </box>
    </>
  );
}
