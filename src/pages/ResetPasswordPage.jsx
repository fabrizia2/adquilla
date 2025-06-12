// src/pages/ResetPasswordPage.jsx

"use client"; // If you're using Next.js App Router

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'react-hot-toast'; // Assuming you have react-hot-toast setup

export default function ResetPasswordPage() {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // Optional: Verify token on component mount (good for UX, but backend will also verify)
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setValidationMessage('No reset token found in the URL.');
        setTokenValid(false);
        return;
      }
      // You might have a backend endpoint to quickly verify token validity
      // This is less critical as your main reset endpoint will do full validation.
      // For simplicity, we'll assume the presence of token implies it's from a valid link for initial display.
      setTokenValid(true);
    };
    verifyToken();
  }, [token]);


  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationMessage(''); // Clear previous messages

    if (!token) {
      setValidationMessage('Password reset token is missing from the URL.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setValidationMessage('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setValidationMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://backend-nhs9.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (response.ok) {
        toast.success('Your password has been successfully reset! You can now log in with your new password.', { duration: 5000 });
        navigate('/login'); // Redirect to login page
      } else {
        const errorData = await response.json();
        setValidationMessage(errorData.message || 'Failed to reset password. Please try again.');
        toast.error(errorData.message || 'Failed to reset password.');
        console.error('Reset password error:', errorData);
      }
    } catch (error) {
      setValidationMessage('Network error. Please check your connection and try again.');
      toast.error('Network error. Please check your connection.');
      console.error('Reset password network error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">{validationMessage || 'The password reset link is invalid or expired.'}</p>
            <Button asChild className="w-full bg-gray-800 hover:bg-gray-700 text-white">
              <Link to="/forgot-password">Request a New Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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