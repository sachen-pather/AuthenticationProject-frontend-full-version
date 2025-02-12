import { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthStyles.css";

// RegisterPage component
/**
 * RegisterPage component for user registration.
 *
 * @component
 * @example
 * return (
 *   <RegisterPage />
 * )
 *
 * @description
 * This component renders a registration form for users to create an account. It includes state variables for form inputs, error messages, success messages, and loading status. The form submission is handled asynchronously, sending a registration request to the server and displaying appropriate messages based on the response.
 *
 * @returns {JSX.Element} The rendered registration page component.
 *
 * @function
 * @name RegisterPage
 *
 * @state {string} email  The email input value.
 * @state {string} password - The password input value.
 * @state {string} confirmPassword - The confirm password input value.
 * @state {string} error - The error message to display.
 * @state {string} success - The success message to display.
 * @state {boolean} loading - The loading status of the form submission.
 *
 * @async
 * @function
 * @name handleRegister
 * @description Handles the form submission for user registration. It validates the form inputs, sends a registration request to the server, and updates the state based on the server response.
 * @param {Event} e - The form submission event.
 *
 * @returns {Promise<void>}
 *
 * @example
 * <form onSubmit={handleRegister}>
 *   // form inputs
 * </form>
 */

const RegisterPage = () => {
  // State variables for form inputs and status messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success message
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Send registration request to the server
      const response = await fetch(
        `${import.meta.env.VITE_LOGIN_DATABASE}/Account/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_LOGIN}`,
          },
          body: JSON.stringify({
            Email: email,
            Password: password,
            ConfirmPassword: confirmPassword,
          }),
        }
      );

      // Handle response from the server
      if (response.ok) {
        // Show success message
        setSuccess(
          "Registration successful! Please check your email to verify your account."
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Sign up to get started</p>
        </div>
        {/* Display error message if any */}
        {error && <div className="error-message">{error}</div>}
        {/* Display success message if any */}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleRegister} className="auth-form">
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
              minLength="6"
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
