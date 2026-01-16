import { AuthenticatedUserContext } from "./contexts/AuthenticatedUserContext";
import AdminRouter from "./routes/AdminRouter";
import Authentication from "./components/pages/Authentication/Authentication.page";
import { SnackbarProvider } from "./contexts/SnackbarContext";

function App() {
  return (
    <SnackbarProvider>
      <AuthenticatedUserContext.Consumer>
        {({ user }) => (
          <div>
            {user?.token && user?.email ? (
              <AdminRouter />
            ) : (
              <Authentication />
            )}
          </div>
        )}
      </AuthenticatedUserContext.Consumer>
    </SnackbarProvider>
  );
}

export default App;