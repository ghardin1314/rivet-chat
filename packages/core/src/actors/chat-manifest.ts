import { actor } from "rivetkit";
import type { registry } from "../types";

export type ChatRoom = {
  id: string;
  name: string;
  createdAt: Date;
};

export const chatManifest = actor({
  //   onBeforeConnect: async (_, opts, params: AuthConnParams) => {
  //     await validateAuth(params, { request: opts.request });
  //   },
  state: {
    chats: {} as Record<string, ChatRoom>,
  },
  actions: {
    createChat: (c, name: string) => {
      const client = c.client<typeof registry>();

      const id = crypto.randomUUID();

      const chatRoom = client.chatRoom.getOrCreate(id);

      const chat = { id, name, createdAt: new Date() };
      c.state.chats[chat.id] = chat;

      c.broadcast("newChat", chat);
      return chat;
    },
    listChats: (c) => Object.values(c.state.chats),
  },
});
