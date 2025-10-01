import { TextAttributes, type ParsedKey } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useLog } from "../hooks/use-log";
import { useSession } from "../hooks/use-session";
import { useActor } from "../lib/actors";
import { useChat } from "../providers/chat-provider";
import { useFocus } from "../providers/focus-provider";
import { Theme } from "../theme";
import { CreateChatHandler } from "./create-chat-handler";
import { Section } from "./section";

export interface Chat {
  id: string;
  name: string;
}

export const ChatList = () => {
  const { activeChatId, setActiveChatId } = useChat();
  const { data } = useSession();
  const { focusedSlug } = useFocus();
  const log = useLog();
  // Works
  const chatManifest = useActor({
    name: "chatManifest",
    key: ["singleton"],
    params: {
      user: data?.user,
    },
    enabled: !!data,
  });
  const chats = useQuery({
    queryKey: ["chats"],
    queryFn: () =>
      chatManifest.connection?.action({
        name: "listChats",
        args: [],
      }),
    enabled: !!chatManifest.isConnected,
  });

  chatManifest.useEvent("newChat", (chat) => {
    chats.refetch();
  });

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      if (focusedSlug === "chats") {
        const currentIndex = chats.data?.findIndex(
          (chat) => chat.id === activeChatId
        );
        if (evt.name === "j" || evt.name === "down") {
          const nextIndex = (currentIndex + 1) % chats.data?.length;
          setActiveChatId(chats.data?.[nextIndex].id);
        } else if (evt.name === "k" || evt.name === "up") {
          const prevIndex =
            (currentIndex - 1 + chats.data?.length) % chats.data?.length;
          setActiveChatId(chats.data?.[prevIndex].id);
        }
      }
    },
    [focusedSlug, activeChatId, setActiveChatId, chats.data]
  );

  useKeyboard(handleKeyboard)
  
  log.debug("chats", { chats: chats.data });

  return (
    <>
      <Section title="Chats" focusIndex={1} focusSlug="chats" width={25}>
        <box paddingLeft={1} paddingRight={1} paddingBottom={1} gap={1}>
          {chats.data?.map((chat) => {
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
      <CreateChatHandler />
    </>
  );
};
