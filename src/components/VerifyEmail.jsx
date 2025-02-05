// VerifyEmail.jsx - New component for email verification
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./AuthStyles.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      // More robust token cleaning
      const cleanToken = token
        ? token.replace(/\s/g, "").trim() // Remove all whitespace
        : null;

      console.log("Original Token:", token);
      console.log("Cleaned Token:", cleanToken);

      if (!cleanToken) {
        setTimeout(() => {
          setStatus("error");
        }, 3000);
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_LOGIN_DATABASE
          }/Account/verify-email?token=${encodeURIComponent(cleanToken)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_BEARER_LOGIN}`,
            },
          }
        );

        if (response.ok) {
          setStatus("success");
          setTimeout(() => navigate("/"), 3000);
        } else {
          // More detailed error logging
          const errorText = await response.text();
          console.error("Verification Error:", {
            status: response.status,
            statusText: response.statusText,
            errorText,
          });

          setTimeout(() => {
            setStatus("error");
          }, 3000);
        }
      } catch (error) {
        console.error("Catch Error:", error);

        setTimeout(() => {
          setStatus("error");
        }, 3000);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  // Rest of the component remains the same
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Email Verification</h2>
          {status === "verifying" && (
            <p className="auth-subtitle">Verifying your email address...</p>
          )}
          {status === "success" && (
            <p className="auth-subtitle success-message">
              Your email has been verified successfully! Redirecting to login...
            </p>
          )}
          {status === "error" && (
            <p className="auth-subtitle error-message">
              Failed to verify email. The link may be invalid or expired.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
