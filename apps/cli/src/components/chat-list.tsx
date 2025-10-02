import { TextAttributes } from "@opentui/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useLog } from "../hooks/use-log";
import { useSession } from "../hooks/use-session";
import { useActor } from "../lib/actors";
import { useChat } from "../providers/chat-provider";
import { useFocus } from "../providers/focus-provider";
import { useKeybindings } from "../providers/keybinding-provider";
import { CreateChatModalKey, useModal } from "../providers/modal-provider";
import { Theme } from "../theme";
import { Section } from "./section";

export interface Chat {
  id: string;
  name: string;
}

export const ChatList = () => {
  const { activeChatId, setActiveChatId } = useChat();
  const { data } = useSession();
  const { focusedSlug, setFocusedSlug } = useFocus();
  const modal = useModal();
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

  // Set active chat to first chat on initial load
  useEffect(() => {
    if (chats.data && chats.data.length > 0 && !activeChatId) {
      setActiveChatId(chats.data[0].id);
    }
  }, [chats.data, activeChatId, setActiveChatId]);

  const handleCreateChat = useCallback(
    async (name: string) => {
      const newChat = await chatManifest.connection?.action({
        name: "createChat",
        args: [name],
      });
      chats.refetch();
      if (newChat) {
        setActiveChatId(newChat.id);
      }
    },
    [chatManifest.connection, chats, setActiveChatId]
  );

  const handleCreateChatModal = useCallback(() => {
    modal({ type: CreateChatModalKey, data: { onConfirm: handleCreateChat } });
  }, [modal, handleCreateChat]);

  const handleNavigateChat = useCallback(
    (key?: string) => {
      const currentIndex = chats.data?.findIndex(
        (chat) => chat.id === activeChatId
      );

      if (key === "j") {
        const nextIndex = ((currentIndex ?? 0) + 1) % (chats.data?.length ?? 1);
        setActiveChatId(chats.data?.[nextIndex].id);
      } else if (key === "k") {
        const prevIndex =
          ((currentIndex ?? 0) - 1 + (chats.data?.length ?? 1)) %
          (chats.data?.length ?? 1);
        setActiveChatId(chats.data?.[prevIndex].id);
      }
    },
    [activeChatId, setActiveChatId, chats.data]
  );

  const handleSelectChat = useCallback(() => {
    setFocusedSlug("input");
  }, [setFocusedSlug]);

  useKeybindings([
    {
      keys: ["n"],
      description: "new chat",
      handler: handleCreateChatModal,
      visible: true,
      active: focusedSlug === "chats",
      priority: 70,
      category: "chats",
    },
    {
      keys: ["j", "k"],
      description: "navigate",
      handler: handleNavigateChat,
      visible: true,
      active: focusedSlug === "chats",
      priority: 69,
      category: "chats",
    },
    {
      keys: ["return"],
      description: "select",
      handler: handleSelectChat,
      visible: true,
      active: focusedSlug === "chats",
      priority: 68,
      category: "chats",
    },
  ]);

  return (
    <>
      <Section
        title="Chats"
        focusIndex={0}
        focusSlug="chats"
        width={focusedSlug === "chats" ? 40 : 25}
      >
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
    </>
  );
};
