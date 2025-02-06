// AuthContext.jsx
// This file provides an authentication context for the application.
// It uses React's Context API to manage and share authentication state across the component tree.
// The authentication state is persisted in localStorage to maintain the user's login status across page reloads.

import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage on initial load
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // Update localStorage whenever auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
