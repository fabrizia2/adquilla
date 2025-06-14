// src/pages/menu/manage-ads.jsx
"use client";

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../layouts/AuthProvider';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "../../components/icons";
import { ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";


export default function ManageAdsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loadingAuth } = useContext(AuthContext);
  const [userAds, setUserAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [adToDeleteId, setAdToDeleteId] = useState(null);

  const [isFeatureConfirmationOpen, setIsFeatureConfirmationOpen] = useState(false);
  const [adToFeatureId, setAdToFeatureId] = useState(null);

  // Define payment details
  const FEATURE_AD_AMOUNT = 200; // Example amount in KES
  const FEATURE_AD_DURATION = "1 week"; // Example duration

  useEffect(() => {
    const fetchUserAds = async () => {
      if (loadingAuth) {
        return;
      }

      if (!isAuthenticated || !user?._id) {
        setLoading(false);
        setError("Please log in to manage your ads. If you are logged in, your user ID might be missing.");
        console.warn("Fetch aborted in ManageAdsPage: User not authenticated or user ID missing after AuthProvider loaded.");
        return;
      }

      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const userId = user._id;

      try {
        const response = await fetch(`https://backend-nhs9.onrender.com/api/listings/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Backend Error Response (Manage Ads):", errorData);
          throw new Error(errorData.message || 'Failed to fetch ads');
        }

        const data = await response.json();
        setUserAds(data);
      } catch (err) {
        console.error("Error fetching user ads:", err);
        setError(`Failed to load your ads: ${err.message}. Please try again later.`);
        toast.error(`Failed to load your ads: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAds();
  }, [user, isAuthenticated, loadingAuth, navigate]);

  const confirmDelete = (adId) => {
    setAdToDeleteId(adId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAd = async () => {
    if (!adToDeleteId) return;

    toast.loading("Deleting ad...", { id: "deleteAdToast" });

    const token = localStorage.getItem('token');

    if (!token) {
      toast.error("You are not authenticated to delete ads.", { id: "deleteAdToast" });
      setIsDeleteDialogOpen(false);
      return;
    }

    try {
      const response = await fetch(`https://backend-nhs9.onrender.com/api/listings/${adToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete ad');
      }

      setUserAds(prevAds => prevAds.filter(ad => ad._id !== adToDeleteId));
      toast.success("Ad deleted successfully!", { id: "deleteAdToast" });
    } catch (err) {
      console.error("Error deleting ad:", err);
      toast.error(`Error deleting ad: ${err.message}`, { id: "deleteAdToast" });
    } finally {
      setIsDeleteDialogOpen(false);
      setAdToDeleteId(null);
    }
  };

  const confirmFeatureAd = (adId) => {
    setAdToFeatureId(adId);
    setIsFeatureConfirmationOpen(true);
  };

  const handleFeatureAd = async () => {
    if (!adToFeatureId) return;

    toast.loading("Initiating payment...", { id: `featureAd-${adToFeatureId}` });

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to feature an ad.", { id: `featureAd-${adToFeatureId}` });
      setIsFeatureConfirmationOpen(false);
      return;
    }

    // Ensure user email is available for the payment gateway
    if (!user?.email) {
      toast.error("User email not found. Cannot initiate payment.", { id: `featureAd-${adToFeatureId}` });
      setIsFeatureConfirmationOpen(false);
      return;
    }

    const requestBody = {
      email: user.email,
      amount: FEATURE_AD_AMOUNT,
      callback_url: `https://backend-nhs9.onrender.com/api/payments/verify?listingId=${adToFeatureId}`,
    };

    try {
      const response = await fetch('https://backend-nhs9.onrender.com/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to initiate payment.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("Payment initiation error response:", errorData);
        } catch (jsonError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}. Could not parse error response.`;
          console.error("Raw server error response:", await response.text());
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      if (responseData.url) {
        toast.success("Redirecting to payment gateway...", { id: `featureAd-${adToFeatureId}` });
        window.location.href = responseData.url;
      } else {
        toast.error("Payment initiated, but no redirect URL received from the server. Please check your backend's response structure.", { id: `featureAd-${adToFeatureId}` });
        console.error("Backend response missing 'url':", responseData);
      }

    } catch (err) {
      console.error("Error initiating feature ad payment:", err);
      toast.error(`Error: ${err.message}`, { id: `featureAd-${adToFeatureId}` });
    } finally {
      setIsFeatureConfirmationOpen(false);
      setAdToFeatureId(null);
    }
  };


  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[60vh]">
        <p className="text-xl text-gray-700">Loading your ads...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[60vh]">
        <p className="text-xl text-red-600 mb-4 text-center">{error}</p>{/* Added text-center */}
        <Button onClick={() => navigate('/')} className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium">
          Go to Home
        </Button>
      </main>
    );
  }

  if (userAds.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[60vh]">
        <div className="rounded-full bg-brand-magenta-100 p-6 mb-4">
          <ShoppingBag className="h-10 w-10 text-brand-magenta-600" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 text-center">No ads found</h3> {/* Added text-center */}
        <p className="text-gray-700 mt-2 mb-6 text-center">You haven't posted any ads yet. Start by creating one!</p>
        <Button
          onClick={() => navigate("/post-ad")}
          className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium px-6 py-3 text-base" /* Larger button for better tap target */
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Ad
        </Button>
      </main>
    );
  }

  return (
    <main className="flex-1 py-8 px-4 md:py-12 md:px-6 bg-gray-100 min-h-screen"> {/* Adjusted padding */}
      <div className="container mx-auto max-w-7xl"> {/* Increased max-width for larger screens */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"> {/* Added gap, adjusted flex-direction for small screens */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left w-full sm:w-auto"> {/* Adjusted text size and alignment */}
            Your Ads ({userAds.length})
          </h1>
          <Button
            onClick={() => navigate("/post-ad")}
            className="w-full sm:w-auto bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium px-6 py-3 text-base" // Ensure button is responsive
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Ad
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> {/* Adjusted grid cols for better flow on smaller screens */}
          {userAds.map((ad) => (
            <Card key={ad._id} className="relative overflow-hidden h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 bg-gray-200 flex-shrink-0">
                <img
                  src={ad.images?.[0] || "/images/carr.png"}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                {ad.featured && (
                  <Badge className="absolute top-2 right-2 bg-brand-magenta-600 hover:bg-brand-magenta-600 text-white font-medium text-xs px-2 py-1"> {/* Smaller badge text */}
                    Featured
                  </Badge>
                )}
              </div>
              <CardHeader className="p-3 pb-1 flex-grow"> {/* Adjusted padding */}
                <CardTitle className="text-base font-bold text-gray-900 line-clamp-2 md:text-lg">{ad.title}</CardTitle> {/* Adjusted text size */}
                <CardDescription className="text-xs text-gray-500">{ad.location}</CardDescription> {/* Adjusted text size */}
                <p className="text-lg font-bold text-brand-magenta-600 mt-1 md:text-xl"> {/* Adjusted text size */}
                  {ad.price ?
                    `${ad.currency || 'Ksh.'} ${parseFloat(ad.price).toLocaleString('en-KE')}`
                    : 'Price negotiable'
                  }
                </p>
              </CardHeader>
              <CardContent className="p-3 pt-0"> {/* Adjusted padding */}
                <p className="text-xs text-gray-400">
                  Category: {ad.category || 'N/A'} {ad.subcategory && ` / ${ad.subcategory}`}
                </p>
              </CardContent>
              <CardFooter className="p-3 border-t border-gray-200 flex flex-wrap justify-end gap-1.5"> {/* flex-wrap for buttons, smaller gap */}
                {/* Feature Ad Button - appears only if ad is NOT featured */}
                {!ad.featured && (
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1" /* Smaller button, adjusted padding */
                    onClick={() => confirmFeatureAd(ad._id)}
                  >
                    Feature Ad
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-400 hover:bg-gray-200 text-xs px-2 py-1"
                  onClick={() => navigate(`/listing/${ad._id}`)}
                >
                  <Eye className="h-3.5 w-3.5" /> {/* Smaller icon */}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-400 hover:bg-gray-200 text-xs px-2 py-1"
                  onClick={() => navigate(`/listings/${ad._id}`)}
                >
                  <Edit className="h-3.5 w-3.5" /> {/* Smaller icon */}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs px-2 py-1"
                  onClick={() => confirmDelete(ad._id)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> {/* Smaller icon */}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Confirmation AlertDialog */}
      {/* AlertDialogs are generally responsive by default due to their fixed/centered positioning and width settings. */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your ad
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2"> {/* Responsive footer buttons */}
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDeleteAd} className="w-full sm:w-auto">
                Continue
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Feature Ad Confirmation AlertDialog (New) */}
      <AlertDialog open={isFeatureConfirmationOpen} onOpenChange={setIsFeatureConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Feature Your Ad?</AlertDialogTitle>
            <AlertDialogDescription>
              Make your ad stand out! For just <span className="font-bold text-lg text-brand-magenta-600">Ksh {FEATURE_AD_AMOUNT}</span>, your ad will be featured for <span className="font-bold text-lg text-brand-magenta-600">{FEATURE_AD_DURATION}</span>. This will greatly increase its visibility and reach more potential buyers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2"> {/* Responsive footer buttons */}
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => { setIsFeatureConfirmationOpen(false); setAdToFeatureId(null); }} className="w-full sm:w-auto">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleFeatureAd} className="w-full sm:w-auto">
                Pay Now
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}