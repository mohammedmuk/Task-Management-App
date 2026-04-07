import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@features/auth/authSlice";

// ── Pages ─────────────────────────────────────────────
import LandingPage from "@pages/LandingPage";
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import VerifyEmailPage from "@pages/VerifyEmailPage";
import ForgotPasswordPage from "@pages/ForgotPasswordPage";
import DashboardPage from "@pages/DashboardPage";

// ── Guards ────────────────────────────────────────────
import ProtectedRoute from "@components/common/ProtectedRoute";

const App = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ──────────────────────────────── */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace />
              : <LandingPage />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <LoginPage />
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <RegisterPage />
          }
        />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        {/* ── Protected ───────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ── Fallback ────────────────────────────── */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;