// src/layouts/AuthProvider.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null); // Initialize with null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // New: Tracks if auth check from localStorage is complete

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure that the parsed user object has an _id property
        if (parsedUser && parsedUser._id) {
            setUser(parsedUser);
        } else {
            console.warn("User data from localStorage is missing _id. Clearing data.");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        localStorage.removeItem("user"); // Clear corrupted data
        localStorage.removeItem("token"); // Also clear token
      }
    }
    setLoadingAuth(false); // Auth check complete after trying to load from localStorage
  }, []);

  // Derived state: isAuthenticated
  const isAuthenticated = !!user; // true if user is not null, false otherwise

  const login = (userData, token) => { // Added token as a parameter
    // Ensure userData includes _id if it's coming from your backend
    if (!userData || !userData._id) {
        console.error("Login: userData must contain _id property.");
        return; // Prevent setting incomplete user data
    }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token); // Make sure you save the token too
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Provide loadingAuth, user, isAuthenticated, login, and logout
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loadingAuth, login, logout }}>
      {/* Optionally, show a loading indicator here while authenticating */}
      {loadingAuth ? (
        <div className="flex justify-center items-center min-h-screen text-xl text-gray-700">
          Authenticating...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}