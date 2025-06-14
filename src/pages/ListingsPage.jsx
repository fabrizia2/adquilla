// src/pages/AllListingsPage.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'react-hot-toast';

export default function AllListingsPage() {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQueryParam, setSearchQueryParam] = useState(''); // New state for search query param
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categories = [
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

  // --- Effect 1: Fetch all listings on component mount ---
  useEffect(() => {
    const fetchAllListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://backend-nhs9.onrender.com/api/listings");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAllListings(data);
      } catch (err) {
        console.error("Error fetching all listings:", err);
        setError(`Failed to load listings: ${err.message}. Please try again later.`);
        toast.error("Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllListings();
  }, []);

  // --- Effect 2: Read URL params and update state ---
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearchQuery = searchParams.get('search'); // Get search query from URL

    // Update selectedCategory state
    if (urlCategory) {
      const matchedCategory = categories.find(cat => cat.toLowerCase() === urlCategory.toLowerCase());
      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
      } else {
        setSelectedCategory("Others"); // Fallback for unknown categories
      }
    } else {
      setSelectedCategory("");
    }

    // Update searchQueryParam state
    setSearchQueryParam(urlSearchQuery || ''); // Set to empty string if no search param
  }, [searchParams, categories]); // Depend on searchParams and categories


  // --- Effect 3: Filter listings whenever allListings, selectedCategory, or searchQueryParam changes ---
  useEffect(() => {
    let currentFiltered = allListings;

    // Apply category filter
    if (selectedCategory) {
      if (selectedCategory.toLowerCase() === "others") {
        const nonOthersCategories = categories.filter(cat => cat.toLowerCase() !== "others");
        const predefinedCategoriesLower = nonOthersCategories.map(cat => cat.toLowerCase());

        currentFiltered = currentFiltered.filter(listing =>
          listing.category && !predefinedCategoriesLower.includes(listing.category.toLowerCase())
        );
      } else {
        currentFiltered = currentFiltered.filter(
          listing => listing.category && listing.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
    }

    // Apply search filter (after category filter)
    if (searchQueryParam) {
      const lowerCaseSearchQuery = searchQueryParam.toLowerCase();
      currentFiltered = currentFiltered.filter(listing =>
        // Check if title or description (or other fields) include the search query
        (listing.title && listing.title.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (listing.description && listing.description.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (listing.location && listing.location.toLowerCase().includes(lowerCaseSearchQuery))
        // Add more fields here as needed, e.g., listing.tags.toLowerCase().includes(lowerCaseSearchQuery)
      );
    }

    setFilteredListings(currentFiltered);
  }, [allListings, selectedCategory, searchQueryParam, categories]);


  // --- Event handler for dropdown change ---
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);

    // Update the URL query parameter for category, preserving search query if any
    const currentParams = Object.fromEntries(searchParams.entries());
    if (newCategory) {
      setSearchParams({ ...currentParams, category: newCategory });
    } else {
      // Remove category param if "All Categories" is selected
      const { category, ...rest } = currentParams; // Destructure to remove category
      setSearchParams(rest);
    }
  };


  if (loading) {
    return (
      <main className="flex-1 py-12 px-4 md:px-6 bg-gray-100 min-h-[60vh] flex justify-center items-center">
        <p className="text-xl text-gray-700">Loading listings...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 py-12 px-4 md:px-6 bg-gray-100 min-h-[60vh] flex justify-center items-center">
        <p className="text-xl text-red-600 mb-4">Error: ${error}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 py-12 px-4 md:px-6 bg-gray-100">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {selectedCategory ? `${selectedCategory} Listings` :
           (searchQueryParam ? `Search Results for "${searchQueryParam}"` : "All Listings")}
        </h1>

        {/* Category Filter Dropdown */}
        <div className="mb-8 flex justify-center">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 text-lg"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Display Filtered Listings */}
        {filteredListings.length === 0 && !loading && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700">
              No listings found for {selectedCategory ? selectedCategory : "this criteria"}
              {searchQueryParam && ` matching "${searchQueryParam}"`}.
            </p>
            <Link to="/post-ad" className="mt-4 inline-block text-brand-magenta-600 hover:underline">Post one now!</Link>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredListings.map((listing) => (
            <Card
              key={listing._id}
              className="overflow-hidden h-full transition-all hover:shadow-lg cursor-pointer bg-white border-gray-200 hover:border-brand-magenta-300"
              onClick={() => navigate(`/listing/${listing._id}`)}
            >
              <div className="relative">
                <img
                  src={listing.images?.[0] || "/images/carr.png"}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                {listing.featured && (
                  <Badge className="absolute top-2 right-2 bg-brand-magenta-600 hover:bg-brand-magenta-600 text-white font-medium">
                    Featured
                  </Badge>
                )}
              </div>
              <CardHeader className="p-4 pb-0">
                <h3 className="text-lg font-medium line-clamp-1 text-gray-800">{listing.title}</h3>
              </CardHeader>
              <CardContent className="p-4 pt-2">
              <p className="text-xl font-bold text-brand-magenta-600">
                {listing.price ?
                  `${listing.currency || 'Ksh.'} ${parseFloat(listing.price).toLocaleString('en-KE')}`
                  : "Price negotiable"
                }
              </p>
                <p className="text-sm text-gray-600">{listing.location}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t border-gray-200">
                <Badge className="bg-brand-magenta-600 text-white hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-500">
                  {listing.category || "N/A"}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}