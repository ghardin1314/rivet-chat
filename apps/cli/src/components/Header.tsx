import { RGBA, TextAttributes } from "@opentui/core";
import { Theme } from "../theme";

interface HeaderProps {
  activeUsersCount: number;
}

export const Header = ({ activeUsersCount }: HeaderProps) => {
  return (
    <box
      height={1}
      flexShrink={0}
      paddingLeft={1}
      paddingRight={1}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <text fg={Theme.primary} attributes={TextAttributes.BOLD}>
        Rivet Chat
      </text>
      <text fg={Theme.textMuted} attributes={TextAttributes.DIM}>
        {activeUsersCount} online
      </text>
    </box>
  );
};
