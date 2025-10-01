import { RGBA, type ParsedKey } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useCallback } from "react";
import { ChatList } from "../components/chat-list";
import { ChatWindow } from "../components/chat-window";
import { LogoutHandler } from "../components/logout-handler";
import { StatusBar } from "../components/status-bar";
import { useFocus } from "../providers/focus-provider";
import { Theme } from "../theme";

export const HomeRoute = () => {
  const dimensions = useTerminalDimensions();
  const { focusedSlug } = useFocus();

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      // Quit
      if (evt.name === "q" && focusedSlug !== "input") {
        process.exit(0);
      }
    },
    [focusedSlug]
  );

  useKeyboard(handleKeyboard);

  return (
    <box
      width={dimensions.width}
      height={dimensions.height}
      backgroundColor={RGBA.fromHex(Theme.background)}
      flexDirection="column"
      paddingBottom={1}
      paddingTop={1}
    >
      {/* Messages Area */}
      <box flexGrow={1} flexDirection="row">
        <ChatList />
        <ChatWindow />
      </box>

      <StatusBar focusedPanel={focusedSlug} />

      <LogoutHandler />
    </box>
  );
};
