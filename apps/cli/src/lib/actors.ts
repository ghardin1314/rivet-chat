import type { registry } from "@rivetchat/core/types";
import { createClient, createRivetKit } from "@rivetkit/react";

const client = createClient<typeof registry>("http://localhost:3000");
const { useActor } = createRivetKit(client);

export { useActor };
