import { type ParsedKey } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSession } from "../hooks/use-session";
import { useActor } from "../lib/actors";
import { useFocus } from "../providers/focus-provider";
import { useModal, CreateChatModalKey } from "../providers/modal-provider";

export const CreateChatHandler = () => {
  const { data } = useSession();
  const { focusedSlug } = useFocus();
  const modal = useModal();

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

  const handleCreateChat = useCallback(
    async (name: string) => {
      await chatManifest.connection?.action({
        name: "createChat",
        args: [name],
      });
      chats.refetch();
    },
    [chatManifest.connection, chats]
  );

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      if (focusedSlug === "chats" && evt.name === "n") {
        modal({ type: CreateChatModalKey, data: { onConfirm: handleCreateChat } });
      }
    },
    [focusedSlug, modal, handleCreateChat]
  );

  useKeyboard(handleKeyboard);

  return null;
};
