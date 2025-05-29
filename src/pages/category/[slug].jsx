"use client"

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { ChevronDown, Filter, Search, ShoppingBag } from "../../components/icons"

export default function CategoryPage() {
  const navigate = useNavigate();
  const { slug } = useParams(); // This will be the category slug (e.g., 'vehicles', 'properties')

  const [categoryData, setCategoryData] = useState({
    title: "",
    description: "",
    count: 0,
    listings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryListings = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construct the API URL to fetch listings by category
        // Assuming your backend supports filtering by a 'category' query parameter
        const response = await fetch(`https://backend-nhs9.onrender.com/api/listings?category=${slug}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch category listings');
        }

        const data = await response.json(); // Assuming backend returns an array of listings

        // You'll need to transform the backend data to fit your frontend's expected structure
        // The backend likely returns an array of listings directly.
        // We'll simulate the category title and description based on the slug.
        // In a more complex app, you might have a separate /api/categories/:slug endpoint
        // that provides title, description, and count.

        const fetchedListings = data.map(listing => ({
          id: listing._id, // Use MongoDB _id for unique key
          title: listing.title,
          price: listing.price ? `$${listing.price}` : 'Price not specified', // Format price
          location: listing.location || 'N/A',
          image: listing.images?.[0] || "/images/carr.png", // Use first image or default
          featured: listing.featured || false, // Default to false if not provided
          // Add any other fields you need
        }));

        setCategoryData({
          title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '), // Basic title from slug
          description: `Browse ${slug.replace(/-/g, ' ').toLowerCase()} listings.`, // Basic description
          count: fetchedListings.length, // Count based on fetched listings
          listings: fetchedListings,
        });

      } catch (err) {
        console.error("Error fetching category listings:", err);
        setError(`Failed to load listings for ${slug}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryListings();
    }
  }, [slug]); // Re-run effect whenever the 'slug' param changes

  // --- Conditional Rendering based on Loading/Error states ---
  if (loading) {
    return (
      <main className="flex-1 py-6 md:py-12 bg-white flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-gray-600">Loading listings for {slug}...</p>
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

  // Fallback for category not found after attempting to fetch
  if (!categoryData.title && !loading && !error) {
    return (
        <main className="flex-1">
            <section className="w-full py-6 md:py-12 bg-white border border-gray-300 shadow-inner">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-start space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                                <span className="bg-red-600 text-white px-4 py-2 rounded-md inline-block">
                                    Category Not Found
                                </span>
                            </h1>
                            <p className="text-gray-700 mt-2">
                                The category "{slug}" does not exist or has no listings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full py-12 bg-white">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-brand-magenta-100 p-6 mb-4">
                            <ShoppingBag className="h-10 w-10 text-brand-magenta-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">No listings found</h3>
                        <p className="text-gray-700 mt-2 mb-6">There are currently no listings in this category.</p>
                        <Button
                            onClick={() => navigate("/create-listing")}
                            className="bg-brand-magenta-600 hover:bg-brand-magenta-600 text-white font-medium"
                        >
                            Create a Listing
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
  }

  // --- Actual Category Display (when data is available) ---
  return (
    <main className="flex-1">
      <section className="w-full py-6 md:py-12 bg-white border border-gray-300 shadow-inner">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                <span className="bg-brand-magenta-600 text-white px-4 py-2 rounded-md inline-block">
                  {categoryData.title}
                </span>
              </h1>
              <p className="text-gray-700 mt-2">
                {categoryData.description} • {categoryData.count} listings
              </p>
            </div>
            <div className="w-full flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-600" />
                <Input
                  type="search"
                  placeholder={`Search in ${categoryData.title.toLowerCase()}...`}
                  className="pl-8 w-full border-gray-300 focus:border-brand-magenta-600 focus:ring-brand-magenta-600"
                />
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-300 hover:bg-gray-700 font-medium"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <Button className="bg-brand-magenta-600 hover:bg-brand-magenta-600 text-white font-medium">Search</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.listings.map((listing) => (
              <Card
                key={listing.id} // Use the transformed 'id' (which is MongoDB _id)
                className="overflow-hidden h-full transition-all hover:shadow-lg cursor-pointer border-gray-200 hover:border-brand-magenta-300 bg-white"
                onClick={() => navigate(`/listing/${listing.id}`)}
              >
                <div className="relative">
                  <img
                    src={listing.image || "/images/carr.png"}
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
                  <h3 className="text-lg font-medium line-clamp-1 text-gray-900">{listing.title}</h3>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xl font-bold text-brand-magenta-600">{listing.price}</p>
                  <p className="text-sm text-gray-500">{listing.location}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 border-t border-gray-200">
                  <Badge className="bg-brand-magenta-600 text-white hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-600 mt-3">
                    {categoryData.title} {/* Use the dynamically set category title */}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>

          {categoryData.listings.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-brand-magenta-400 text-brand-magenta-600 hover:bg-brand-magenta-600 font-medium"
              >
                Load More
              </Button>
            </div>
          )}

          {categoryData.listings.length === 0 && ( // This condition is now also true if API returns empty array
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-brand-magenta-100 p-6 mb-4">
                <ShoppingBag className="h-10 w-10 text-brand-magenta-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">No listings found</h3>
              <p className="text-gray-700 mt-2 mb-6">There are currently no listings in this category.</p>
              <Button
                onClick={() => navigate("/create-listing")}
                className="bg-brand-magenta-600 hover:bg-brand-magenta-600 text-white font-medium"
              >
                Create a Listing
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}