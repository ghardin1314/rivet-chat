import { RGBA } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { PasswordInput } from "../components/password-input";
import { useLog } from "../hooks/use-log";
import { authClient } from "../lib/auth";
import { useRouter } from "../providers/router-provider";
import { Theme } from "../theme";

export const SignUpRoute = () => {
  const dimensions = useTerminalDimensions();
  const { navigate } = useRouter();
  const { info } = useLog();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [focused, setFocused] = useState<"username" | "email" | "password">(
    "username"
  );

  const signUpMutation = useMutation({
    mutationFn: async ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => {
      const response = await authClient.signUp.email({
        email,
        password,
        username,
        name: username,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (data) => {
      info("Signup successful", data);
      navigate("home");
    },
  });

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") {
      process.exit(0);
    }

    if (key.name === "j" && key.meta) {
      navigate("signin");
    }

    if (key.name === "tab") {
      const fields = ["username", "email", "password"] as const;
      const currentIndex = fields.indexOf(focused);
      const nextIndex = (currentIndex + 1) % fields.length;
      setFocused(fields[nextIndex]);
    }
  });

  const handleSubmit = useCallback(() => {
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      signUpMutation.isPending
    )
      return;
    info("Attempting signup", { username, email });
    signUpMutation.mutate({ username, email, password });
  }, [username, email, password, info, signUpMutation]);

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
          {signUpMutation.isPending ? (
            <text fg={Theme.primary}>Creating account...</text>
          ) : signUpMutation.isError ? (
            <text fg={Theme.warning}>
              {String((signUpMutation.error as Error)?.message || "Sign up failed")}
            </text>
          ) : (
            <text fg={Theme.textMuted}>Sign Up</text>
          )}
        </box>

        <box
          title="Username"
          style={{
            border: true,
            width: 40,
            height: 3,
            borderColor: signUpMutation.isPending ? Theme.textMuted : undefined,
          }}
        >
          <input
            placeholder="Enter username..."
            onInput={setUsername}
            onSubmit={handleSubmit}
            focused={focused === "username" && !signUpMutation.isPending}
          />
        </box>

        <box
          title="Email"
          style={{
            border: true,
            width: 40,
            height: 3,
            borderColor: signUpMutation.isPending ? Theme.textMuted : undefined,
          }}
        >
          <input
            placeholder="Enter email..."
            onInput={setEmail}
            onSubmit={handleSubmit}
            focused={focused === "email" && !signUpMutation.isPending}
          />
        </box>

        <box
          title="Password"
          style={{
            border: true,
            width: 40,
            height: 3,
            borderColor: signUpMutation.isPending ? Theme.textMuted : undefined,
          }}
        >
          <PasswordInput
            placeholder="Enter password..."
            onInput={setPassword}
            onSubmit={handleSubmit}
            focused={focused === "password" && !signUpMutation.isPending}
          />
        </box>

        <text fg={Theme.textMuted}>
          Tab: Switch | Enter: Submit | Opt+J: Sign In | Cmd+C: Quit
        </text>
      </box>
    </box>
  );
};
