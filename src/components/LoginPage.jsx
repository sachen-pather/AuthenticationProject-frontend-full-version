import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./AuthStyles.css";

/**
 * LoginPage component renders a login form and handles user authentication.
 *
 * @component
 * @example
 * return (
 *   <LoginPage />
 * )
 *
 * @returns {JSX.Element} The rendered login page component.
 *
 * @description
 * This component provides a login form for users to sign in to their account. It manages the state for email, password, error messages, and loading status. It also handles form submission, sending login requests to the server, and updating the authentication state based on the response.
 *
 * @function
 * @name handleLogin
 * @description Handles the form submission for user login. Sends a POST request to the login endpoint with the user's email and password. Updates the authentication state and navigates to the app page on successful login. Displays error messages on failure.
 * @param {Event} e - The form submission event.
 *
 * @state {string} email - The user's email address.
 * @state {string} password - The user's password.
 * @state {string} error - The error message to display on login failure.
 * @state {boolean} loading - The loading state to indicate if the login request is in progress.
 *
 * @hook useState - Manages the state for email, password, error, and loading.
 * @hook useNavigate - Provides navigation functionality to redirect users after successful login.
 * @hook useAuth - Provides authentication context to update the authentication state.
 *
 * @returns {JSX.Element} The rendered login page component.
 */
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOGIN_DATABASE}/Account/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_LOGIN}`,
          },
          body: JSON.stringify({
            email,
            password,
            rememberMe: false,
          }),
        }
      );

      if (response.ok) {
        // Store authentication state in localStorage
        localStorage.setItem("isAuthenticated", "true");
        // Also store email for user reference (optional)
        localStorage.setItem("userEmail", email);

        setIsAuthenticated(true);
        navigate("/app");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid login attempt");
        // Clear localStorage on failed login attempt
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userEmail");
      }
    } catch {
      setError(
        "An error occurred while trying to login. Please check your connection."
      );
      // Clear localStorage on error
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Please sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="auth-footer">
          Dont have an account?{" "}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
