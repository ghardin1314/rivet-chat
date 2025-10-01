import { setup } from "rivetkit";
import { chatManifest } from "./actors/chat-manifest";
import { chatRoom } from "./actors/chat-room";

export const registry = setup({
  use: { chatRoom, chatManifest },
});
