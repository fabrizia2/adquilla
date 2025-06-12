import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { ShoppingBag } from "../../components/icons"
import { AuthContext } from "../../layouts/AuthProvider"  // Import AuthContext

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const { login } = useContext(AuthContext)  // Get login from context

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("https://backend-nhs9.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Use login function from context to set user & store in localStorage
      login(data.user)
      localStorage.setItem("token", data.token) // token can still be stored separately

      console.log("Login successful:", data)
      navigate("/") // redirect after login
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Guest header only */}
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="h-5 w-5" />
            <span>Adaquila</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-black">Welcome back</h1>
              <p className="text-gray-500">Enter your credentials to sign in to your account</p>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-800">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked)} />
                <Label htmlFor="remember" className="text-sm font-normal text-gray-500">
                  Remember me
                </Label>
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-700">
                Don't have an account?{" "}
                <Link to="/auth/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-14 md:flex-row md:py-0">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Adaquilla. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="text-xs hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link to="#" className="text-xs hover:underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
