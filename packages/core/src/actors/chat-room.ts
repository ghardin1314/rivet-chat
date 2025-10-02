import { actor } from "rivetkit";
import type { AuthConnParams } from "./prelude";
import { validateAuth } from "./prelude";

export type Message = { sender: string; text: string; timestamp: number };

export const chatRoom = actor({
  onBeforeConnect: async (_, opts, params: AuthConnParams) => {
    // await validateAuth(params, { request: opts.request });
  },
  // Persistent state that survives restarts: https://rivet.gg/docs/actors/state
  state: {
    messages: [] as Message[],
  },

  actions: {
    // Callable functions from clients: https://rivet.gg/docs/actors/actions
    sendMessage: (c, text: string) => {
      const sender = c.conn.params.user.id;
      const message = { sender, text, timestamp: Date.now() };
      // State changes are automatically persisted
      c.state.messages.push(message);
      // Send events to all connected clients: https://rivet.gg/docs/actors/events
      c.broadcast("newMessage", message);
      return message;
    },

    getHistory: (c) => c.state.messages,
  },
});
