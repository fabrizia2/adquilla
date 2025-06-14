"use client"; // If you're using Next.js App Router

import React, { useState, useEffect } from 'react';
// Changed useParams to useLocation as the token is a query parameter
import { useLocation, useNavigate, Link } from 'react-router-dom'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'react-hot-toast'; // Assuming you have react-hot-toast setup

export default function ResetPasswordPage() {
  // --- CHANGE 1: Use useLocation to get query params ---
  const location = useLocation();
  const navigate = useNavigate();

  // --- NEW STATE for the actual token extracted from URL ---
  const [resetToken, setResetToken] = useState(null); // Renamed to avoid confusion with the useParams 'token'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true); // Set true initially to show "Checking link validity..."
  const [tokenValid, setTokenValid] = useState(false); // This will indicate if a token was successfully found
  const [validationMessage, setValidationMessage] = useState('');

  // --- CHANGE 2: Extract token from URLSearchParams in useEffect ---
  useEffect(() => {
    console.log("ResetPasswordPage: Running useEffect to check URL for token...");
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token'); // Get the 'token' query parameter

    if (tokenFromUrl) {
      setResetToken(tokenFromUrl); // Set the extracted token
      setTokenValid(true); // Indicate that a token was found
      setValidationMessage(''); // Clear any previous validation messages
      console.log("ResetPasswordPage: Token found in URL. Token value:", tokenFromUrl);
    } else {
      setResetToken(null); // Ensure token state is null if not found
      setTokenValid(false); // Indicate no valid token
      setValidationMessage('No reset token found in the URL. Please ensure you are using the full link from your email.');
      toast.error('Invalid Link: No reset token found in the URL.');
      console.error("ResetPasswordPage: No token found in URL query parameters.");
    }
    // Set loading to false after token check, as this is the initial load state
    setLoading(false); 
  }, [location.search]); // Depend on location.search to re-run if URL changes

  // --- CHANGE 3: Use resetToken in handleResetPassword ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while submitting
    setValidationMessage(''); // Clear previous messages

    // --- Validate presence of extracted token ---
    if (!resetToken) {
      setValidationMessage('Password reset token is missing from the URL.');
      setLoading(false);
      console.error("DEBUG: handleResetPassword - resetToken is missing.");
      return;
    }

    if (password.length < 8) {
      setValidationMessage('Password must be at least 8 characters long.');
      setLoading(false);
      console.error("DEBUG: handleResetPassword - Password too short or empty.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationMessage('Passwords do not match.');
      setLoading(false);
      console.error("DEBUG: handleResetPassword - Passwords do not match.");
      return;
    }

    try {
      console.log("ResetPasswordPage: Submitting new password with token...");
      
      // --- ADDED DEBUG CONSOLE LOGS ---
      console.log("DEBUG: Token value being sent:", resetToken);
      // Mask password for security, but confirm it's not empty
      console.log("DEBUG: New password value being sent (first 3 chars):", password ? password.substring(0, 3) + '...' : '[Password is empty]');
      console.log("DEBUG: Full request body JSON:", JSON.stringify({ token: resetToken, newPassword: password }));
      // --- END DEBUG CONSOLE LOGS ---

      const response = await fetch(`https://backend-nhs9.onrender.com/api/auth/reset-password?token=${resetToken},`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Backend expects 'newPassword'
        body: JSON.stringify({ newPassword: password }), 
      });

      if (response.ok) {
        toast.success('Your password has been successfully reset! You can now log in with your new password.', { duration: 5000 });
        console.log("ResetPasswordPage: Password reset successful. Redirecting to login.");
        navigate('/auth/login'); // Redirect to login page
      } else {
        const errorData = await response.json();
        setValidationMessage(errorData.message || 'Failed to reset password. Please try again.');
        toast.error(errorData.message || 'Failed to reset password.');
        console.error('Reset password error from backend:', errorData); // Log the specific error from backend
      }
    } catch (error) {
      setValidationMessage('Network error. Please check your connection and try again.');
      toast.error('Network error. Please check your connection.');
      console.error('Reset password network error:', error);
    } finally {
      setLoading(false); // Set loading to false after submission attempt
    }
  };

  // --- CHANGE 4: Use tokenValid for conditional rendering ---
  if (!tokenValid) {
    // Show loading while we're waiting for useEffect to check token, then show error if invalid
    if (loading) { // If loading is true, it means useEffect is still running its initial check
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md text-center">
                    <CardContent><p>Checking link validity...</p></CardContent>
                </Card>
            </div>
        );
    }
    // Otherwise, if not valid and not loading, show the error message
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">{validationMessage || 'The password reset link is invalid or expired. Please request a new one.'}</p>
            <Button asChild className="w-full bg-gray-800 hover:bg-gray-700 text-white">
              <Link to="/forgot-password">Request a New Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- CHANGE 5: The main form is rendered only if tokenValid is true ---
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
          <CardDescription>
            Enter and confirm your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8} // HTML5 validation, backend should enforce
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {validationMessage && (
              <p className="text-red-500 text-sm">{validationMessage}</p>
            )}
            <Button type="submit" className="w-full bg-brand-magenta-600 hover:bg-brand-magenta-700 text-black" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          <Link to="/login" className="font-medium text-brand-magenta-600 hover:text-brand-magenta-700">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}