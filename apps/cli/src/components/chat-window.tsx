import { InputRenderable, ScrollBoxRenderable } from "@opentui/core";
import type { Message as RivetMessage } from "@rivetchat/core/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLog } from "../hooks/use-log";
import { useSession } from "../hooks/use-session";
import { useActor } from "../lib/actors";
import { useChat } from "../providers/chat-provider";
import { useFocus } from "../providers/focus-provider";
import type { Message } from "../types";
import { InputArea } from "./input-area";
import { MessageList } from "./message-list";

export const ChatWindow = () => {
  const { activeChatId } = useChat();
  const { focusedSlug } = useFocus();
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRenderable>(null);
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const log = useLog();

  // Connect to the chat room actor
  const chatRoom = useActor({
    name: "chatRoom",
    key: activeChatId,
    params: {
      user: session?.user,
    },
    enabled: !!activeChatId && !!session,
  });

  // Fetch message history
  const messagesQuery = useQuery({
    queryKey: ["messages", activeChatId],
    queryFn: () =>
      chatRoom.connection?.action({
        name: "getHistory",
        args: [],
      }),
    enabled: !!chatRoom.isConnected,
  });

  // Listen for new messages and refetch
  chatRoom.useEvent("newMessage", () => {
    messagesQuery.refetch();
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    onMutate: () => {
      setInputValue("");
    },
    mutationFn: async (text: string) => {
      await chatRoom.connection!.action({
        name: "sendMessage",
        args: [text],
      });
    },
    onSuccess: (response) => {
      log.info("Message sent", response);
      messagesQuery.refetch();
    },
    onError: (error, originalText) => {
      log.error("Error sending message", error);
      setInputValue(originalText);
      setTimeout(() => {
        inputRef.current?.focus(); // TODO: Focus at end of input
        inputRef.current!.cursorPosition = originalText.length;
      }, 0);
    },
  });

  // Format messages for display
  const messages: Message[] = (messagesQuery.data || []).map(
    (msg: RivetMessage) => ({
      id: `${msg.timestamp}`,
      sender: msg.sender,
      content: msg.text,
      timestamp: new Date(msg.timestamp),
      isOwn: msg.sender === session?.user?.id,
    })
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
    if (!inputValue.trim() || !chatRoom.connection) return;

    sendMessageMutation.mutate(inputValue);
  }, [inputValue, chatRoom.connection, sendMessageMutation]);

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
