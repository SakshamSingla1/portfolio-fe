import { AuthenticatedUserContext } from "./contexts/AuthenticatedUserContext";
import AdminRouter from "./routes/AdminRouter";
import Authentication from "./components/pages/Authentication/Authentication.page";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeInjector from "./components/atoms/ThemeInjector/ThemeInjector";

function App() {
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