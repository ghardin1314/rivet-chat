import { betterAuth } from "better-auth";
import { bearer, username } from "better-auth/plugins";
import { Database } from "bun:sqlite";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), bearer()],
});
