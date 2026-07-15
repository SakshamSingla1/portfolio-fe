import { lazy, Suspense, useState } from "react";
import { AuthenticatedUserContext } from "./contexts/AuthenticatedUserContext";
import AdminRouter from "./routes/AdminRouter";
import Authentication from "./components/pages/Authentication/Authentication.page";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeInjector from "./components/atoms/ThemeInjector/ThemeInjector";

const Landing = lazy(() => import("./components/pages/Landing/Landing.page"));

function App() {
  // Skip landing when URL contains a password-reset token or session-expired redirect
  const [showLanding, setShowLanding] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return !params.get("token") && !params.get("auth");
  });

  return (
    <ThemeProvider>
      <SnackbarProvider>
        <AuthenticatedUserContext.Consumer>
          {({ user }) => (
            <>
              <ThemeInjector />
              <div>
                {user?.email ? (
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
  );
}

export default App;