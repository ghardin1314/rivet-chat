import {
  InputRenderable,
  ScrollBoxRenderable,
  type ParsedKey,
} from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "../providers/chat-provider";
import { useFocus } from "../providers/focus-provider";
import type { Message } from "../types";
import { InputArea } from "./input-area";
import { MessageList } from "./message-list";

const MOCK_USERS = ["Alice", "Bob", "Charlie", "You"];

const now = new Date();

const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: "1-1",
      sender: "Alice",
      content: "Hey everyone! Welcome to the chat!",
      timestamp: new Date(now.getTime() - 300000),
      isOwn: false,
    },
    {
      id: "1-2",
      sender: "Bob",
      content: "Thanks! This TUI looks great 🎉",
      timestamp: new Date(now.getTime() - 240000),
      isOwn: false,
    },
    {
      id: "1-3",
      sender: "You",
      content: "Thanks! Built with OpenTUI",
      timestamp: new Date(now.getTime() - 180000),
      isOwn: true,
    },
    {
      id: "1-4",
      sender: "Charlie",
      content: "Very cool! How does the message sending work?",
      timestamp: new Date(now.getTime() - 120000),
      isOwn: false,
    },
  ],
  "2": [
    {
      id: "2-1",
      sender: "Alice",
      content: "Anyone working on interesting projects?",
      timestamp: new Date(now.getTime() - 500000),
      isOwn: false,
    },
    {
      id: "2-2",
      sender: "You",
      content: "Building a chat app with Party",
      timestamp: new Date(now.getTime() - 400000),
      isOwn: true,
    },
    {
      id: "2-3",
      sender: "Bob",
      content: "That's interesting!",
      timestamp: new Date(now.getTime() - 300000),
      isOwn: false,
    },
  ],
  "3": [
    {
      id: "3-1",
      sender: "Charlie",
      content: "LOL!",
      timestamp: new Date(now.getTime() - 100000),
      isOwn: false,
    },
  ],
};

export const ChatWindow = () => {
  const { activeChatId } = useChat();
  const { focusedSlug } = useFocus();
  const [chatMessages, setChatMessages] =
    useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRenderable>(null);
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  const messages = useMemo(
    () => chatMessages[activeChatId] || [],
    [chatMessages, activeChatId]
  );

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

    setChatMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage],
    }));
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

        setChatMessages((prev) => ({
          ...prev,
          [activeChatId]: [...(prev[activeChatId] || []), responseMessage],
        }));
      },
      1000 + Math.random() * 1000
    );
  }, [inputValue, activeChatId]);

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
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
    <box flexGrow={1} flexDirection="column">
      <MessageList messages={messages} scrollRef={scrollRef} />

      <InputArea
        inputRef={inputRef}
        value={inputValue}
        onInput={setInputValue}
        onSubmit={handleSubmit}
      />
    </box>
  );
};
