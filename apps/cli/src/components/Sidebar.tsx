import { RGBA, TextAttributes } from "@opentui/core";
import { Theme } from "../theme";

interface SidebarProps {
  activeUsers: string[];
  isFocused: boolean;
}

export const Sidebar = ({ activeUsers, isFocused }: SidebarProps) => {
  return (
    <box
      width={20}
      borderColor={RGBA.fromHex(isFocused ? Theme.borderFocused : Theme.border)}
      paddingLeft={1}
      paddingRight={1}
      flexDirection="column"
    >
      <box
        height={1}
        paddingTop={1}
      >
        <text
          fg={isFocused ? Theme.primary : Theme.textMuted}
          attributes={TextAttributes.BOLD}
        >
          Online ({activeUsers.length})
        </text>
      </box>
      <box paddingTop={1} paddingBottom={1} gap={1}>
        {activeUsers.map((user) => (
          <box key={user} flexDirection="row" gap={1} alignItems="center">
            <text fg={Theme.success}>●</text>
            <text fg={user === "You" ? Theme.own : Theme.text}>{user}</text>
          </box>
        ))}
      </box>
    </box>
  );
};
