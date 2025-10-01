import { RGBA } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useCallback, useState } from "react";
import { useLog } from "../hooks/use-log";
import { authClient } from "../lib/auth";
import { useRouter } from "../providers/router-provider";
import { Theme } from "../theme";

export const SignInRoute = () => {
  const dimensions = useTerminalDimensions();
  const { info, error } = useLog();
  const { navigate } = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"username" | "password">("username");

  useKeyboard((key) => {
    if (key.name === "q") {
      process.exit(0);
    }

    if (key.name === "tab") {
      setFocused((prev) => (prev === "username" ? "password" : "username"));
    }
  });

  const handleSubmit = useCallback(async () => {
    if (!username.trim() || !password.trim()) return;

    try {
      const response = await authClient.signIn.username({
        username,
        password,
      });

      if (response.error) {
        error("Signin failed", response.error);
        return;
      }

      info("Signin successful", response);
      navigate("home");
    } catch (err) {
      error("Signin failed", err);
    }

    navigate("home");
  }, [username, password, navigate, info, error]);

  return (
    <box
      style={{
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: RGBA.fromHex(Theme.background),
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <box
        style={{ border: true, padding: 2, flexDirection: "column", gap: 1 }}
      >
        <text fg={Theme.primary}>Sign In</text>

        <box title="Username" style={{ border: true, width: 40, height: 3 }}>
          <input
            placeholder="Enter username..."
            onInput={setUsername}
            onSubmit={handleSubmit}
            focused={focused === "username"}
          />
        </box>

        <box title="Password" style={{ border: true, width: 40, height: 3 }}>
          <input
            placeholder="Enter password..."
            onInput={setPassword}
            onSubmit={handleSubmit}
            focused={focused === "password"}
          />
        </box>

        <text fg={Theme.textMuted}>Tab: Switch | Enter: Submit | Q: Quit</text>
      </box>
    </box>
  );
};
