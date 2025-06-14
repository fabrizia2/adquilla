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
      if (!user || !token) {
        setLoading(false);
        // Optionally redirect to login if no user/token, though AuthProvider should handle this
        // navigate('/auth/login');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) { // Unauthorized, token expired
            toast.error("Your session has expired. Please log in again.");
            logout(); // Log out the user
            navigate('/auth/login');
            return;
          }
          throw new Error('Failed to fetch user details.');
        }

        const data = await response.json();
        // Assuming backend sends fields like firstName, lastName, email, phone, address, city, country
        setUserDetails(data.user);
        setOriginalUserDetails(data.user); // Store original for cancel functionality
      } catch (error) {
        toast.error(error.message || 'Error fetching user details.');
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
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
  };

  // --- 2. Use an Edit API (PUT request) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!userDetails || !token) {
      toast.error("User data or token missing.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, { // Assuming /api/users/me for update
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error("Your session has expired. Please log in again.");
          logout();
          navigate('/auth/login');
          return;
        }
        throw new Error(errorData.message || 'Failed to update details');
      }

      const updatedData = await response.json();
      toast.success('Details updated successfully!');
      setIsEditing(false);
      setUserDetails(updatedData.user); // Update local state
      setOriginalUserDetails(updatedData.user); // Update original for future cancels

      // Update user in AuthContext if such a function exists
      if (updateUserInContext) {
        updateUserInContext(updatedData.user);
      }

    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error('Error updating user details:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // --- 3. Add a Delete Account button ---
  const handleDeleteAccount = async () => {
    if (!user || !token) {
      toast.error("User data or token missing. Cannot delete.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (confirmDelete) {
      setDeleting(true);
      try {
        const response = await fetch(`${BACKEND_URL}/api/users/me`, { // Assuming /api/users/me for deletion
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            toast.error("Your session has expired. Please log in again.");
            logout();
            navigate('/auth/login');
            return;
          }
          throw new Error(errorData.message || 'Failed to delete account.');
        }

        toast.success('Account deleted successfully! Redirecting...');
        setDeleting(false);
        logout(); // Log out the user from AuthContext
        navigate('/'); // Redirect to homepage or login page
      } catch (error) {
        toast.error(`Error deleting account: ${error.message}`);
        console.error('Error deleting account:', error);
        setDeleting(false);
      }
    }
  };


  if (loading) {
    return <p className="text-center mt-10 text-gray-700">Loading your details...</p>;
  }

  if (!userDetails) {
    return <p className="text-center mt-10 text-red-600">Could not load user details. Please try logging in again.</p>;
  }

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
                  {userDetails.phonenumber || ( // Assuming backend sends 'phonenumber'
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

        ---

        {/* Delete Account Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
          <p className="text-gray-700 mb-6">
            Deleting your account is irreversible and will remove all your data.
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