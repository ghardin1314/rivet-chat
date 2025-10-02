import { TextAttributes } from "@opentui/core";
import { useSession } from "../hooks/use-session";
import { useKeybindingContext } from "../providers/keybinding-provider";
import { Theme } from "../theme";

interface StatusBarProps {
  focusedPanel: string | null;
}

export const StatusBar = ({ focusedPanel }: StatusBarProps) => {
  const { getVisibleKeybindings } = useKeybindingContext();
  const bindings = getVisibleKeybindings();
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
