import { Theme } from "../theme";
import { Section } from "./section";

interface SidebarProps {
  activeUsers: string[];
}

export const Sidebar = ({ activeUsers }: SidebarProps) => {
  return (
    <Section
      title={`Online (${activeUsers.length})`}
      focusIndex={1}
      focusSlug="sidebar"
      width={20}
    >
      <box paddingLeft={1} paddingRight={1} paddingBottom={1} gap={1}>
        {activeUsers.map((user) => (
          <box key={user} flexDirection="row" gap={1} alignItems="center">
            <text fg={Theme.success}>●</text>
            <text fg={user === "You" ? Theme.own : Theme.text}>{user}</text>
          </box>
        ))}
      </box>
    </Section>
  );
};
