import { serve } from "@hono/node-server";
import { auth, registry } from "@rivetchat/core";
import { Hono } from "hono";

// Start Rivet with file system driver (for development)
const rivetRegistry = registry.start({});

const app = new Hono();

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

serve({
  fetch: app.fetch,
  port: 3000,
});
