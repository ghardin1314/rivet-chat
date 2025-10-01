import { TextAttributes, type ParsedKey } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useLog } from "../hooks/use-log";
import { useSession } from "../hooks/use-session";
import { rivetClient, useActor } from "../lib/actors";
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
  const { data } = useSession();
  const { focusedSlug } = useFocus();
  const log = useLog();

  // Works
  const { data: chatList } = useQuery({
    queryKey: ["chatManifest"],
    queryFn: async () => {
      try {
        // put Id here manually
        const chatManifest =  rivetClient.chatManifest.getForId("44c0a0969087fcd4")
        const res = await chatManifest.action({
            name: "listChats",
            args: [],
        })
        return {
          success: true,
          data: res,
        };
      } catch (error) {
        log.error("Error fetching chat manifest", error);
        return null;
      }
    },
    enabled: !!data,
  });
  // Doesn't work
  const chatManifest = useActor({
    name: "chatManifest",
    key: ["singleton"],
    // params: {
    //   user: data?.user,
    // },
    // enabled: !!data,
  });
  log.debug("Chat manifest", chatManifest);
  log.debug("Chat manifest data", chatList);

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      if (focusedSlug === "chats") {
        const currentIndex = CHATS.findIndex(
          (chat) => chat.id === activeChatId
        );
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
