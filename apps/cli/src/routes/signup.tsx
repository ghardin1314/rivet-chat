import { RGBA } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useCallback, useState } from "react";
import { useLog } from "../hooks/useLog";
import { authClient } from "../lib/auth";
import { useRouter } from "../providers/router-provider";
import { Theme } from "../theme";

export const SignUpRoute = () => {
  const dimensions = useTerminalDimensions();
  const { navigate } = useRouter();
  const { info, error } = useLog();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [focused, setFocused] = useState<"username" | "email" | "password">(
    "username"
  );

  useKeyboard((key) => {
    if (key.name === "q") {
      process.exit(0);
    }

    if (key.name === "tab") {
      const fields = ["username", "email", "password"] as const;
      const currentIndex = fields.indexOf(focused);
      const nextIndex = (currentIndex + 1) % fields.length;
      setFocused(fields[nextIndex]);
    }
  });

  const handleSubmit = useCallback(async () => {
    if (!username.trim() || !email.trim() || !password.trim()) return;

    info("Attempting signup", { username, email });
    try {
      const response = await authClient.signUp.email({
        email,
        password,
        username,
        name: username,
      });

      if (response.error) {
        error("Signup failed", response.error);
        return;
      }

      info("Signup successful", response);
      navigate("home");
    } catch (err) {
      error("Signup failed", err);
    }
  }, [username, email, password, navigate, info, error]);

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
        <text fg={Theme.primary}>Sign Up</text>

        <box title="Username" style={{ border: true, width: 40, height: 3 }}>
          <input
            placeholder="Enter username..."
            onInput={setUsername}
            onSubmit={handleSubmit}
            focused={focused === "username"}
          />
        </box>

        <box title="Email" style={{ border: true, width: 40, height: 3 }}>
          <input
            placeholder="Enter email..."
            onInput={setEmail}
            onSubmit={handleSubmit}
            focused={focused === "email"}
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
