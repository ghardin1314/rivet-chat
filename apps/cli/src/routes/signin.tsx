import { RGBA } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { PasswordInput } from "../components/password-input";
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

  const signInMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await authClient.signIn.username({
        username,
        password,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },

    onMutate: () => {
      info("Signing in", { username });
    },
    onSuccess: (data) => {
      info("Signin successful", data);
      navigate("home");
    },
    onError: (err) => {
      error("Signin failed", err);
    },
  });

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") {
      process.exit(0);
    }

    if (key.name === "escape") {
      navigate("signup");
    }

    if (key.name === "tab" || key.name === "up" || key.name === "down") {
      setFocused((prev) => (prev === "username" ? "password" : "username"));
    }
  });

  const handleSubmit = useCallback(() => {
    if (!username.trim() || !password.trim() || signInMutation.isPending)
      return;
    signInMutation.mutate({ username, password });
  }, [username, password, signInMutation]);

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
        style={{
          border: true,
          padding: 2,
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
        }}
      >
        <ascii-font
          text="Rivet Chat"
          font="block"
          fg={RGBA.fromHex(Theme.primary)}
        />
        <box style={{ minHeight: 1 }}>
          {signInMutation.isPending ? (
            <text fg={Theme.primary}>Signing in...</text>
          ) : signInMutation.isError ? (
            <text fg={Theme.warning}>
              {signInMutation.error?.message || "Sign in failed"}
            </text>
          ) : (
            <text fg={Theme.textMuted}>Sign In</text>
          )}
        </box>

        <box
          onMouseDown={() => setFocused("username")}
          title="Username"
          style={{
            border: true,
            width: 40,
            height: 3,
            borderColor: signInMutation.isPending ? Theme.textMuted : undefined,
          }}
        >
          <input
            placeholder="Enter username..."
            onInput={setUsername}
            onSubmit={handleSubmit}
            focused={focused === "username" && !signInMutation.isPending}
          />
        </box>

        <box
          onMouseDown={() => setFocused("password")}
          title="Password"
          style={{
            border: true,
            width: 40,
            height: 3,
            borderColor: signInMutation.isPending ? Theme.textMuted : undefined,
          }}
        >
          <PasswordInput
            placeholder="Enter password..."
            onInput={setPassword}
            onSubmit={handleSubmit}
            focused={focused === "password" && !signInMutation.isPending}
          />
        </box>

        <text fg={Theme.textMuted}>
          Tab: Switch | Enter: Submit | Escape: Sign Up | Cmd+C: Quit
        </text>
      </box>
    </box>
  );
};
