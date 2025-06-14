// src/pages/my-details.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../layouts/AuthProvider'; // Adjust if path differs
import { FaStar, FaRegStar } from 'react-icons/fa'; // For star ratings
import { useNavigate } from 'react-router-dom'; // For redirection after delete
import { toast } from 'react-hot-toast'; // For notifications

export default function MyDetailsPage() {
  const { user, token, logout, updateUserInContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);
  const [originalUserDetails, setOriginalUserDetails] = useState(null); // To reset on cancel
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [submitting, setSubmitting] = useState(false); // Loading state for form submission
  const [deleting, setDeleting] = useState(false); // Loading state for delete account

  const BACKEND_URL = "https://backend-nhs9.onrender.com"; // Your backend URL

  // --- 1. Fetch correct user details on component mount ---
  useEffect(() => {
    const fetchUserDetails = async () => {
      console.log("--- Starting fetchUserDetails ---");
      console.log("User from AuthContext:", user);
      console.log("Token from AuthContext:", token ? "Token present" : "Token is null/undefined");

      if (!user || !token) {
        setLoading(false);
        console.warn("User or token is missing from AuthContext. Cannot fetch details. Redirecting or showing error.");
        // If user/token are genuinely missing, AuthProvider should typically handle login redirect.
        // The error message "Could not load user details..." will be shown due to !userDetails.
        return;
      }

      try {
        setLoading(true);
        console.log("Attempting to fetch from URL:", `${BACKEND_URL}/api/auth/me`);
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("API Response Status:", response.status);
        console.log("API Response OK property:", response.ok);

        if (!response.ok) {
          if (response.status === 401) { // Unauthorized, token expired
            toast.error("Your session has expired. Please log in again.");
            logout(); // Log out the user
            navigate('/auth/login');
            console.error("401 Unauthorized: Session expired. Redirected to login.");
            return;
          }
          const errorResponseText = await response.text(); // Get the raw response text for debugging
          console.error(`Fetch not OK. Status: ${response.status}. Raw response text:`, errorResponseText);
          throw new Error(`Failed to fetch user details. Status: ${response.status}. Message: ${errorResponseText || 'No specific error message from backend'}`);
        }

        const data = await response.json(); // Attempt to parse response as JSON
        console.log("Successfully parsed JSON data from backend:", data);

        // Crucial Check: Ensure the parsed data is not empty or malformed
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            console.error("Received empty, null, or non-object data from backend for user details.");
            throw new Error("Received empty or invalid user data from backend.");
        }

        // FIX APPLIED: Set userDetails directly from 'data' as backend is not nesting
        setUserDetails(data);
        setOriginalUserDetails(data);
        console.log("User details successfully set to state:", data);

      } catch (error) {
        toast.error(error.message || 'Error fetching user details.');
        console.error('Catch block error during fetchUserDetails:', error);
      } finally {
        setLoading(false);
        console.log("--- fetchUserDetails finished ---");
      }
    };

    fetchUserDetails();
  }, [user, token, navigate, logout]); // Re-fetch if user or token changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(`handleChange: Updated ${name} to ${value}`);
  };

  // --- 2. Use an Edit API (PUT request) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log("--- Starting handleSubmit (Update User) ---");
    console.log("User details being sent for update:", userDetails);

    if (!userDetails || !token) {
      toast.error("User data or token missing for update operation.");
      setSubmitting(false);
      console.error("Update failed: User data or token missing.");
      return;
    }

    try {
      // Confirmed PUT endpoint is /api/auth/me
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userDetails),
      });

      console.log("Update API Response Status:", response.status);
      console.log("Update API Response OK property:", response.ok);

      if (!response.ok) {
        const errorData = await response.json(); // Attempt to parse error data
        if (response.status === 401) {
          toast.error("Your session has expired. Please log in again.");
          logout();
          navigate('/auth/login');
          console.error("401 Unauthorized during update: Session expired.");
          return;
        }
        console.error("Update failed. Error data:", errorData);
        throw new Error(errorData.message || 'Failed to update details');
      }

      const updatedData = await response.json(); // Get updated user data from response
      toast.success('Details updated successfully!');
      setIsEditing(false);
      console.log("Update successful. New data from backend:", updatedData);

      // FIX APPLIED: Set userDetails directly from 'updatedData'
      setUserDetails(updatedData);
      setOriginalUserDetails(updatedData);

      // Update user in AuthContext if such a function exists
      if (updateUserInContext) {
        // FIX APPLIED: Pass updatedData directly to AuthContext
        updateUserInContext(updatedData);
        console.log("User updated in AuthContext.");
      }

    } catch (error) {
      toast.error(`Error updating details: ${error.message}`);
      console.error('Catch block error during handleSubmit:', error);
    } finally {
      setSubmitting(false);
      console.log("--- handleSubmit finished ---");
    }
  };

  // --- 3. Add a Delete Account button ---
  const handleDeleteAccount = async () => {
    console.log("--- Starting handleDeleteAccount ---");
    if (!user || !token) {
      toast.error("User data or token missing. Cannot delete account.");
      console.error("Delete failed: User data or token missing.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (confirmDelete) {
      setDeleting(true);
      console.log("User confirmed account deletion.");
      try {
        // IMPORTANT CHECK: Ensure this DELETE endpoint matches your backend's actual route.
        // You listed /api/auth/me in your description, but your previous code had /api/users/me.
        // I'm assuming /api/auth/me for consistency with GET/PUT, but verify this on your backend.
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("Delete API Response Status:", response.status);
        console.log("Delete API Response OK property:", response.ok);

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            toast.error("Your session has expired. Please log in again.");
            logout();
            navigate('/auth/login');
            console.error("401 Unauthorized during delete: Session expired.");
            return;
          }
          console.error("Delete failed. Error data:", errorData);
          throw new Error(errorData.message || 'Failed to delete account.');
        }

        toast.success('Account deleted successfully! Redirecting...');
        setDeleting(false);
        logout(); // Log out the user from AuthContext
        navigate('/'); // Redirect to homepage or login page
        console.log("Account deleted and user logged out. Redirecting to home.");
      } catch (error) {
        toast.error(`Error deleting account: ${error.message}`);
        console.error('Catch block error during handleDeleteAccount:', error);
        setDeleting(false);
      }
    } else {
      console.log("Account deletion cancelled by user.");
    }
  };


  if (loading) {
    console.log("Rendering: Loading state active...");
    return <p className="text-center mt-10 text-gray-700">Loading your details...</p>;
  }

  // This is the condition that's being met, causing the error message
  if (!userDetails) {
    console.error("Rendering: userDetails is null/undefined after loading finished. Displaying error message.");
    return <p className="text-center mt-10 text-red-600">Could not load user details. Please try logging in again.</p>;
  }

  console.log("Rendering: User details are available, displaying form.");
  // Determine which fields to display/edit for contact details
  const contactFields = [
    { label: 'First name', name: 'firstName' },
    { label: 'Last name', name: 'lastName' },
    { label: 'Email', name: 'email' }, // Assuming email can be edited
    { label: 'Location', name: 'location' },
    { label: 'Address', name: 'address' },
    { label: 'City', name: 'city' },
    { label: 'Country', name: 'country' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-8">
        {/* Top Section: Name, Email, Stars, View Profile Button */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {userDetails.firstName} {userDetails.lastName}
            </h1>
            <p className="text-gray-600">{userDetails.email}</p>
            <div className="flex mt-2">
              {[...Array(3)].map((_, i) => (
                <FaStar key={`full-${i}`} className="text-yellow-400 mr-1" />
              ))}
              {[...Array(2)].map((_, i) => (
                <FaRegStar key={`empty-${i}`} className="text-gray-300 mr-1" />
              ))}
            </div>
          </div>
          <div>
            <button
              onClick={() => console.log("Navigate to user profile")} // Replace with actual navigation to public profile
              className="border border-teal-600 text-teal-600 px-4 py-2 rounded-md hover:bg-teal-50 transition duration-200"
            >
              View profile
            </button>
          </div>
        </div>

        {/* Contact Details Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact details</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
            {/* Dynamic fields from contactFields array */}
            {contactFields.map(({ label, name }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-gray-600 text-sm mb-1">
                  {label}
                </label>
                {!isEditing ? (
                  <p className="text-gray-800 text-lg font-medium">
                    {userDetails[name] || 'N/A'}
                  </p>
                ) : (
                  <input
                    type={name === 'email' ? 'email' : 'text'} // Use email type for email input
                    id={name}
                    name={name}
                    value={userDetails[name] || ''}
                    onChange={handleChange}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-1 focus:ring-pink-500"
                    required={name === 'firstName' || name === 'lastName' || name === 'email'} // Make essential fields required
                  />
                )}
              </div>
            ))}

            {/* Contact number - special handling for 'Add contact number' link */}
            <div>
              <label htmlFor="phonenumber" className="block text-gray-600 text-sm mb-1">
                Contact number
              </label>
              {!isEditing ? (
                <p className="text-gray-800 text-lg font-medium">
                  {userDetails.phoneNumber || ( // Assuming backend sends 'phonenumber'
                    <a href="#" className="text-teal-600 hover:underline" onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true); // Allow adding phone number
                    }}>
                      Add contact number
                    </a>
                  )}
                </p>
              ) : (
                <input
                  type="tel"
                  id="phonenumber" // Match backend's expected field name
                  name="phonenumber"
                  value={userDetails.phonenumber || ''} // Show empty string when adding
                  onChange={handleChange}
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="e.g., +254712345678"
                />
              )}
            </div>
          </div>

          {/* Edit/Save/Cancel Buttons */}
          <div className="mt-8 flex items-center justify-start space-x-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="border border-teal-600 text-teal-600 px-6 py-2 rounded-md hover:bg-teal-50 transition duration-200 font-medium"
              >
                Edit contact details
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to original user data if changes were not saved
                    setUserDetails(originalUserDetails);
                    toast.dismiss(); // Clear any pending toasts
                  }}
                  className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-300"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>

        {/* Delete Account Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
          <p className="text-gray-700 mb-6">
            Deletes your account and all associated data. This action is irreversible.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>
      </div>
    </div>
  );
}