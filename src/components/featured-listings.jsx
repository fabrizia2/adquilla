// src/components/featured-listings.jsx
"use client";

import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "react-hot-toast"; // Assuming you have toast notifications setup

export default function FeaturedListings() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://backend-nhs9.onrender.com/api/listings/featured");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setListings(data); // Set the fetched data to state
      } catch (err) {
        console.error("Error fetching featured listings:", err);
        setError("Failed to load featured listings. Please try again later.");
        toast.error("Failed to load featured listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-lg text-gray-600">Loading featured ads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-lg text-gray-600">No featured listings found at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      {listings.map((listing) => (
        <Card
          key={listing._id} // Use _id from MongoDB for unique key
          className="overflow-hidden h-full transition-all hover:shadow-lg cursor-pointer bg-white border-gray-200 hover:border-brand-magenta-300"
          onClick={() => navigate(`/listing/${listing._id}`)} // Navigate using _id
        >
          <div className="relative">
            {/* Assuming your backend returns an 'images' array and 'featured' boolean */}
            <img
              src={listing.images?.[0] || "/images/carr.png"} // Use first image from array, fallback to default
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
              {listing.price ? `Ksh ${listing.price.toLocaleString()}` : "Price negotiable"}
            </p>
            <p className="text-sm text-gray-600">{listing.location}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 border-t border-gray-200">
            <Badge className="bg-brand-magenta-600 text-white hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-500">
              {listing.category || "N/A"} {/* Fallback for category */}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}