// src/pages/ForgotPasswordPage.jsx

"use client"; // If you're using Next.js App Router

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'react-hot-toast'; // Assuming you have react-hot-toast setup

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessageSent(false); // Reset message sent state

    // Basic email validation
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://backend-nhs9.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Even if the backend says "user not found", we give a generic success message
      // to prevent user enumeration (attacker guessing valid emails).
      if (response.ok || response.status === 404) { // Treat 404 as success for UX security
        toast.success('If an account with that email exists, a password reset link has been sent to your inbox.', { duration: 5000 });
        setMessageSent(true);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to send reset link. Please try again.');
        console.error('Forgot password error:', errorData);
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
      console.error('Forgot password network error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!messageSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-brand-magenta-600 hover:bg-brand-magenta-700 text-black" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-green-600 mb-4">
                Please check your email for the password reset link.
              </p>
              <Button asChild className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                <Link to="/auth/login">Back to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
        {!messageSent && (
          <CardFooter className="text-center text-sm text-gray-500">
            Remembered your password?{' '}
            <Link to="/auth/login" className="font-medium text-brand-magenta-600 hover:text-brand-magenta-700">
              Log in
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}