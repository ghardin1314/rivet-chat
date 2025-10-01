import { RGBA, TextAttributes, type ParsedKey } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useCallback, useState } from "react";
import { Theme } from "../theme";

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const ConfirmationDialog = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
}: ConfirmationDialogProps) => {
  const dimensions = useTerminalDimensions();
  const [active, setActive] = useState<"confirm" | "cancel">("confirm");

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      if (evt.name === "escape") {
        onClose?.();
        return;
      }

      if (evt.name === "return") {
        if (active === "confirm") {
          onConfirm?.();
        } else {
          onCancel?.();
        }
        onClose?.();
        return;
      }

      if (evt.name === "left" || evt.name === "right" || evt.name === "tab") {
        setActive((prev) => (prev === "confirm" ? "cancel" : "confirm"));
      }
    },
    [active, onConfirm, onCancel, onClose]
  );

  useKeyboard(handleKeyboard);

  const handleMouseDown = useCallback(
    (action: "confirm" | "cancel") => {
      if (action === "confirm") {
        onConfirm?.();
      } else {
        onCancel?.();
      }
      onClose?.();
    },
    [onConfirm, onCancel, onClose]
  );

  return (
    <box
      style={{
        width: dimensions.width,
        height: dimensions.height,
        alignItems: "center",
        position: "absolute",
        paddingTop: Math.floor(dimensions.height / 4),
        left: 0,
        top: 0,
        backgroundColor: RGBA.fromInts(0, 0, 0, 150),
      }}
    >
      <box
        style={{
          width: 60,
          maxWidth: dimensions.width - 2,
          backgroundColor: Theme.backgroundPanel,
          borderColor: Theme.border,
          border: true,
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 2,
          paddingRight: 2,
          gap: 1,
          flexDirection: "column",
        }}
      >
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
              attributes={
                active === "confirm" ? TextAttributes.BOLD : undefined
              }
            >
              {confirmText}
            </text>
          </box>
        </box>
      </box>
    </box>
  );
};
