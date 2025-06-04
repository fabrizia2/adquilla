// src/pages/CategoryListingsPage.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'react-hot-toast';

export default function CategoryListingsPage() {
  const { categorySlug } = useParams(); // Get the category slug from the URL (e.g., "for-sale")
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      // Construct the API URL to fetch listings for the specific category.
      // IMPORTANT:  Your backend *must* have an endpoint like this.
      const apiUrl = `https://backend-nhs9.onrender.com/api/listings/category/${categorySlug}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error(`Error fetching listings for category "${categorySlug}":`, err);
        setError(`Failed to load listings for category "${categorySlug}". Please try again later.`);
        toast.error(`Failed to load listings for category "${categorySlug}".`);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [categorySlug]); // Re-fetch when the categorySlug changes

  const displayCategoryName = categorySlug
    ? categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'All'; // Format the category name for display (e.g., "For Sale")


  if (loading) {
    return (
      <main className="flex-1 py-12 px-4 md:px-6 bg-gray-100 min-h-[60vh] flex justify-center items-center">
        <p className="text-xl text-gray-700">Loading {displayCategoryName} listings...</p>
      </main>
    );
  }

  if (error) {
    return (
       <main className="flex-1 py-12 px-4 md:px-6 bg-gray-100 min-h-[60vh] flex justify-center items-center">
        <p className="text-xl text-red-600">Error: {error}</p>
      </main>
    );
  }

  if (listings.length === 0) {
    return (
      <main className="flex-1 py-12 px-4 md:px-6 bg-gray-100 min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-xl text-gray-700">No listings found in the {displayCategoryName} category.</p>
        <Link to="/post-ad" className="mt-4 text-brand-magenta-600 hover:underline">Post one now!</Link>
      </main>
    );
  }


  return (
    <main className="flex-1 py-12 px-4 md:px-6 bg-gray-100">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {displayCategoryName} Listings
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <Card
              key={listing._id} // Assuming your listings have a unique _id
              className="overflow-hidden h-full transition-all hover:shadow-lg cursor-pointer bg-white border-gray-200 hover:border-brand-magenta-300"
              onClick={() => navigate(`/listing/${listing._id}`)}
            >
              <div className="relative">
                <img
                  src={listing.images?.[0] || "/images/carr.png"} // Use the first image, or a placeholder
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                {listing.featured && (
                  <Badge className="absolute top-2 right-2 bg-brand-magenta-600 text-white font-medium">
                    Featured
                  </Badge>
                )}
              </div>
              <CardHeader className="p-4 pb-0">
                <h3 className="text-lg font-medium line-clamp-1 text-gray-800">{listing.title}</h3>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-xl font-bold text-brand-magenta-600">
                  {listing.price ? `Ksh ${listing.price.toLocaleString()}` : "Price negotiable"}
                </p>
                <p className="text-sm text-gray-600">{listing.location}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t border-gray-200">
                <Badge className="bg-brand-magenta-600 text-white">
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