import { type ParsedKey } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useCallback } from "react";
import { authClient } from "../lib/auth";
import { clearAuthToken } from "../lib/credentials";
import { useRouter } from "../providers/router-provider";
import { useModal, ConfirmationModalKey } from "../providers/modal-provider";

export const LogoutHandler = () => {
  const { navigate } = useRouter();
  const modal = useModal();

  const handleLogout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      // Ignore signOut errors, just clear locally
    }
    await clearAuthToken();
    navigate("signin");
  }, [navigate]);

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      if (evt.ctrl && evt.name === "l") {
        modal({
          type: ConfirmationModalKey,
          data: {
            title: "Logout",
            message: "Are you sure you want to logout?",
            confirmText: "Logout",
            cancelText: "Cancel",
            onConfirm: handleLogout,
          },
        });
      }
    },
    [modal, handleLogout]
  );

  useKeyboard(handleKeyboard);

  return null;
};
