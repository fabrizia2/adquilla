// src/pages/EditListingPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../layouts/AuthProvider'; // Adjust path if necessary

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
// Assuming you have react-hot-toast for notifications
import { toast } from "react-hot-toast";


export default function EditListingPage() {
  const { id } = useParams(); // Get listing ID from URL
  const navigate = useNavigate();
  const { user, isAuthenticated, loadingAuth } = useContext(AuthContext);

  const [listingData, setListingData] = useState(null); // Original fetched data
  const [formData, setFormData] = useState({ // Form data for editing
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '', // Optional
    location: '',
    // images: [], // Image handling is more complex, will simplify for now
  });

  const [loading, setLoading] = useState(true); // For initial fetch
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false); // To check if current user owns the ad


  // Example Categories (replace with your actual categories from backend or a config)
  // IMPORTANT: Ensure these keys match the category strings that come from your backend
  const categories = {
    'Vehicles': ['Cars', 'Motorcycles', 'Bicycles', 'Trucks'],
    'Electronics': ['Phones', 'Laptops', 'Cameras', 'Tablets'],
    'Real Estate': ['Houses', 'Apartments', 'Land', 'Commercial'],
    'Home & Garden': ['Furniture', 'Appliances', 'Decor', 'Tools'],
    'Fashion': ['Clothing', 'Shoes', 'Accessories'],
    'Services': ['Cleaning', 'Tutoring', 'Repair'],
    'Other': [],
  };

  // --- Fetch Listing Data ---
  useEffect(() => {
    const fetchListing = async () => {
      // Wait for AuthProvider to finish loading authentication status
      if (loadingAuth) {
        return;
      }

      // Redirect if not authenticated or user data is missing
      if (!isAuthenticated || !user?._id) {
        toast.error("Please log in to edit ads.");
        navigate('/login'); // Redirect to login page
        setLoading(false); // Stop loading state
        return;
      }

      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        toast.error("Authentication token missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://backend-nhs9.onrender.com/api/listings/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch listing');
        }

        const data = await response.json();

        // Check if the authenticated user is the owner of the listing
        // Assumes `data.user` holds the ID of the listing owner
        if (data.user._id !== user._id) {
          setIsOwner(false);
          setError("You are not authorized to edit this ad.");
          toast.error("You are not authorized to edit this ad.");
          setLoading(false); // Stop loading state
          return;
        }
        setIsOwner(true); // Set owner status to true if authorized

        setListingData(data);
        // Initialize form data with fetched data
        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price ? String(data.price) : '', // Ensure price is string for input
          category: data.category || '',
          subcategory: data.subcategory || '',
          location: data.location || '',
          // Images handling: For initial version, we only display existing,
          // not allow upload/delete via this form yet.
          // You'll need separate logic for image uploads/removals if required.
        });
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(`Failed to load ad: ${err.message}.`);
        toast.error(`Failed to load ad: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, user, isAuthenticated, loadingAuth, navigate]); // Depend on relevant state

  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // If category changes, reset subcategory
    if (name === 'category') {
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !user?._id || !isOwner) {
      toast.error("You must be logged in and the ad owner to update.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      toast.error("Authentication token missing.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`https://backend-nhs9.onrender.com/api/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Assuming only text data is sent here, no file upload
        },
        body: JSON.stringify(formData), // Send formData as JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update listing');
      }

      // const result = await response.json(); // You might want to process the response
      toast.success("Ad updated successfully!");
      // Optionally, navigate back to manage ads or view the updated ad after a delay
      setTimeout(() => {
        navigate('/manage-ads');
      }, 1500); // Redirect after 1.5 seconds

    } catch (err) {
      console.error("Error updating listing:", err);
      setError(`Failed to update ad: ${err.message}.`);
      toast.error(`Failed to update ad: ${err.message}.`);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Conditional Rendering ---
  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[60vh]">
        <p className="text-xl text-gray-700">Loading ad details...</p>
        {/* You can add a Spinner component here if you have one */}
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[60vh]">
        <p className="text-xl text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => navigate('/manage-ads')} className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium">
          Back to Your Ads
        </Button>
      </main>
    );
  }

  // If listingData is null after loading and no error, or user is not owner
  if (!listingData || !isOwner) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[60vh]">
        <p className="text-xl text-gray-700">Access Denied or Ad Not Found.</p>
        <Button onClick={() => navigate('/manage-ads')} className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium mt-4">
          Back to Your Ads
        </Button>
      </main>
    );
  }

  // Render the form
  return (
    <main className="flex-1 py-12 px-4 md:px-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Edit Your Ad</CardTitle>
            <CardDescription className="text-gray-600">Update the details of your listing.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Ad Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Brand New Smartphone"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide a detailed description of your item..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="e.g., 500"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(categories).map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => handleSelectChange('subcategory', value)}
                    // Use optional chaining here to safely check length
                    disabled={!formData.category || categories[formData.category]?.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Also use optional chaining here for safer mapping */}
                      {categories[formData.category]?.map(sub => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g., New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Existing Images Display */}
              {listingData.images && listingData.images.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Images</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {listingData.images.map((imgUrl, index) => (
                      <div key={index} className="relative w-full h-24 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={imgUrl}
                          alt={`Existing image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    (This form currently updates text fields only. Image upload/removal needs separate backend logic.)
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium py-2"
                disabled={submitting}
              >
                {submitting ? 'Updating Ad...' : 'Update Ad'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}