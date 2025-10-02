import { betterAuth } from "better-auth";
import { bearer, username } from "better-auth/plugins";
import { db } from "./db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), bearer()],
});
