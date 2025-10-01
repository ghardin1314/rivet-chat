import { render } from "@opentui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/error-boundary";
import { clearLogs } from "./hooks/use-log";
import { ChatProvider } from "./providers/chat-provider";
import { FocusProvider } from "./providers/focus-provider";
import { ModalProvider } from "./providers/modal-provider";
import { RouterProvider, useRouter } from "./providers/router-provider";
import { HomeRoute } from "./routes/home";
import { LoadingRoute } from "./routes/loading";
import { SignInRoute } from "./routes/signin";
import { SignUpRoute } from "./routes/signup";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const { currentRoute } = useRouter();

  switch (currentRoute) {
    case "loading":
      return <LoadingRoute />;
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
  // @ts-expect-error - ErrorBoundary is not typed properly
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <RouterProvider>
        <ChatProvider>
          <FocusProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </FocusProvider>
        </ChatProvider>
      </RouterProvider>
    </QueryClientProvider>
  </ErrorBoundary>,
  {
    targetFps: 60,
    exitOnCtrlC: false,
    useKittyKeyboard: true,
  }
);
