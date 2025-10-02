import { RGBA } from "@opentui/core";
import { useTerminalDimensions } from "@opentui/react";
import { useCallback } from "react";
import { ChatList } from "../components/chat-list";
import { ChatWindow } from "../components/chat-window";
import { LogoutHandler } from "../components/logout-handler";
import { StatusBar } from "../components/status-bar";
import { useFocus } from "../providers/focus-provider";
import { useKeybindings } from "../providers/keybinding-provider";
import { useModal, HelpModalKey } from "../providers/modal-provider";
import { Theme } from "../theme";

export const HomeRoute = () => {
  const dimensions = useTerminalDimensions();
  const { focusedSlug } = useFocus();
  const modal = useModal();

  const handleQuit = useCallback(() => {
    if (focusedSlug !== "input") {
      process.exit(0);
    }
  }, [focusedSlug]);

  const handleHelp = useCallback(() => {
    modal({ type: HelpModalKey, data: {} });
  }, [modal]);

  useKeybindings([
    {
      keys: ["q"],
      description: "quit",
      handler: handleQuit,
      visible: false,
      priority: 100,
      category: "app",
    },
    {
      keys: ["?"],
      description: "help",
      handler: handleHelp,
      visible: true,
      priority: 0,
      category: "app",
    },
  ]);

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
