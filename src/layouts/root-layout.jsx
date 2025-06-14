import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaBars,
  FaSearch,
  FaMapMarkerAlt,
  FaPlus,
  FaUserPlus,
  FaUser,
} from "react-icons/fa";
import logo from "../../public/images/Adaquila.jpg"; // adjust if needed
import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider"; // <-- adjust path accordingly

export default function RootLayout() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isAuthenticated = !!user;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // NEW: State for the location search term
  const [locationTerm, setLocationTerm] = useState(""); // Initialize empty, or with a default like "UK"

  // Define your specific categories here
  const fixedCategories = [
    "Cars & Vehicles",
    "For Sale",
    "Services",
    "Property",
    "Pets",
    "Jobs",
    "Furniture",
    "Electronics",
    "Others",
  ];

  const handlePostAdClick = () => {
    if (isAuthenticated) {
      navigate("/post-ad");
    } else {
      navigate("/auth/login", { state: { from: "/post-ad" } });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (searchTerm.trim()) {
      queryParams.append("search", encodeURIComponent(searchTerm.trim()));
    }
    // NEW: Append location to query params if it exists
    if (locationTerm.trim()) {
      queryParams.append("location", encodeURIComponent(locationTerm.trim()));
    }

    if (queryParams.toString()) {
      // Navigate to a products page with the search and/or location term as query parameters
      navigate(`/products?${queryParams.toString()}`);
      setSearchTerm(""); // Clear search term after submission
      setLocationTerm(""); // NEW: Clear location term after submission
      setIsMenuOpen(false); // Close mobile menu if open after search
    } else {
      // Optional: If both search and location are empty, you might want to navigate to a general listings page
      // navigate("/products");
      // Or simply do nothing, or show a toast message
      console.log("Please enter a search term or location.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-black text-white w-full">
        <div className="flex justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b border-gray-800">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            <img
              src={logo}
              alt="Adaquila Logo"
              className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
            />
            <span className="text-xl md:text-2xl font-bold text-pink-600">Adaquila</span>
          </Link>

          {/* Search Bar - Hidden on small, flexible on medium, fixed width on large */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-grow max-w-lg bg-white rounded overflow-hidden shadow-sm">
            <input
              type="text"
              placeholder="Search Adaquila"
              className="flex-grow px-3 py-2 text-black outline-none text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center px-3 text-black border-l border-gray-300">
              <FaMapMarkerAlt className="mr-1 text-pink-600 text-sm md:text-base" />
              {/* MODIFIED: Location Input */}
              <input
                type="text"
                placeholder="e.g., London" // Changed placeholder
                value={locationTerm} // Bound to locationTerm state
                onChange={(e) => setLocationTerm(e.target.value)} // Added onChange handler
                className="bg-transparent outline-none w-20 text-sm md:text-base" // Adjusted width for more space
                // Removed readOnly attribute
              />
            </div>
            <button type="submit" className="bg-pink-600 px-3 py-2 hover:bg-pink-700 transition-colors">
              <FaSearch className="text-white text-sm md:text-base" />
            </button>
          </form>

          {/* User Actions & Mobile Menu Toggle */}
          <nav className="flex items-center space-x-2 md:space-x-4">
            {/* Post an Ad button - always visible, adjust padding */}
            <button
              onClick={handlePostAdClick}
              className="flex items-center bg-pink-600 hover:bg-pink-700 text-white px-2 py-1.5 md:px-3 md:py-2 rounded text-xs md:text-sm whitespace-nowrap"
            >
              <FaPlus className="mr-1 md:mr-2" /> <span className="hidden md:inline">Post an ad</span><span className="inline md:hidden">Ad</span>
            </button>

            {/* Mobile Menu Toggle (Hamburger) */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center hover:text-pink-600 p-2 text-lg"
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>

            {/* Desktop User Actions - hidden on small screens */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
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
                <>
                  
                  <div className="relative">
                    <button
                      onClick={toggleMenu}
                      className="flex items-center hover:text-pink-600 text-sm"
                      aria-label="Menu"
                    >
                      <FaBars className="mr-1" /> Menu
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20">
                        <Link to="/manage-ads" className="block px-4 py-2 text-sm text-white hover:bg-pink-600" onClick={() => setIsMenuOpen(false)}>Manage my Ads</Link>
                        <Link to="/my-details" className="block px-4 py-2 text-sm text-white hover:bg-pink-600" onClick={() => setIsMenuOpen(false)}>My Details</Link>
                        <Link to="/help-contact" className="block px-4 py-2 text-sm text-white hover:bg-pink-600" onClick={() => setIsMenuOpen(false)}>Help & Contact</Link>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-pink-600">Logout</button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Search Bar - displayed only on small screens */}
        <form onSubmit={handleSearchSubmit} className="md:hidden px-4 py-3 border-b border-gray-800">
          <div className="flex items-center w-full bg-white rounded overflow-hidden shadow-sm">
            <input
              type="text"
              placeholder="Search Adaquila"
              className="flex-grow px-3 py-2 text-black outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center px-3 text-black border-l border-gray-300">
              <FaMapMarkerAlt className="mr-1 text-pink-600 text-sm" />
              {/* MODIFIED: Mobile Location Input */}
              <input
                type="text"
                placeholder="Location" // Changed placeholder
                value={locationTerm} // Bound to locationTerm state
                onChange={(e) => setLocationTerm(e.target.value)} // Added onChange handler
                className="bg-transparent outline-none w-20 text-sm" // Adjusted width
                // Removed readOnly attribute
              />
            </div>
            <button type="submit" className="bg-pink-600 px-3 py-2 hover:bg-pink-700 transition-colors">
              <FaSearch className="text-white text-sm" />
            </button>
          </div>
        </form>

        {/* Mobile Dropdown Menu (overlay) */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-full bg-black bg-opacity-95 z-40 flex flex-col items-center justify-center p-4">
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-white text-3xl"
              aria-label="Close menu"
            >
              &times;
            </button>
            <div className="flex flex-col space-y-4 text-white text-lg">
              {!isAuthenticated ? (
                <>
                  <Link to="/auth/register" className="hover:text-pink-600" onClick={toggleMenu}>
                    <FaUserPlus className="inline mr-2" /> Sign up
                  </Link>
                  <Link to="/auth/login" className="hover:text-pink-600" onClick={toggleMenu}>
                    <FaUser className="inline mr-2" /> Login
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/manage-ads" className="hover:text-pink-600" onClick={toggleMenu}>Manage my Ads</Link>
                  <Link to="/my-details" className="hover:text-pink-600" onClick={toggleMenu}>My Details</Link>
                  <Link to="/help-contact" className="hover:text-pink-600" onClick={toggleMenu}>Help & Contact</Link>
                  <button onClick={handleLogout} className="text-left hover:text-pink-600">Logout</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Category Nav */}
        <nav className="bg-white shadow-sm border-t border-gray-200 py-2">
          <ul className="flex flex-wrap justify-center px-4 text-sm md:text-base lg:text-lg text-gray-800">
            {fixedCategories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer hover:underline font-medium px-2 py-1 whitespace-nowrap`}
              >
                <Link
                  to={`/listings?category=${encodeURIComponent(category)}`}
                  className="block w-full h-full"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* --- */}
      <footer className="border-t bg-white">
        {/* Main footer container: Adjusted horizontal padding for all screen sizes */}
        <div className="container mx-auto flex flex-col gap-8 py-8 md:flex-row md:gap-12 md:py-12 px-4 sm:px-6 lg:px-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6 items-center md:items-start text-center md:text-left flex-shrink-0"> {/* flex-shrink-0 to prevent brand info from squishing */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-3">
              <img
                src={logo} // Assuming 'logo' variable is defined and imported
                alt="Adaquila Logo"
                className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 rounded-full object-cover" // Slightly larger for large screens
              />
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-pink-600"> {/* Larger text for larger screens */}
                Adaquila
              </span>
            </Link>
            <p className="text-sm md:text-base lg:text-lg text-gray-700 font-medium max-w-xs sm:max-w-none"> {/* Increased text size, removed max-w-xs on sm+ */}
              Powering Ads, Elevating Brands
            </p>
          </div>

          {/* Footer Navigation Grid: More granular control over columns */}
          {/* By default, 1 column on extra small, 2 on small, 3 on medium, 4 on large screens */}
          <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4 sm:gap-x-6 md:gap-x-8 text-center sm:text-left"> {/* Added sm:gap-x-6 */}
            
            {/* Uncomment these sections once you have content for them */}

            {/* Categories in Footer */}
            {/*
            <div className="space-y-3">
              <h3 className="text-base font-medium text-gray-900 mb-2">Categories</h3>
              <ul className="space-y-2 text-sm">
                {fixedCategories.map((category) => (
                  <li key={category}>
                    <Link
                      to={`/products?category=${encodeURIComponent(category)}`}
                      className="inline-block bg-pink-600 text-white px-3 py-1 rounded-full hover:bg-white hover:text-pink-700 transition-colors border border-transparent hover:border-pink-600"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            */}

            {/* Company */}
            {/*
            <div className="space-y-3">
              <h3 className="text-base font-medium text-gray-900 mb-2">Company</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { to: "/about", label: "About" },
                  { to: "/contact", label: "Contact" },
                  { to: "/careers", label: "Careers" },
                  { to: "/press", label: "Press" },
                ].map(({ to, label }) => (
                  <li key={label}><Link to={to} className="text-gray-700 hover:text-pink-600 hover:underline">{label}</Link></li>
                ))}
              </ul>
            </div>
            */}

            {/* Legal */}
            {/*
            <div className="space-y-3">
              <h3 className="text-base font-medium text-gray-900 mb-2">Legal</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { to: "/terms", label: "Terms" },
                  { to: "/privacy", label: "Privacy" },
                  { to: "/cookies", label: "Cookies" },
                  { to: "/licenses", label: "Licenses" },
                ].map(({ to, label }) => (
                  <li key={label}><Link to={to} className="text-gray-700 hover:text-pink-600 hover:underline">{label}</Link></li>
                ))}
              </ul>
            </div>
            */}

          </div>
        </div>

        {/* Copyright Bar: Added as a separate section below the main footer content */}
        <div className="container mx-auto border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-2 text-xs text-gray-600">
            <p className="order-2 md:order-1">© {new Date().getFullYear()} Adaquila. All rights reserved.</p>
            <div className="flex gap-4 order-1 md:order-2">
              <Link to="#" className="hover:underline underline-offset-4">Terms of Service</Link>
              <Link to="#" className="hover:underline underline-offset-4">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}