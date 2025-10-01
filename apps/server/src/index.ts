import { auth, registry } from "@rivetchat/core";
import { Hono } from "hono";

// Start Rivet with file system driver (for development)
const { client } = registry.start();

const app = new Hono();
app.get("/", (c) => c.text("Hello Bun!"));

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default app;
