// src/layouts/AuthProvider.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null); // Initialize with null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // NEW: Add a state for token
  const [token, setToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // New: Tracks if auth check from localStorage is complete

  useEffect(() => {
    console.log("AuthProvider: Running initial localStorage check...");
    const storedUser = localStorage.getItem("user");
    // NEW: Read stored token from localStorage
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure that the parsed user object has an _id property
        if (parsedUser && parsedUser._id) {
          setUser(parsedUser);
          setToken(storedToken); // NEW: Set token state from localStorage
          console.log("AuthProvider: User and Token found in localStorage. Setting state.");
        } else {
          console.warn("AuthProvider: User data from localStorage is missing _id. Clearing data.");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null); // Ensure state is cleared too
          setToken(null); // Ensure state is cleared too
        }
      } catch (e) {
        console.error("AuthProvider: Failed to parse user or token from localStorage:", e);
        localStorage.removeItem("user"); // Clear corrupted data
        localStorage.removeItem("token"); // Also clear token
        setUser(null); // Ensure state is cleared too
        setToken(null); // Ensure state is cleared too
      }
    } else {
        console.log("AuthProvider: No user or token found in localStorage.");
        localStorage.removeItem("user"); // Ensure no partial data lingers
        localStorage.removeItem("token");
    }
    setLoadingAuth(false); // Auth check complete after trying to load from localStorage
    console.log("AuthProvider: Initial localStorage check complete.");
  }, []); // Empty dependency array means this runs only once on mount

  // Derived state: isAuthenticated
  const isAuthenticated = !!user && !!token; // isAuthenticated now depends on both user and token

  const login = (userData, receivedToken) => { // Renamed 'token' param to 'receivedToken' for clarity
    console.log("AuthProvider: login function called.");
    if (!userData || !userData._id || !receivedToken) {
      console.error("Login: userData (with _id) or receivedToken missing.");
      return; // Prevent setting incomplete user data
    }
    setUser(userData);
    setToken(receivedToken); // IMPORTANT: Set the token state here
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", receivedToken); // Save to localStorage
    console.log("AuthProvider: User and Token set for login.");
  };

  const logout = () => {
    console.log("AuthProvider: logout function called.");
    setUser(null);
    setToken(null); // Clear token state
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("AuthProvider: User and Token cleared.");
  };

  // Add updateUserInContext function for MyDetailsPage
  const updateUserInContext = (updatedUserData) => {
    if (updatedUserData && updatedUserData._id) {
        setUser(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        console.log("AuthProvider: User data updated in context and localStorage.");
    } else {
        console.warn("AuthProvider: Attempted to update user with invalid data.");
    }
  };


  // Provide loadingAuth, user, isAuthenticated, login, logout, AND token, updateUserInContext
  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loadingAuth, login, logout, updateUserInContext }}>
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