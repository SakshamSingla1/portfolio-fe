import { useState } from "react";
import { AuthenticatedUserContext } from "./contexts/AuthenticatedUserContext";
import AdminRouter from "./routes/AdminRouter";
import Authentication from "./components/pages/Authentication/Authentication.page";
import Landing from "./components/pages/Landing/Landing.page";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeInjector from "./components/atoms/ThemeInjector/ThemeInjector";

function App() {
  // Skip landing when URL contains a password-reset token
  const [showLanding, setShowLanding] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return !params.get("token");
  });

  return (
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
                  <Landing onGetStarted={() => setShowLanding(false)} />
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