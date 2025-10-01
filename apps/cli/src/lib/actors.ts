import type { registry } from "@rivetchat/core/types";
import { createClient, createRivetKit } from "@rivetkit/react";

export const rivetClient = createClient<typeof registry>({
  endpoint: "http://127.0.0.1:6420",
});
const kit = createRivetKit(rivetClient);

export const { useActor } = kit;
