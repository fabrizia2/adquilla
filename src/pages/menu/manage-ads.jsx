// src/pages/menu/manage-ads.jsx
"use client";

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../layouts/AuthProvider';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "../../components/icons"; // Assuming ShoppingBag is exported from icons or lucide-react
import { ShoppingBag } from "lucide-react"; // Make sure ShoppingBag is imported if from lucide-react
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

    // --- CRITICAL: Construct the requestBody to match backend's expectation ---
    const requestBody = {
      email: user.email, // Use the user's email from AuthContext
      amount: FEATURE_AD_AMOUNT, // Use the defined amount
      // The callback URL where Flutterwave (or other gateway) will redirect after payment
      // It should ideally be a route on your frontend that then calls your backend to verify the payment
      // For this example, I'm setting it to the backend's verify endpoint which will then mark the listing featured.
      // In a production app, you might want a frontend success/failure page here.
      callback_url: `https://backend-nhs9.onrender.com/api/payments/verify?listingId=${adToFeatureId}`,
    };

    console.log("--- Sending to backend (Payment create-checkout-session) ---");
    console.log("URL:", 'https://backend-nhs9.onrender.com/api/payments/create-checkout-session'); // Corrected endpoint
    console.log("Method:", 'POST');
    console.log("Headers:", {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    console.log("Body:", requestBody);
    console.log("--- End of backend request log ---");

    try {
      const response = await fetch('https://backend-nhs9.onrender.com/api/payments/create-checkout-session', { // Corrected endpoint
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
      console.log("Payment initialization response:", responseData);

      // CRITICAL: Use responseData.data.link for redirection as provided by your backend/payment gateway
      if (responseData.data && responseData.data.link) {
        toast.success("Redirecting to payment gateway...", { id: `featureAd-${adToFeatureId}` });
        window.location.href = responseData.data.link; // Redirect to the payment gateway
      } else {
        toast.error("Payment initiated, but no redirect URL received from the server. Please check your backend's response structure.", { id: `featureAd-${adToFeatureId}` });
        console.error("Backend response missing 'data.link':", responseData);
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
        <p className="text-xl text-red-600 mb-4">Error: {error}</p>
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
        <h3 className="text-xl font-medium text-gray-900">No ads found</h3>
        <p className="text-gray-700 mt-2 mb-6 text-center">You haven't posted any ads yet. Start by creating one!</p>
        <Button
          onClick={() => navigate("/post-ad")}
          className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Ad
        </Button>
      </main>
    );
  }

  return (
    <main className="flex-1 py-12 px-4 md:px-6 bg-gray-100">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Ads ({userAds.length})</h1>
          <Button
            onClick={() => navigate("/post-ad")}
            className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Ad
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {userAds.map((ad) => (
            <Card key={ad._id} className="relative overflow-hidden h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 bg-gray-200 flex-shrink-0">
                <img
                  src={ad.images?.[0] || "/images/carr.png"}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                {ad.featured && (
                  <Badge className="absolute top-2 right-2 bg-brand-magenta-600 hover:bg-brand-magenta-600 text-white font-medium">
                    Featured
                  </Badge>
                )}
              </div>
              <CardHeader className="p-4 pb-2 flex-grow">
                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">{ad.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">{ad.location}</CardDescription>
                <p className="text-xl font-bold text-brand-magenta-600 mt-2">
                  {ad.price ? `Ksh ${ad.price.toLocaleString()}` : 'Price negotiable'}
                </p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-gray-400">
                  Category: {ad.category || 'N/A'} {ad.subcategory && ` / ${ad.subcategory}`}
                </p>
              </CardContent>
              <CardFooter className="p-4 border-t border-gray-200 flex justify-end gap-2">
                {/* Feature Ad Button - appears only if ad is NOT featured */}
                {!ad.featured && (
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => confirmFeatureAd(ad._id)}
                  >
                    Feature Ad
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-400 hover:bg-gray-200"
                  onClick={() => navigate(`/listing/${ad._id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-400 hover:bg-gray-200"
                  onClick={() => navigate(`/listings/${ad._id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDelete(ad._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your ad
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDeleteAd}>
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
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => { setIsFeatureConfirmationOpen(false); setAdToFeatureId(null); }}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleFeatureAd}>
                Pay Now
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}