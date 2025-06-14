// src/pages/Home.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Car,
  HomeIcon,
  Laptop, // Added Laptop icon, though not used in getCategoryIcon, can be useful
  Search,
  ShoppingBag,
  Smartphone,
  Sofa,
} from "../components/icons";
import FeaturedListings from "../components/featured-listings";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

// Import your background image here if it's in src/assets/images/
// If your image is in `public/images/`, you can use it directly like `/images/your-image.jpg`
import backgroundImage from '../../public/images/pexels-mart-production-7577821.jpg'; // <<<--- UPDATE THIS PATH AND FILENAME!

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [categoriesData, setCategoriesData] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case "cars & vehicles":
        return <Car className="h-8 w-8 text-brand-magenta-600" />;
      case "property":
        return <HomeIcon className="h-8 w-8 text-brand-magenta-600" />;
      case "electronics":
        return <Smartphone className="h-8 w-8 text-brand-magenta-600" />;
      case "for sale":
        return <ShoppingBag className="h-8 w-8 text-brand-magenta-600" />;
      case "services":
        return <ShoppingBag className="h-8 w-8 text-brand-magenta-600" />;
      case "pets":
        return <ShoppingBag className="h-8 w-8 text-brand-magenta-600" />;
      case "jobs":
        return <ShoppingBag className="h-8 w-8 text-brand-magenta-600" />;
      case "furniture":
        return <Sofa className="h-8 w-8 text-brand-magenta-600" />;
      case "others":
        return <ShoppingBag className="h-8 w-8 text-brand-magenta-600" />;
      default:
        return <ShoppingBag className="h-8 w-8 text-brand-magenta-600" />;
    }
  };

  const staticCategories = [
    {
      icon: getCategoryIcon("Cars & Vehicles"),
      title: "Cars & Vehicles",
      count: "N/A",
      href: "/listings?category=" + encodeURIComponent("Cars & Vehicles"),
    },
    {
      icon: getCategoryIcon("For Sale"),
      title: "For Sale",
      count: "N/A",
      href: "/listings?category=" + encodeURIComponent("For Sale"),
    },
    {
      icon: getCategoryIcon("Services"),
      title: "Services",
      count: "N/A",
      href: "/listings?category=" + encodeURIComponent("Services"),
    },
    {
      icon: getCategoryIcon("Property"),
      title: "Property",
      count: "N/A",
      href: "/listings?category=" + encodeURIComponent("Property"),
    },
    {
      icon: getCategoryIcon("Pets"),
      title: "Pets",
      count: "N/A",
      href: "/listings?category=" + encodeURIComponent("Pets"),
    },
    {
      icon: getCategoryIcon("Jobs"),
      title: "Jobs",
      count: "N/A",
      href: "/listings?category=" + encodeURIComponent("Jobs"),
    },
    {
      icon: getCategoryIcon("Furniture"),
      title: "Furniture",
      count: "N/A",
      href: "/listings?category=" + encodeURIComponent("Furniture"),
    },
    {
      icon: getCategoryIcon("Electronics"),
      title: "Electronics",
      count: "N/A",
      href: "/listings?category=" + encodeURIComponent("Electronics"),
    },
    {
      icon: getCategoryIcon("Others"),
      title: "Others",
      count: "N/A",
      href: "/listings?category=" + encodeURIComponent("Others"),
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        const response = await fetch(
          "https://backend-nhs9.onrender.com/api/categories/counts"
        );
        if (!response.ok) {
          console.warn("Could not fetch dynamic category counts. Using static data.");
          setCategoriesData(staticCategories);
        } else {
          const data = await response.json();
          const mappedCategories = staticCategories.map((staticCat) => {
            const dynamicCat = data.find(
              (d) => d.name.toLowerCase() === staticCat.title.toLowerCase()
            );
            return {
              ...staticCat,
              count: dynamicCat ? dynamicCat.count : "N/A",
            };
          });
          setCategoriesData(mappedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorCategories("Failed to load categories.");
        setCategoriesData(staticCategories);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const categoriesToDisplay =
    categoriesData.length > 0 ? categoriesData : staticCategories;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      toast.error("Please enter a search query.");
    }
  };

  return (
    <main className="flex-1 bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] sm:h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <img
            src={backgroundImage} // <<<--- Your image source goes here!
            alt="Marketplace Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Your Ultimate{" "}
            <span className="text-pink-500">Marketplace</span> for Everything
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-200 mb-8 drop-shadow-md px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Discover, buy, and sell cars, properties, electronics, and unique
            items with ease.
          </motion.p>
          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-4 items-center"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for cars, houses, phones, services..."
                className="pl-12 pr-4 py-3 rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 w-full text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-lg transition-all duration-300 ease-in-out text-base"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* --- Featured Listings Section (Moved here as requested) --- */}
      <section className="w-full py-16 sm:py-20 bg-brand-magenta-50 border-t border-b border-brand-magenta-200">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Featured Listings
          </h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            Check out our most popular listings across all categories.
          </p>
          <FeaturedListings /> {/* This component handles its own responsiveness */}
          <Button
            variant="outline"
            size="lg"
            className="mt-8 border-brand-magenta-400 text-brand-magenta-600 hover:bg-brand-magenta-600 hover:text-white font-medium transition-all duration-300 ease-in-out text-base"
            onClick={() => navigate("/listings")}
          >
            View All Listings
          </Button>
        </div>
      </section>

      {/* --- Categories Section (Moved after Featured Listings) --- */}
      <section className="w-full py-16 sm:py-20 bg-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Browse Categories
          </h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            Find exactly what you're looking for in our organized categories.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 max-w-full mx-auto">
            {loadingCategories ? (
              <p className="col-span-full text-center text-gray-600">
                Loading categories...
              </p>
            ) : errorCategories ? (
              <p className="col-span-full text-center text-red-500">
                {errorCategories}
              </p>
            ) : (
              categoriesToDisplay.map((category) => (
                <div
                  key={category.title}
                  onClick={() => navigate(category.href)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-brand-magenta-500 group bg-white h-full">
                    <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center h-full justify-center">
                      <div className="mb-3 sm:mb-4 rounded-full bg-brand-magenta-100 p-3 text-brand-magenta-600 group-hover:bg-brand-magenta-600 group-hover:text-white transition-colors duration-300">
                        {category.icon}
                      </div>
                      <div className="bg-brand-magenta-600 text-white px-4 py-1.5 rounded-full font-medium text-sm group-hover:bg-white group-hover:text-brand-magenta-700 transition-colors border border-transparent group-hover:border-brand-magenta-500">
                        {category.title}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        {typeof category.count === "number"
                          ? `${category.count} listings`
                          : "N/A listings"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="w-full py-16 sm:py-20 bg-gray-50 border-t border-gray-100">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-5 text-center lg:text-left">
              <div className="inline-block rounded-lg bg-brand-magenta-600 px-3 py-1 text-sm text-white font-medium">
                Sell Fast
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Ready to sell your items?
              </h2>
              <p className="text-gray-600 text-lg max-w-lg mx-auto lg:mx-0">
                Create an account and start listing your items in minutes. Reach
                thousands of potential buyers.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row justify-center lg:justify-start">
                <Link to="/auth/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-semibold transition-colors duration-300"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/how-it-works" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-gray-300 text-gray-800 hover:bg-gray-100 font-medium transition-colors duration-300"
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
                className="rounded-xl object-cover shadow-lg max-w-full h-auto w-full md:w-[400px] lg:w-[500px]"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}