// "use client" directive for Next.js app router, if applicable
"use client";

import React, { useState, useEffect, useContext } from "react"; // Import useEffect
import { AuthContext } from "../layouts/AuthProvider"; // Adjust path if needed
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate AND useParams

// shadcn/ui components
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

// Custom icons - Make sure ImagePlus and XCircle are exported from here
import { ImagePlus, XCircle } from "../components/icons";

export default function CreateListingPage() {
  const { id } = useParams(); // Get the ID from the URL (will be undefined for new listings)
  const { user, isAuthenticated, loadingAuth } = useContext(AuthContext); // Get isAuthenticated and loadingAuth
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    images: [], // Can hold File objects for new uploads, or URLs/filenames for existing
  });
  // imagePreviews will now handle both File object URLs and existing image URLs
  const [imagePreviews, setImagePreviews] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true); // New loading state for initial data fetch
  const [isEditMode, setIsEditMode] = useState(false); // New state to track mode
  const MAX_IMAGES = 10; // Define maximum number of images allowed

  // --- useEffect to handle initial data fetch for editing ---
  useEffect(() => {
    // Wait for AuthProvider to finish loading authentication status
    if (loadingAuth) {
      return;
    }

    if (!isAuthenticated) {
      setStatusMessage("You must be logged in to create or edit ads.");
      setLoadingInitialData(false);
      // Optional: Redirect to login or home if not authenticated
      navigate('/login');
      return;
    }

    if (id) { // If an ID is present in the URL, we are in edit mode
      setIsEditMode(true);
      setLoadingInitialData(true); // Set loading to true while fetching existing data
      setStatusMessage(""); // Clear any previous status messages

      const token = localStorage.getItem('token');
      const fetchListingData = async () => {
        try {
          const response = await fetch(`https://backend-nhs9.onrender.com/api/listings/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch listing for editing');
          }

          const data = await response.json();

          // --- Security Check: Ensure the logged-in user owns this listing ---
          // Assuming your backend sends the 'owner' field as the user's _id
          if (data.owner !== user?._id) {
            throw new Error("You are not authorized to edit this listing.");
          }
          // ------------------------------------------------------------------

          setFormData({
            title: data.title || "",
            description: data.description || "",
            category: data.category || "",
            price: data.price || "",
            location: data.location || "",
            // For images, we'll store their URLs from the backend directly
            // New images added by the user will be File objects.
            // The backend handles distinguishing between existing and new.
            images: data.images || [], // Assuming backend returns array of image URLs
          });

          // Set image previews from the fetched URLs
          setImagePreviews(data.images || []);

        } catch (err) {
          console.error("Error fetching listing for edit:", err);
          setStatusMessage(`Error loading ad for editing: ${err.message}.`);
        } finally {
          setLoadingInitialData(false); // Done loading initial data
        }
      };

      fetchListingData();
    } else {
      // Not in edit mode, so it's a new listing. Ensure form is reset and no initial loading.
      setIsEditMode(false);
      setLoadingInitialData(false);
      setFormData({
        title: "", description: "", category: "", price: "", location: "", images: [],
      });
      setImagePreviews([]);
    }
  }, [id, user, isAuthenticated, loadingAuth, navigate]); // Dependencies for useEffect

  // Handles changes for all input fields (text, number)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles changes specifically for the Select component (category)
  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  // Handles multiple file input change
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentImagesCount = formData.images.filter(img => typeof img === 'object').length + imagePreviews.length; // Count existing file objects and already loaded image URLs
    const filesToTake = Math.min(selectedFiles.length, MAX_IMAGES - currentImagesCount);

    if (filesToTake === 0 && currentImagesCount === MAX_IMAGES) {
      setStatusMessage(`Error: You can upload a maximum of ${MAX_IMAGES} images.`);
      setTimeout(() => setStatusMessage(""), 3000);
      e.target.value = '';
      return;
    }

    const newFiles = selectedFiles.slice(0, filesToTake);

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...newFiles] }));

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = '';
  };

  // Handles removing an individual image preview
  const handleRemoveImage = (indexToRemove) => {
    // If the image is a new File object (from current session), revoke its URL
    if (typeof formData.images[indexToRemove] === 'object') {
      URL.revokeObjectURL(imagePreviews[indexToRemove]);
    }
    // Filter out the image from formData.images (handles both files and URLs)
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    // Filter out the preview URL
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(""); // Clear previous status messages

    // Basic validation
    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.location || formData.images.length === 0) {
      setStatusMessage("Error: All fields and at least one image are required.");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setStatusMessage("Error: Not authenticated. Please log in.");
      setIsSubmitting(false);
      navigate('/login'); // Redirect to login if token is missing
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("category", formData.category);
    form.append("price", formData.price);
    form.append("location", formData.location);

    // Append images: new File objects will be sent, existing URLs will be sent as strings
    formData.images.forEach((item) => {
      if (typeof item === 'object') { // It's a new file
        form.append("images", item);
      } else { // It's an existing image URL (string)
        form.append("existingImages", item); // Your backend needs to handle this distinction
      }
    });

    form.append("owner", user?._id); // Crucial for linking the ad to the authenticated user.

    // --- DEBUGGING LOG ---
    console.log("--- FormData Contents for Backend ---");
    for (let [key, value] of form.entries()) {
      if (key === "images" && value instanceof File) {
        console.log(`${key}: File Name - ${value.name}, Size - ${value.size} bytes, Type - ${value.type}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    console.log("-------------------------------------");
    // --- END DEBUGGING LOG ---

    const apiUrl = isEditMode
      ? `https://backend-nhs9.onrender.com/api/listings/${id}`
      : 'https://backend-nhs9.onrender.com/api/listings';

    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          // IMPORTANT: Do NOT set 'Content-Type': 'multipart/form-data' here.
          // The browser sets it automatically with the correct boundary
          // when you send a FormData object as the body.
        },
        body: form,
      });

      if (!response.ok) {
        let errorMessage = `Failed to ${isEditMode ? 'update' : 'post'} ad`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          const errorText = await response.text();
          console.error("Backend raw response (if not JSON):", errorText);
          errorMessage = `Server responded with non-JSON format or error: ${errorText.substring(0, 200)}...`;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log(`Ad ${isEditMode ? 'updated' : 'posted'} successfully. Response:`, responseData);
      setStatusMessage(`Ad ${isEditMode ? 'updated' : 'posted'} successfully!`);

      // Revoke all object URLs to free up memory
      imagePreviews.forEach(url => URL.revokeObjectURL(url));

      // Reset form (only if creating, for editing we might want to stay on page or navigate)
      if (!isEditMode) {
        setFormData({
          title: "", description: "", category: "", price: "", location: "", images: [],
        });
        setImagePreviews([]);
      } else {
        // For edit mode, refresh the data to show latest changes or navigate
        // A simple way is to refetch, or just navigate back
        navigate('/manage-ads'); // Redirect to manage ads page after successful update
      }
      setTimeout(() => setStatusMessage(""), 3000); // Clear message after 3 seconds

    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'posting'} ad:`, error);
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Conditional Render for Initial Loading ---
  if (loadingAuth || loadingInitialData) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[60vh]">
        <p className="text-xl text-gray-700">Loading {id ? "ad for editing" : "form"}...</p>
      </main>
    );
  }

  // --- Conditional Render for Error ---
  if (statusMessage.startsWith("Error") && !isSubmitting) { // Show error if not currently submitting
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[60vh]">
        <p className="text-xl text-red-600 mb-4">{statusMessage}</p>
        <Button onClick={() => navigate('/')} className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white font-medium">
          Go to Home
        </Button>
      </main>
    );
  }

  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-black">
              {isEditMode ? "Edit Your Listing" : "Create a New Listing"}
            </h1>
            <p className="text-black">
              {isEditMode ? "Modify the details of your ad below." : "Fill out the form below to create your listing. The more details you provide, the better!"}
            </p>
          </div>

          {statusMessage && !statusMessage.startsWith("Error") && ( // Only show success/info messages here
            <div
              className="mb-4 px-4 py-3 rounded bg-green-100 text-green-700 border border-green-400"
            >
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the essential details about your listing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., 2020 Tesla Model 3 Long Range"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                      <SelectItem value="properties">Properties</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="computers">Computers</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Ksh)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="e.g., 39999"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Nairobi, Kenya"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>Provide a detailed description of your item.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your item in detail. Include condition, features, and any other relevant information."
                    className="min-h-[150px]"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
                <CardDescription>Add photos of your item. You can upload up to {MAX_IMAGES} photos.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {/* Display existing image previews */}
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img
                        src={src}
                        alt={`Listing Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500/80 hover:bg-red-600 z-10"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <XCircle className="h-4 w-4 text-white" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  ))}

                  {/* Upload area - visible only if max images not reached */}
                  {formData.images.length < MAX_IMAGES && (
                    <div className="relative aspect-square flex flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        id="file-upload"
                        type="file"
                        name="images"
                        accept="image/*"
                        onChange={handleFileChange}
                        multiple // Allow multiple file selection
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <Label htmlFor="file-upload" className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                        <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {imagePreviews.length > 0 ? "Add more photos" : "Upload photo"}
                          </p>
                          <p className="text-xs text-muted-foreground">Drag & drop or click (Max {MAX_IMAGES})</p>
                        </div>
                      </Label>
                    </div>
                  )}
                </div>
                {formData.images.length === 0 && (
                   <p className="text-sm text-red-500 mt-2">At least one image is required.</p>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEditMode ? "Updating..." : "Posting...") : (isEditMode ? "Save Changes" : "Create Listing")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}