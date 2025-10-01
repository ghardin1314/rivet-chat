import { TextAttributes } from "@opentui/core";
import { useSession } from "../hooks/use-session";
import { Theme } from "../theme";
import type { KeyBinding } from "../types";

interface StatusBarProps {
  focusedPanel: string | null;
}

const getKeyBindings = (panel: string | null): KeyBinding[] => {
  const common: KeyBinding[] = [
    { key: "tab", description: "next panel" },
    { key: "shift+tab", description: "prev panel" },
    { key: "q", description: "quit" },
  ];

  switch (panel) {
    case "messages":
      return [
        { key: "j/k", description: "scroll" },
        { key: "i", description: "insert" },
        ...common,
      ];
    case "sidebar":
      return [{ key: "j/k", description: "navigate" }, ...common];
    case "input":
      return [
        { key: "enter", description: "send" },
        { key: "esc", description: "cancel" },
        ...common,
      ];
    default:
      return common;
  }
};

export const StatusBar = ({ focusedPanel }: StatusBarProps) => {
  const bindings = getKeyBindings(focusedPanel);
  const { data } = useSession();

  return (
    <box
      height={1}
      flexShrink={0}
      paddingLeft={1}
      paddingRight={1}
      flexDirection="row"
      justifyContent="space-between"
      gap={2}
    >
      <box flexDirection="row" gap={2}>
        {bindings.map((binding, idx) => (
          <box key={idx} flexDirection="row" gap={1}>
            <text fg={Theme.primary} attributes={TextAttributes.BOLD}>
              {binding.key}
            </text>
            <text fg={Theme.textMuted}>{binding.description}</text>
          </box>
        ))}
      </box>
      <box flexDirection="row" gap={2}>
        <text fg={Theme.textMuted}>{data ? data.user.name : "Guest"}</text>
        <text fg={Theme.textMuted}>Rivet Chat</text>
      </box>
    </box>
  );
};
