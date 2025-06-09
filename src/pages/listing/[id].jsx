"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Calendar, Heart, MapPin, MessageCircle, Phone, Share2, User } from "../../components/icons";
import { toast } from "react-hot-toast"; // Assuming you have react-hot-toast for notifications

export default function ListingPage() {
  const { id } = useParams();
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false); // State for phone number visibility

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://backend-nhs9.onrender.com/api/listings/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch listing');
        }

        const data = await response.json();
        setListingData(data);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(`Failed to load listing: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  // Handler for "Show Phone Number" button
  const handleShowPhoneNumber = () => {
    // Now consistently checking for 'phone'
    if (listingData?.user?.phone) {
      setShowPhoneNumber(prev => !prev); // Toggle visibility
      toast.success(showPhoneNumber ? "Phone number hidden" : "Phone number displayed!");
    } else {
      toast.error("Phone number not available for this seller.");
    }
  };

  // Handler for "Message Seller" button
  const handleMessageSeller = () => {
    if (listingData?.user?._id) { // Access user ID via listingData.user
      console.log(`Navigating to chat with seller ID: ${listingData.user._id}`);
      toast.info(`Simulating message to seller ${listingData.user._id}.`);
      // In a real application, you would navigate to a chat page like:
      // navigate(`/chat/${listingData.user._id}`);
    } else {
      toast.error("Cannot message seller: User ID not available.");
    }
  };

  // Handler for "Save" button
  const handleSaveListing = () => {
    toast.info("Save feature coming soon!");
    console.log("Save Listing clicked for ID:", listingData._id);
    // Implement save logic here (e.g., add to user's favorites)
  };

  // Handler for "Share" button
  const handleShareListing = () => {
    if (navigator.share) {
      navigator.share({
        title: listingData.title,
        text: listingData.description,
        url: window.location.href, // Current URL of the listing
      }).then(() => {
        toast.success("Listing shared successfully!");
      }).catch((error) => {
        console.error('Error sharing:', error);
        toast.error("Failed to share listing.");
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Listing link copied to clipboard!");
      console.log("Share feature clicked. Link copied.");
    }
  };


  if (loading) {
    return (
      <main className="flex-1 py-6 md:py-12 bg-white flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-gray-600">Loading ad details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 py-6 md:py-12 bg-white flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-red-600">Error: {error}</p>
        <p className="text-gray-600 mt-2">Please try again later.</p>
      </main>
    );
  }

  if (!listingData) {
    return (
      <main className="flex-1 py-6 md:py-12 bg-white flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-gray-600">Listing not found.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 py-6 md:py-12 bg-white border">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-brand-magenta-600 text-black hover:bg-black hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-600">
                  {listingData.category || 'N/A'}
                </Badge>
                <Badge className="bg-brand-magenta-600 text-black hover:bg-black hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-600">
                  {listingData.subcategory || 'N/A'}
                </Badge>
                {listingData.featured && (
                  <Badge className="bg-brand-magenta-600 hover:bg-brand-magenta-600 text-black font-medium">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold md:text-3xl text-gray-800">{listingData.title}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{listingData.location || 'N/A'}</span>
                <span className="text-sm">•</span>
                <Calendar className="h-4 w-4" />
                <span>Posted {listingData.postedDate || (listingData.createdAt ? new Date(listingData.createdAt).toLocaleDateString() : 'N/A')}</span>
              </div>
              <p className="text-2xl font-bold text-brand-magenta-600">
                {listingData.price ? `Ksh.${listingData.price}` : 'Price not specified'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border py-2 px-2">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={listingData.images?.[0] || "/images/carr.png"}
                  alt={listingData.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {listingData.images?.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={image || "/images/carr.png"}
                      alt={`${listingData.title} - Image ${index + 2}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-700">Description</h2>
              <p className="text-gray-500 leading-relaxed">{listingData.description || 'No description provided.'}</p>
            </div>

          </div>

          <div className="space-y-6">
            {/* Seller Contact Card */}
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-gray-800 text-gray-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-brand-magenta-100 p-2">
                    <User className="h-6 w-6 text-brand-magenta-600" />
                  </div>
                  <div>
                    {/* Accessing user data from listingData.user (assuming backend populates it) */}
                    <p className="font-medium text-gray-300">{listingData.user?.name || listingData.user?.username || 'Seller Name'}</p>
                    <p className="text-sm text-gray-400">
                      Member since{' '}
                      {listingData.user?.createdAt
                        ? new Date(listingData.user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Listings</p>
                    <p className="font-medium text-gray-200">{listingData.user?.listingsCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Rating</p>
                    <p className="font-medium text-gray-200">{listingData.user?.rating ? `${listingData.user.rating}/5` : 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    className="w-full bg-brand-magenta-600 hover:bg-brand-magenta-700 text-black font-medium"
                    onClick={handleShowPhoneNumber}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {/* Now consistently displaying 'phone' */}
                    {showPhoneNumber ? (listingData.user?.phone || 'No Phone') : 'Show Phone Number'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-400 hover:bg-gray-700 font-medium"
                    onClick={handleMessageSeller}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" /> Message Seller
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Listing Actions Card */}
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-medium text-gray-400">Listing Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-400 hover:bg-gray-700 font-medium"
                    onClick={handleSaveListing}
                  >
                    <Heart className="mr-2 h-4 w-4" /> Save
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-400 hover:bg-gray-700 font-medium"
                    onClick={handleShareListing}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
                <div className="text-sm text-gray-300">
                  <p>Ad ID: {listingData._id || 'N/A'}</p>
                  <p>Views: {listingData.views || 0}</p>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips Card */}
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4 text-gray-400">Safety Tips</h3>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li>• Meet in a safe, public place</li>
                  <li>• Don't pay or transfer money in advance</li>
                  <li>• Inspect the item before purchasing</li>
                  <li>• Verify the seller's identity</li>
                  <li>• Report suspicious behavior</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}