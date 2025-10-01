import { Hono } from "hono";
import { auth } from "./auth";

const app = new Hono();
app.get("/", (c) => c.text("Hello Bun!"));

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default app;
