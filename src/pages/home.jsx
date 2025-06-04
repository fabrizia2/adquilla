// src/pages/Home.jsx
"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Car,        // For Cars & Vehicles
  HomeIcon,   // For Property
  Laptop,     // For Electronics (can be used for Computers too)
  Search,
  ShoppingBag, // General items, or 'For Sale', 'Others'
  Smartphone, // For Electronics
  Sofa,       // For Furniture (if you add it back)
  // You might need to import more specific icons if available in your components/icons.jsx
  // e.g., FaDog for Pets, FaBriefcase for Jobs, FaUsers for Community, FaBoxOpen for For Sale, FaHandsHelping for Services
} from "../components/icons"
import FeaturedListings from "../components/featured-listings" // This component will fetch its own data
import { Card, CardContent } from "../components/ui/card"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast" // For toast notifications

export default function Home() {
  const navigate = useNavigate()

  // State for Categories with counts
  const [categoriesData, setCategoriesData] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [errorCategories, setErrorCategories] = useState(null)


  // Helper function to get icons based on category name
  // IMPORTANT: Ensure these icons (Car, HomeIcon, Smartphone, ShoppingBag)
  // are correctly exported from your `../components/icons.jsx` file.
  // If you want more specific icons for 'Pets', 'Jobs', 'Community', 'Services', 'For Sale',
  // you'll need to add them to your `icons.jsx` and import them here.
  const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case 'cars & vehicles': return <Car className="h-8 w-8" />;
      case 'property': return <HomeIcon className="h-8 w-8" />;
      case 'electronics': return <Smartphone className="h-8 w-8" />;
      // Using ShoppingBag as a general icon for categories without specific icons
      case 'for sale': return <ShoppingBag className="h-8 w-8" />;
      case 'services': return <ShoppingBag className="h-8 w-8" />;
      case 'pets': return <ShoppingBag className="h-8 w-8" />;
      case 'jobs': return <ShoppingBag className="h-8 w-8" />;
      case 'community': return <ShoppingBag className="h-8 w-8" />;
      case 'others': return <ShoppingBag className="h-8 w-8" />;
      default: return <ShoppingBag className="h-8 w-8" />; // Fallback icon
    }
  };

  // Static categories with your specified names and their initial icon/href
  // The 'count' will be updated dynamically if the API call is successful.
  const staticCategories = [
    { icon: getCategoryIcon("Cars & Vehicles"), title: "Cars & Vehicles", count: "N/A", href: "/category/cars-vehicles" },
    { icon: getCategoryIcon("For Sale"), title: "For Sale", count: "N/A", href: "/category/for-sale" },
    { icon: getCategoryIcon("Services"), title: "Services", count: "N/A", href: "/category/services" },
    { icon: getCategoryIcon("Property"), title: "Property", count: "N/A", href: "/category/property" },
    { icon: getCategoryIcon("Pets"), title: "Pets", count: "N/A", href: "/category/pets" },
    { icon: getCategoryIcon("Jobs"), title: "Jobs", count: "N/A", href: "/category/jobs" },
    { icon: getCategoryIcon("Community"), title: "Community", count: "N/A", href: "/category/community" },
    { icon: getCategoryIcon("Electronics"), title: "Electronics", count: "N/A", href: "/category/electronics" },
    { icon: getCategoryIcon("Others"), title: "Others", count: "N/A", href: "/category/others" },
  ];


  // Fetch Categories with Counts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        // IMPORTANT: This API endpoint (`/api/categories/counts`) must exist on your backend.
        // It should return an array of objects like:
        // [{ name: "Cars & Vehicles", count: 123 }, { name: "Electronics", count: 456 }, ...]
        const response = await fetch("https://backend-nhs9.onrender.com/api/categories/counts");
        if (!response.ok) {
          console.warn("Could not fetch dynamic category counts. Using static data.");
          setCategoriesData(staticCategories); // Fallback to static data on API error/non-existence
        } else {
          const data = await response.json();
          // Map backend response to your desired format
          const mappedCategories = staticCategories.map(staticCat => {
            const dynamicCat = data.find(d => d.name.toLowerCase() === staticCat.title.toLowerCase());
            return {
              ...staticCat,
              count: dynamicCat ? dynamicCat.count : 'N/A' // Use dynamic count if found, else N/A
            };
          });
          setCategoriesData(mappedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorCategories("Failed to load categories.");
        setCategoriesData(staticCategories); // Fallback to static data on network error
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount


  // Use dynamic categories if available, else static
  const categoriesToDisplay = categoriesData.length > 0 ? categoriesData : staticCategories;


  return (
    <main className="flex-1 bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        {/* YouTube Background Video */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none bg-white">
          {/* IMPORTANT: Replace "about:blank" with your actual YouTube embed URL.
              Example: src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=YOUR_VIDEO_ID&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1"
              - `autoplay=1`: Starts video automatically (may be restricted by browsers).
              - `mute=1`: Mutes the video (often required for autoplay).
              - `loop=1&playlist=YOUR_VIDEO_ID`: Makes the video loop. `playlist` must be the same as `YOUR_VIDEO_ID`.
              - `controls=0`, `showinfo=0`, `rel=0`, `modestbranding=1`: For a cleaner background video look.
              - `enablejsapi=1`: Allows JavaScript control (not strictly needed for just autoplay/loop).
          */}
          <iframe
            className="w-full h-full object-cover bg-white"
            src="about:blank" // Placeholder for now, replace with actual YouTube embed URL
            title="AdShare Background Video"
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder="0"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-10 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-3xl">
          <motion.h1
            className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Powering Ads, <span className="text-pink-600">Elevating Brands</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-200 mb-6 drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Your one-stop marketplace for cars, properties, electronics, and more.
          </motion.p>

          <div className="relative w-full max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
            <Input
              type="search"
              placeholder="Search for anything..."
              className="pl-12 pr-4 py-3 rounded-full border-none shadow-md text-gray-800"
            />
          </div>

          <Button className="mt-4 px-8 py-3 rounded-full bg-pink-600 text-white font-semibold shadow-lg transition">
            Search
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Browse Categories</h2>
          <p className="text-gray-900 mb-10 max-w-xl mx-auto">
            Find exactly what you're looking for in our organized categories.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
            {loadingCategories ? (
              <p className="col-span-full text-center text-gray-600">Loading categories...</p>
            ) : errorCategories ? (
              <p className="col-span-full text-center text-red-500">{errorCategories}</p>
            ) : (
              categoriesToDisplay.map((category) => ( // Removed index, using category.title as key
                <div
                  key={category.title} // Using category title as key for uniqueness
                  onClick={() => navigate(category.href)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <Card className="hover:shadow-md transition border border-gray-800 hover:border-brand-magenta-300 group bg-white">
                    <CardContent className="p-6 flex flex-col items-center text-center h-60 justify-center">
                      <div className="mb-4 rounded-full bg-brand-magenta-600 p-3 text-white">
                        {category.icon}
                      </div>
                      <div className="bg-brand-magenta-600 text-white px-5 py-1.5 rounded-full font-medium group-hover:bg-white group-hover:text-brand-magenta-700 transition-colors border border-transparent group-hover:border-brand-magenta-500">
                        {category.title}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {typeof category.count === 'number' ? `${category.count} listings` : 'N/A listings'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="w-full py-20 bg-brand-magenta-20 border border-brand-magenta-200 shadow-xl rounded-lg">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Featured Listings</h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            Check out our most popular listings across all categories.
          </p>
          {/* FeaturedListings component now handles its own loading, error, and data display */}
          <FeaturedListings />

          <Button
            variant="outline"
            size="lg"
            className="mt-8 border-brand-magenta-400 text-brand-magenta-600 hover:bg-brand-magenta-600 font-medium"
            onClick={() => navigate("/listings")}
          >
            View All Listings
          </Button>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-5">
              <div className="inline-block rounded-lg bg-brand-magenta-600 px-3 py-1 text-sm text-white font-medium">
                Sell Fast
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Ready to sell your items?
              </h2>
              <p className="text-gray-600 text-lg max-w-lg">
                Create an account and start listing your items in minutes. Reach thousands of potential buyers.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to="/auth/register">
                  <Button size="lg" className="bg-brand-magenta-600 hover:bg-black text-white font-semibold">
                    Get Started
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-300 text-gray-300 hover:bg-brand-magenta-600 font-medium"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/carr.png"
                alt="Illustration of selling online"
                width={400}
                height={400}
                className="rounded-xl object-cover shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}