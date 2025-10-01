import { actor } from "rivetkit";
import type { AuthConnParams } from "./prelude";
import { validateAuth } from "./prelude";

export type ChatRoom = {
  id: string;
  name: string;
  createdAt: Date;
};

export const chatManifest = actor({
  onBeforeConnect: async (_, opts, params: AuthConnParams) => {
    await validateAuth(params, { request: opts.request });
  },
  state: {
    chats: {} as Record<string, ChatRoom>,
  },
  actions: {
    createChat: (c, name: string) => {
      const chat = { id: crypto.randomUUID(), name, createdAt: new Date() };
      c.state.chats[chat.id] = chat;
      return chat;
    },
    listChats: (c) => Object.values(c.state.chats),
  },
});
