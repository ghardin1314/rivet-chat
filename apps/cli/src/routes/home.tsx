import {
  InputRenderable,
  RGBA,
  ScrollBoxRenderable,
  type ParsedKey,
} from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConfirmationDialog } from "../components/confirmation-dialog";
import { InputArea } from "../components/input-area";
import { MessageList } from "../components/message-list";
import { Sidebar } from "../components/sidebar";
import { StatusBar } from "../components/status-bar";
import { authClient } from "../lib/auth";
import { clearAuthToken } from "../lib/credentials";
import { useFocus } from "../providers/focus-provider";
import { useRouter } from "../providers/router-provider";
import { Theme } from "../theme";
import type { Message } from "../types";

const MOCK_USERS = ["Alice", "Bob", "Charlie", "You"];

export const HomeRoute = () => {
  const dimensions = useTerminalDimensions();
  const { focusedSlug } = useFocus();
  const { navigate } = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Alice",
      content: "Hey everyone! Welcome to the chat!",
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
    },
    {
      id: "2",
      sender: "Bob",
      content: "Thanks! This TUI looks great 🎉",
      timestamp: new Date(Date.now() - 240000),
      isOwn: false,
    },
    {
      id: "3",
      sender: "You",
      content: "Thanks! Built with OpenTUI",
      timestamp: new Date(Date.now() - 180000),
      isOwn: true,
    },
    {
      id: "4",
      sender: "Charlie",
      content: "Very cool! How does the message sending work?",
      timestamp: new Date(Date.now() - 120000),
      isOwn: false,
    },
  ]);
  const [activeUsers] = useState(["Alice", "Bob", "Charlie", "You"]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRenderable>(null);
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  useEffect(() => {
    if (focusedSlug === "input" && inputRef.current) {
      inputRef.current.focus();
    } else if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [focusedSlug]);

  useEffect(() => {
    // Defer scroll to allow layout to update
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo(999999);
      }
    }, 0);
  }, [messages]);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: inputValue,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate a response after 1-2 seconds
    setTimeout(
      () => {
        const responders = MOCK_USERS.filter((u) => u !== "You");
        const randomResponder =
          responders[Math.floor(Math.random() * responders.length)];
        const responses = [
          "That's interesting!",
          "I agree with that",
          "Makes sense to me",
          "Good point!",
          "Thanks for sharing!",
          "Absolutely!",
          "I was just thinking the same thing",
        ];

        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: randomResponder,
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          isOwn: false,
        };

        setMessages((prev) => [...prev, responseMessage]);
      },
      1000 + Math.random() * 1000
    );
  }, [inputValue]);

  const handleLogout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      // Ignore signOut errors, just clear locally
    }
    await clearAuthToken();
    navigate("signin");
  }, [navigate]);

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      // Logout
      if (evt.ctrl && evt.name === "l") {
        setShowLogoutDialog(true);
        return;
      }

      // Quit
      if (evt.name === "q" && focusedSlug !== "input") {
        process.exit(0);
      }

      // Vim-style navigation in messages panel
      if (focusedSlug === "messages") {
        if (evt.name === "j") {
          scrollRef.current?.scrollBy(3);
        } else if (evt.name === "k") {
          scrollRef.current?.scrollBy(-3);
        }
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
        {/* Main Chat */}
        <box flexGrow={1} flexDirection="column">
          <MessageList messages={messages} scrollRef={scrollRef} />

          <InputArea
            inputRef={inputRef}
            value={inputValue}
            onInput={setInputValue}
            onSubmit={handleSubmit}
          />
        </box>

        <Sidebar activeUsers={activeUsers} />
      </box>

      <StatusBar focusedPanel={focusedSlug} />

      {showLogoutDialog && (
        <ConfirmationDialog
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={handleLogout}
          onClose={() => setShowLogoutDialog(false)}
        />
      )}
    </box>
  );
};
