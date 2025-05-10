import { Outlet, Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ShoppingBag } from "../components/icons"
import { MapPin, Search, Plus, User, UserPlus } from "lucide-react";
import { FaSearch, FaMapMarkerAlt, FaPlus, FaUserPlus, FaUser } from 'react-icons/fa';
import logo from '../../public/images/Adaquila.jpg'; // Make sure your logo is placed correctly
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handlePostAdClick = () => {
    if (isLoggedIn) {
      navigate('/post-ad');
    } else {
      navigate('/auth/login', { state: { from: '/post-ad' } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-black text-white w-full">
        {/* Top section: Logo, Search, Actions */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
          {/* Logo and Brand Name */}
          <Link to="/">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Adaquila Logo" className="h-10 w-10 rounded-full object-cover" />
              <span className="text-2xl font-bold text-pink-600">Adaquila</span>
            </div>
          </Link>
          
          {/* Search Bar */}
          <div className="flex items-center w-1/2 bg-white rounded overflow-hidden">
            <input
              type="text"
              placeholder="Search Adaquila"
              className="flex-grow px-4 py-2 text-black outline-none"
            />
            <div className="flex items-center px-4 text-black border-l">
              <FaMapMarkerAlt className="mr-2 text-pink-600" />
              <input
                type="text"
                value="UK"
                className="bg-transparent outline-none w-16"
                readOnly
              />
            </div>
            <button className="bg-pink-600 px-4 py-2">
              <FaSearch className="text-white" />
            </button>
          </div>

          {/* User Actions - Updated with auth logic */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePostAdClick}
              className="flex items-center bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded text-sm"
            >
              <FaPlus className="mr-2" /> Post an ad
            </button>
            
            {!isLoggedIn ? (
              <>
                <Link 
                  to="/auth/register"
                  className="flex items-center hover:text-pink-600 text-sm"
                >
                  <FaUserPlus className="mr-1" /> Sign up
                </Link>
                <Link 
                  to="/auth/login"
                  className="flex items-center hover:text-pink-600 text-sm"
                >
                  <FaUser className="mr-1" /> Login
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLogout}
                  className="flex items-center hover:text-pink-600 text-sm"
                >
                  <FaUser className="mr-1" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Nav */}
        <nav className="bg-white shadow-sm border-t border-gray-200">
          <ul className="flex justify-around px-4 py-2 font-semibold text-lg text-gray-800">
            <li className="cursor-pointer hover:underline">Cars & Vehicles</li>
            <div className="text-black border-l"></div>
            <li className="cursor-pointer hover:underline">For Sale</li>
            <div className="text-black border-l"></div>
            <li className="cursor-pointer hover:underline">Services</li>
            <div className="text-black border-l"></div>
            <li className="cursor-pointer hover:underline">Property</li>
            <div className="text-black border-l"></div>
            <li className="cursor-pointer hover:underline">Pets</li>
            <div className="text-black border-l"></div>
            <li className="cursor-pointer hover:underline">Jobs</li>
            <div className="text-black border-l"></div>
            <li className="cursor-pointer hover:underline">Community</li>
          </ul>
        </nav>
      </header>



      <Outlet />
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
            {/* Logo and Brand Name */}
            <Link to="/">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Adaquila Logo" className="h-20 w-20 rounded-full object-cover" />
                <span className="text-2xl font-bold text-brand-magenta-600">Adaquila</span>
              </div>
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
                    className="inline-block bg-brand-magenta-600 text-white px-3 py-1 rounded-full hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-600"
                  >
                    Vehicles
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/properties"
                    className="inline-block bg-brand-magenta-600 text-white px-3 py-1 rounded-full hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-600"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/electronics"
                    className="inline-block bg-brand-magenta-600 text-white px-3 py-1 rounded-full hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-600"
                  >
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/furniture"
                    className="inline-block bg-brand-magenta-600 text-white px-3 py-1 rounded-full hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-600"
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
          <p className="text-xs text-gray-700">© {new Date().getFullYear()} Adaquila. All rights reserved.</p>
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
