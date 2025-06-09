// src/pages/EditListingPage.jsx
"use client";

import React, { useState, useEffect, useContext, useRef } from 'react'; // Import useRef
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../layouts/AuthProvider';

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
import { toast } from "react-hot-toast";

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

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loadingAuth } = useContext(AuthContext);

  const [listingData, setListingData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    location: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Use a ref to track if the explicit submit button was clicked
  const submitButtonClickedRef = useRef(false); // NEW: Ref to track button click

  useEffect(() => {
    const fetchListing = async () => {
      if (loadingAuth) {
        console.log("Auth is still loading in useEffect...");
        return;
      }

      if (!isAuthenticated || !user?._id) {
        console.log("Not authenticated or user ID missing. Redirecting.");
        toast.error("Please log in to edit ads.");
        setLoading(false);
        navigate('/auth/login', { state: { from: window.location.pathname } });
        return;
      }

      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Authentication token missing. Redirecting to login.");
        setError("Authentication token missing. Please log in again.");
        toast.error("Authentication token missing.");
        setLoading(false);
        navigate('/auth/login', { state: { from: window.location.pathname } });
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

        console.log("Fetched listing data:", data);
        console.log("Logged-in user from AuthContext:", user);
        const listingOwnerId = data.user?._id || data.owner;
        console.log("Listing owner ID determined:", listingOwnerId);
        console.log("Current user ID from AuthContext (user._id):", user._id);

        if (!listingOwnerId || listingOwnerId !== user._id) {
          console.log("Authorization failed: Mismatch or missing owner ID. Setting isOwner to false.");
          setIsOwner(false);
          setError("You are not authorized to edit this ad.");
          toast.error("You are not authorized to edit this ad.");
          setLoading(false);
          return;
        }
        console.log("Authorization successful! Setting isOwner to true.");
        setIsOwner(true);

        setListingData(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price ? String(data.price) : '',
          category: data.category || '',
          subcategory: data.subcategory || '',
          location: data.location || '',
        });
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(`Failed to load ad: ${err.message}.`);
        toast.error(`Failed to load ad: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      if (!loadingAuth) {
        fetchListing();
      }
    } else {
      setLoading(false);
      setError("No listing ID provided for editing.");
      toast.error("Invalid access. No listing ID.");
      navigate('/manage-ads');
    }
  }, [id, user, isAuthenticated, loadingAuth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    console.log(`Select change: ${name} to ${value}`);
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'category') {
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  };

  const handleSubmit = async (e) => {
    // ALWAYS prevent default to stop page refresh
    e.preventDefault();
    console.log("handleSubmit triggered!");
    console.log("Event type that triggered handleSubmit:", e.type);

    // CRITICAL: Only proceed with API call if the explicit submit button was clicked
    if (!submitButtonClickedRef.current) {
        console.log("handleSubmit triggered, but not by explicit button click. Preventing API call.");
        return; // Exit if not explicitly submitted
    }

    // Reset the ref immediately
    submitButtonClickedRef.current = false;

    // --- Rest of your submission logic ---
    if (!isAuthenticated || !user?._id || !isOwner) {
      toast.error("You must be logged in and the ad owner to update.");
      console.warn("Attempted submission without auth/ownership.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      toast.error("Authentication token missing.");
      setSubmitting(false);
      navigate('/auth/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      const response = await fetch(`https://backend-nhs9.onrender.com/api/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update listing');
      }

      toast.success("Ad updated successfully!");
      console.log("Ad updated successfully, navigating...");
      setTimeout(() => {
        navigate('/manage-ads');
      }, 1500);

    } catch (err) {
      console.error("Error updating listing:", err);
      setError(`Failed to update ad: ${err.message}.`);
      toast.error(`Failed to update ad: ${err.message}.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[60vh]">
        <p className="text-xl text-gray-700">Loading ad details...</p>
      </main>
    );
  }

  if (error || !listingData || !isOwner) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[60vh]">
        <p className="text-xl text-red-600 mb-4">Error: {error || "Access Denied or Ad Not Found."}</p>
        <Button onClick={() => navigate('/manage-ads')} className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium">
          Back to Your Ads
        </Button>
      </main>
    );
  }

  return (
    <main className="flex-1 py-12 px-4 md:px-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Edit Your Ad</CardTitle>
            <CardDescription className="text-gray-600">Update the details of your listing.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* IMPORTANT: Keep onSubmit={handleSubmit} on the form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-2">
                <Label htmlFor="price">Price (Ksh)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  required
                />
              </div>

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
                      {fixedCategories.map(cat => (
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
                    disabled={!formData.category}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="none">N/A (No Subcategory)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g., Nairobi, Kenya"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {listingData?.images && listingData.images.length > 0 && (
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
                    (This form currently updates text fields only. Image upload/removal is handled separately if needed for edit. If you need to manage images, please use the other form on the "Post Ad" page which has image handling.)
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/manage-ads')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit" // IMPORTANT: Changed back to type="submit"
                  // NEW: Add onClick to set the ref true just before submission
                  onClick={() => { submitButtonClickedRef.current = true; }}
                  className="w-full sm:w-auto bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium py-2"
                  disabled={submitting}
                >
                  {submitting ? 'Updating Ad...' : 'Update Ad'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}