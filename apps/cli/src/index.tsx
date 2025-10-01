import { InputRenderable, RGBA, ScrollBoxRenderable, TextAttributes } from "@opentui/core";
import { render, useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

const MOCK_USERS = ["Alice", "Bob", "Charlie", "You"];

const App = () => {
  const dimensions = useTerminalDimensions();
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
  const [inputValue, setInputValue] = useState("");
  const [activeUsers] = useState(["Alice", "Bob", "Charlie", "You"]);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const inputRef = useRef<InputRenderable>(null);
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const lastCtrlCRef = useRef<number>(0);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
    setTimeout(() => {
      const responders = MOCK_USERS.filter((u) => u !== "You");
      const randomResponder = responders[Math.floor(Math.random() * responders.length)];
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
    }, 1000 + Math.random() * 1000);
  }, [inputValue]);

  const handleKeyboard = useCallback(
    (evt: any) => {
      if (evt.name === "escape") {
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }

      // Handle Ctrl+C: first press clears input, second press exits
      if (evt.ctrl && evt.name === "c") {
        const now = Date.now();
        const timeSinceLastPress = now - lastCtrlCRef.current;

        if (timeSinceLastPress < 500) {
          // Double press within 500ms - exit
          process.exit(0);
        } else {
          // First press - clear input and show exit prompt
          setInputValue("");
          setShowExitPrompt(true);
          lastCtrlCRef.current = now;

          // Clear exit prompt after 500ms
          setTimeout(() => {
            setShowExitPrompt(false);
          }, 500);
        }
      }
    },
    []
  );

  useKeyboard(handleKeyboard);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const Theme = {
    background: "#0a0a0a",
    backgroundPanel: "#1a1a1a",
    border: "#333333",
    primary: "#6366f1",
    accent: "#8b5cf6",
    text: "#e5e5e5",
    textMuted: "#a1a1a1",
    success: "#22c55e",
    own: "#3b82f6",
  };

  return (
    <box
      width={dimensions.width}
      height={dimensions.height}
      backgroundColor={RGBA.fromHex(Theme.background)}
      flexDirection="column"
    >
      {/* Header */}
      <box
        height={3}
        borderColor={RGBA.fromHex(Theme.border)}
        backgroundColor={RGBA.fromHex(Theme.backgroundPanel)}
        paddingLeft={2}
        paddingRight={2}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <box flexDirection="row" gap={2}>
          <text fg={Theme.primary} attributes={TextAttributes.BOLD}>
            💬 Rivet Chat
          </text>
          <text fg={Theme.textMuted}>
            {activeUsers.length} online
          </text>
        </box>
        <text fg={Theme.textMuted} attributes={TextAttributes.DIM}>
          esc to blur • ctrl+c to clear • ctrl+c x2 to exit
        </text>
      </box>

      {/* Messages Area */}
      <box flexGrow={1} flexDirection="row">
        {/* Main Chat */}
        <box flexGrow={1} flexDirection="column">
          <scrollbox
            ref={scrollRef}
            flexGrow={1}
            paddingLeft={2}
            paddingRight={2}
            paddingTop={1}
            backgroundColor={RGBA.fromHex(Theme.background)}
            scrollbarOptions={{ visible: false }}
          >
            {messages.map((message) => (
              <box key={message.id} paddingBottom={1}>
                <box flexDirection="row" gap={1} alignItems="center">
                  <text
                    fg={message.isOwn ? Theme.own : Theme.primary}
                    attributes={TextAttributes.BOLD}
                  >
                    {message.sender}
                  </text>
                  <text fg={Theme.textMuted} attributes={TextAttributes.DIM}>
                    {formatTime(message.timestamp)}
                  </text>
                </box>
                <box paddingLeft={2}>
                  <text fg={Theme.text}>{message.content}</text>
                </box>
              </box>
            ))}
          </scrollbox>

          {/* Input Area */}
          <box
            flexShrink={0}
            borderColor={RGBA.fromHex(Theme.border)}
            backgroundColor={RGBA.fromHex(Theme.backgroundPanel)}
            paddingLeft={2}
            paddingRight={2}
            paddingBottom={1}
          >
            <input
              ref={inputRef}
              value={inputValue}
              onInput={setInputValue}
              onSubmit={handleSubmit}
              placeholder="Type a message..."
              focusedBackgroundColor={RGBA.fromHex(Theme.backgroundPanel)}
              cursorColor={RGBA.fromHex(Theme.primary)}
              focusedTextColor={RGBA.fromHex(Theme.text)}
            />
          </box>

          {/* Status Message */}
          <box
            height={1}
            flexShrink={0}
            backgroundColor={RGBA.fromHex(Theme.backgroundPanel)}
            paddingLeft={2}
            paddingRight={2}
            paddingBottom={1}
          >
            {showExitPrompt && (
              <text fg={Theme.textMuted} attributes={TextAttributes.DIM}>
                Press Ctrl+C again to exit
              </text>
            )}
          </box>
        </box>

        {/* Sidebar */}
        <box
          width={20}
          borderColor={RGBA.fromHex(Theme.border)}
          backgroundColor={RGBA.fromHex(Theme.backgroundPanel)}
          paddingTop={1}
          paddingLeft={1}
          paddingRight={1}
        >
          <text fg={Theme.textMuted} attributes={TextAttributes.BOLD}>
            Online ({activeUsers.length})
          </text>
          <box paddingTop={1} gap={1}>
            {activeUsers.map((user) => (
              <box key={user} flexDirection="row" gap={1} alignItems="center">
                <text fg={Theme.success}>●</text>
                <text fg={user === "You" ? Theme.own : Theme.text}>{user}</text>
              </box>
            ))}
          </box>
        </box>
      </box>
    </box>
  );
};

await render(<App />, {
  targetFps: 60,
  exitOnCtrlC: false,
  useKittyKeyboard: true,
});
