import { serve } from "@hono/node-server";
import { auth, registry } from "@rivetchat/core";
import { Hono } from "hono";

// Start Rivet with file system driver (for development)
const rivetRegistry = registry.start({
  disableServer: true,
});

const app = new Hono();
app.get("/", (c) => c.text("Hello Bun!"));

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.all("/api/rivet/*", (c) => rivetRegistry.fetch(c.req.raw));

serve(app);
