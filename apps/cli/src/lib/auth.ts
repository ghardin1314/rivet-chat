import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { writeLog } from "../hooks/useLog";
import { getAuthToken, saveAuthToken } from "./credentials";

export const authClient = createAuthClient({
  plugins: [usernameClient()],
  baseURL: "http://localhost:3000",
  fetchOptions: {
    onSuccess: async (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token");

      if (authToken) {
        writeLog({
          timestamp: new Date().toISOString(),
          level: "debug",
          message: "Saving Auth Token",
        });
        await saveAuthToken(authToken);
      }
    },
    auth: {
      type: "Bearer",
      token: async () => {
        const token = await getAuthToken();
        writeLog({
          timestamp: new Date().toISOString(),
          level: "debug",
          message: "Fetching Auth Token",
          data: {
            found: !!token,
          },
        });
        return token ?? "";
      },
    },
  },
});
