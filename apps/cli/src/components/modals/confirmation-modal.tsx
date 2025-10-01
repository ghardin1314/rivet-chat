import { RGBA, TextAttributes, type ParsedKey } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useCallback, useState } from "react";
import { useModal, type ModalConfig, ConfirmationModalKey } from "../../providers/modal-provider";
import { Theme } from "../../theme";

type ConfirmationModalData = Extract<ModalConfig, { type: typeof ConfirmationModalKey }>["data"];

export function ConfirmationModalContent(props: ConfirmationModalData) {
  const [active, setActive] = useState<"confirm" | "cancel">("confirm");
  const modal = useModal();

  const {
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  } = props;

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      if (evt.name === "return") {
        if (active === "confirm") {
          onConfirm?.();
        } else {
          onCancel?.();
        }
        modal(null);
        return;
      }

      if (evt.name === "left" || evt.name === "right" || evt.name === "tab") {
        setActive((prev) => (prev === "confirm" ? "cancel" : "confirm"));
      }
    },
    [active, onConfirm, onCancel, modal]
  );

  useKeyboard(handleKeyboard);

  const handleMouseDown = useCallback(
    (action: "confirm" | "cancel") => {
      if (action === "confirm") {
        onConfirm?.();
      } else {
        onCancel?.();
      }
      modal(null);
    },
    [onConfirm, onCancel, modal]
  );

  return (
    <>
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text attributes={TextAttributes.BOLD} fg={Theme.text}>
          {title}
        </text>
        <text fg={Theme.textMuted}>esc</text>
      </box>

      <box style={{ paddingBottom: 1 }}>
        <text fg={Theme.textMuted}>{message}</text>
      </box>

      <box
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <box
          style={{
            paddingLeft: 2,
            paddingRight: 2,
            backgroundColor:
              active === "cancel"
                ? RGBA.fromHex(Theme.primary)
                : RGBA.fromInts(0, 0, 0, 0),
          }}
          onMouseDown={() => handleMouseDown("cancel")}
        >
          <text
            fg={active === "cancel" ? Theme.background : Theme.textMuted}
            attributes={active === "cancel" ? TextAttributes.BOLD : undefined}
          >
            {cancelText}
          </text>
        </box>

        <box
          style={{
            paddingLeft: 2,
            paddingRight: 2,
            backgroundColor:
              active === "confirm"
                ? RGBA.fromHex(Theme.primary)
                : RGBA.fromInts(0, 0, 0, 0),
          }}
          onMouseDown={() => handleMouseDown("confirm")}
        >
          <text
            fg={active === "confirm" ? Theme.background : Theme.textMuted}
            attributes={active === "confirm" ? TextAttributes.BOLD : undefined}
          >
            {confirmText}
          </text>
        </box>
      </box>
    </>
  );
}
