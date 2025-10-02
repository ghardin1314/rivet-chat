import { inArray } from "drizzle-orm";
import { actor } from "rivetkit";
import { db } from "../db";
import { user } from "../schema/auth";
import type { AuthConnParams } from "./prelude";

export type Message = { sender: string; text: string; timestamp: number };
export type MessageWithUser = {
  sender: { id: string; username: string | null };
  text: string;
  timestamp: number;
};

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

    getHistory: async (c) => {
      // Get unique sender IDs from messages
      const senderIds = [...new Set(c.state.messages.map((m) => m.sender))];

      if (senderIds.length === 0) {
        return [];
      }

      // Fetch all users from database
      const users = await db
        .select({ id: user.id, username: user.username })
        .from(user)
        .where(inArray(user.id, senderIds));

      // Create a map for quick lookup
      const userMap = new Map(users.map((u) => [u.id, u]));

      // Map messages to include user objects
      return c.state.messages.map((message) => ({
        sender: userMap.get(message.sender) || {
          id: message.sender,
          username: null,
        },
        text: message.text,
        timestamp: message.timestamp,
      })) as MessageWithUser[];
    },
  },
});
