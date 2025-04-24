import { Outlet, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ShoppingBag } from "../components/icons"

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ShoppingBag className="h-5 w-5 text-brand-magenta-500" />
            <span>Adaquila</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-brand-magenta-50">
                Login
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm" className="bg-brand-magenta-500 hover:bg-brand-magenta-600 text-white">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <ShoppingBag className="h-5 w-5 text-brand-magenta-500" />
              <span>Adaquila</span>
            </Link>
            <p className="text-sm text-gray-700 font-medium">Powering Ads, Elevating Brands</p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/category/vehicles"
                    className="inline-block bg-brand-magenta-500 text-white px-3 py-1 rounded-full hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-500"
                  >
                    Vehicles
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/properties"
                    className="inline-block bg-brand-magenta-500 text-white px-3 py-1 rounded-full hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-500"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/electronics"
                    className="inline-block bg-brand-magenta-500 text-white px-3 py-1 rounded-full hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-500"
                  >
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/furniture"
                    className="inline-block bg-brand-magenta-500 text-white px-3 py-1 rounded-full hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-500"
                  >
                    Furniture
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/terms" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link to="/licenses" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Help</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/faq" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link to="/safety" className="text-gray-700 hover:text-brand-magenta-600 hover:underline">
                    Safety
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-14 md:flex-row md:py-0">
          <p className="text-xs text-gray-700">© {new Date().getFullYear()} Adaquilla. All rights reserved.</p>
          <div className="flex gap-4">
            <Link
              to="#"
              className="text-xs text-gray-700 hover:text-brand-magenta-600 hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-xs text-gray-700 hover:text-brand-magenta-600 hover:underline underline-offset-4"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
