import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AppPage from "./components/AppPage";
import VerifyEmail from "./components/VerifyEmail";
import { AuthProvider, useAuth } from "./AuthContext";
import "./App.css";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// App.jsx - Add new route
/**
 * The main application component that sets up routing and authentication.
 *
 * This component uses `AuthProvider` to provide authentication context,
 * `Router` to handle routing, and `Routes` to define the different routes
 * available in the application. It includes routes for login, registration,
 * email verification, and a protected route for the main application page.
 *
 * @component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
