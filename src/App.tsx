import { lazy, Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticatedUserContext } from "./contexts/AuthenticatedUserContext";
import AdminRouter from "./routes/AdminRouter";
import Authentication from "./components/pages/Authentication/Authentication.page";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeInjector from "./components/atoms/ThemeInjector/ThemeInjector";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000, // 30s
      refetchOnWindowFocus: false,
    },
  },
});

const Landing = lazy(() => import("./components/pages/Landing/Landing.page"));

function App() {
  // Skip landing when URL contains a password-reset token
  const [showLanding, setShowLanding] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return !params.get("token");
  });

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SnackbarProvider>
        <AuthenticatedUserContext.Consumer>
          {({ user }) => (
            <>
              <ThemeInjector />
              <div>
                {user?.token && user?.email ? (
                  <AdminRouter />
                ) : showLanding ? (
                  <Suspense fallback={null}>
                    <Landing onGetStarted={() => setShowLanding(false)} />
                  </Suspense>
                ) : (
                  <Authentication />
                )}
              </div>
            </>
          )}
        </AuthenticatedUserContext.Consumer>
      </SnackbarProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;