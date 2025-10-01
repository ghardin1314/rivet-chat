import { RGBA } from "@opentui/core";
import { useTerminalDimensions } from "@opentui/react";
import { useEffect, useState } from "react";
import { useSession } from "../hooks/use-session";
import { getAuthToken } from "../lib/credentials";
import { useRouter } from "../providers/router-provider";
import { Theme } from "../theme";

export const LoadingRoute = () => {
  const dimensions = useTerminalDimensions();
  const { navigate } = useRouter();
  const { data: session, isPending, error } = useSession();
  const [showSplash, setShowSplash] = useState(false);

  const text = "RIVET CHAT";
  const font = "block";

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      // First check if we have a token stored
      const token = await getAuthToken();

      if (!token) {
        // No token, go to signin
        navigate("signin");
        return;
      }

      // If we have a token, wait for the session query to finish
      if (!isPending) {
        if (session && !error) {
          // Valid session, go to home
          navigate("home");
        } else {
          // Invalid or expired token, go to signin
          navigate("signin");
        }
      }
    };

    checkAuth();
  }, [navigate, session, isPending, error]);

  return (
    <box
      width={dimensions.width}
      height={dimensions.height}
      backgroundColor={RGBA.fromHex(Theme.background)}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {showSplash && (
        <>
          <ascii-font
            // style={{ width, height }}
            text={text}
            font={font}
            fg={RGBA.fromHex(Theme.primary)}
          />
          <box marginTop={2}>
            <text fg={Theme.textMuted}>Because Discord Sucks</text>
          </box>
        </>
      )}
    </box>
  );
};
