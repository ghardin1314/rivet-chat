import { render } from "@opentui/react";
import { clearLogs } from "./hooks/useLog";
import { FocusProvider } from "./providers/focus-provider";
import { RouterProvider, useRouter } from "./providers/router-provider";
import { HomeRoute } from "./routes/home";
import { SignInRoute } from "./routes/signin";
import { SignUpRoute } from "./routes/signup";

const App = () => {
  const { currentRoute } = useRouter();

  switch (currentRoute) {
    case "home":
      return <HomeRoute />;
    case "signin":
      return <SignInRoute />;
    case "signup":
      return <SignUpRoute />;
    default:
      const _exhaustiveCheck: never = currentRoute;
      return null;
  }
};

// Clear previous logs on startup
await clearLogs();

await render(
  <RouterProvider>
    <FocusProvider>
      <App />
    </FocusProvider>
  </RouterProvider>,
  {
    targetFps: 60,
    exitOnCtrlC: false,
    useKittyKeyboard: true,
  }
);
