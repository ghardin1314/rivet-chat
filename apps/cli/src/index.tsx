import { render } from "@opentui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { clearLogs } from "./hooks/use-log";
import { FocusProvider } from "./providers/focus-provider";
import { RouterProvider, useRouter } from "./providers/router-provider";
import { HomeRoute } from "./routes/home";
import { SignInRoute } from "./routes/signin";
import { SignUpRoute } from "./routes/signup";

// Create a client
const queryClient = new QueryClient();

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
  <QueryClientProvider client={queryClient}>
    <RouterProvider>
      <FocusProvider>
        <App />
      </FocusProvider>
    </RouterProvider>
  </QueryClientProvider>,
  {
    targetFps: 60,
    exitOnCtrlC: false,
    useKittyKeyboard: true,
  }
);
