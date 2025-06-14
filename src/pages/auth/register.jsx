"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react" // Import Eye and EyeOff icons

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [location, setLocation] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState("")
  // New state variables for password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.")
      return;
    }

    try {
      const response = await fetch("https://backend-nhs9.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          location,
          phoneNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.errors ? data.errors.map(err => err.msg).join(", ") : data.message || "Registration failed";
        throw new Error(errorMessage);
      }

      console.log("User registered:", data)
      navigate("/auth/login")
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.message)
    }
  }

  // Toggle functions for password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-black">Create an account</h1>
            <p className="text-gray-700">Enter your information to create an account</p>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name Input */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-800">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            {/* Last Name Input */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-800">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-800">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-800">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., +254712345678"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-800">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-800">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10" // Add padding to the right for the icon
                />
                <Button
                  type="button" // Important: Prevent form submission
                  variant="ghost" // Make it look like a floating icon
                  size="sm"
                  className="absolute inset-y-0 right-0 h-full px-3 py-0 flex items-center text-gray-500 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password Input with Toggle */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-800">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10" // Add padding to the right for the icon
                />
                <Button
                  type="button" // Important: Prevent form submission
                  variant="ghost" // Make it look like a floating icon
                  size="sm"
                  className="absolute inset-y-0 right-0 h-full px-3 py-0 flex items-center text-gray-500 hover:bg-transparent"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked)}
                required
              />
              <Label htmlFor="terms" className="text-sm font-normal text-black">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </Label>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
          <div className="text-center">
            <p className="text-sm text-black">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}