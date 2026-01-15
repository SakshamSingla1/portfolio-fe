import { Route, Routes, Navigate } from "react-router-dom";
import { AuthenticatedUserProvider } from "./contexts/AuthenticatedUserContext";
import { useAuthenticatedUser } from "./hooks/useAuthenticatedUser";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminRoutes from "./routes/AdminRoutes";
import Authentication from "./components/pages/Authentication/Authentication.page";
import { SnackbarProvider } from "./contexts/SnackbarContext";

function App() {
  const { user } = useAuthenticatedUser();

  return (
    <SnackbarProvider>
      <AuthenticatedUserProvider>
        {user?.token ? (
          <Routes>
            <Route path="/admin/*" element={
              <DashboardLayout>
                <AdminRoutes />
              </DashboardLayout>
            } />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<Authentication />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </AuthenticatedUserProvider>
    </SnackbarProvider>
  );
}

export default App;