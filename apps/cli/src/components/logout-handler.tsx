import { type ParsedKey } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useCallback, useState } from "react";
import { authClient } from "../lib/auth";
import { clearAuthToken } from "../lib/credentials";
import { useRouter } from "../providers/router-provider";
import { ConfirmationDialog } from "./confirmation-dialog";

export const LogoutHandler = () => {
  const { navigate } = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      // Ignore signOut errors, just clear locally
    }
    await clearAuthToken();
    navigate("signin");
  }, [navigate]);

  const handleKeyboard = useCallback((evt: ParsedKey) => {
    if (evt.ctrl && evt.name === "l") {
      setShowDialog(true);
    }
  }, []);

  useKeyboard(handleKeyboard);

  if (!showDialog) return null;

  return (
    <ConfirmationDialog
      title="Logout"
      message="Are you sure you want to logout?"
      confirmText="Logout"
      cancelText="Cancel"
      onConfirm={handleLogout}
      onClose={() => setShowDialog(false)}
    />
  );
};
