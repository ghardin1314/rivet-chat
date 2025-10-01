import { TextAttributes, type ParsedKey } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useCallback } from "react";
import { useChat } from "../providers/chat-provider";
import { useFocus } from "../providers/focus-provider";
import { Theme } from "../theme";
import { Section } from "./section";

export interface Chat {
  id: string;
  name: string;
}

export const CHATS: Chat[] = [
  { id: "1", name: "General" },
  { id: "2", name: "Tech Talk" },
  { id: "3", name: "Random" },
];

export const ChatList = () => {
  const { activeChatId, setActiveChatId } = useChat();
  const { focusedSlug } = useFocus();

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      if (focusedSlug === "chats") {
        const currentIndex = CHATS.findIndex((chat) => chat.id === activeChatId);
        if (evt.name === "j" || evt.name === "down") {
          const nextIndex = (currentIndex + 1) % CHATS.length;
          setActiveChatId(CHATS[nextIndex].id);
        } else if (evt.name === "k" || evt.name === "up") {
          const prevIndex = (currentIndex - 1 + CHATS.length) % CHATS.length;
          setActiveChatId(CHATS[prevIndex].id);
        }
      }
    },
    [focusedSlug, activeChatId, setActiveChatId]
  );

  useKeyboard(handleKeyboard);

  return (
    <Section title="Chats" focusIndex={1} focusSlug="chats" width={25}>
      <box paddingLeft={1} paddingRight={1} paddingBottom={1} gap={1}>
        {CHATS.map((chat) => {
          const isActive = chat.id === activeChatId;
          return (
            <box
              key={chat.id}
              backgroundColor={isActive ? Theme.primary : undefined}
              paddingLeft={1}
              paddingRight={1}
              onMouseDown={() => setActiveChatId(chat.id)}
            >
              <text
                fg={isActive ? Theme.background : Theme.text}
                attributes={isActive ? TextAttributes.BOLD : undefined}
              >
                {chat.name}
              </text>
            </box>
          );
        })}
      </box>
    </Section>
  );
};
