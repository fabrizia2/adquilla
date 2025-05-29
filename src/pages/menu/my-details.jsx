// src/pages/my-details.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../layouts/AuthProvider'; // Adjust if path differs
import { FaStar, FaRegStar } from 'react-icons/fa'; // For star ratings

export default function MyDetailsPage() {
  const { user } = useContext(AuthContext); // Get user from context
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Dummy user data for demonstration, replace with actual fetch from backend
  // This helps when `user` from AuthContext might not have all these fields initially
  useEffect(() => {
    if (user) {
      setUserDetails({
        firstName: user.firstName || 'Fabrizia', // Default for demonstration
        lastName: user.lastName || 'Renish',     // Default for demonstration
        email: user.email || 'fabriziarenish@gmail.com', // Default for demonstration
        phone: user.phone || null, // Will be null initially if not set
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you'd send updated details to a backend here
    // Example API call:
    // try {
    //   const token = localStorage.getItem('token');
    //   const response = await fetch('YOUR_BACKEND_API/user/details', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(userDetails),
    //   });
    //   if (!response.ok) {
    //     throw new Error('Failed to update details');
    //   }
    //   setStatusMessage('Details updated successfully!');
    //   setIsEditing(false);
    //   setTimeout(() => setStatusMessage(''), 3000);
    // } catch (error) {
    //   setStatusMessage(`Error: ${error.message}`);
    //   console.error('Error updating user details:', error);
    // }

    console.log('Updated details:', userDetails);
    setStatusMessage('Details updated successfully!');
    setIsEditing(false);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  if (!userDetails) {
    return <p className="text-center mt-10 text-gray-700">Loading your details...</p>;
  }

  // Determine which fields to display/edit for contact details
  const contactFields = [
    { label: 'First name', name: 'firstName' },
    { label: 'Last name', name: 'lastName' },
    // Email and phone are handled separately for display based on the screenshot
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-8">
        {statusMessage && (
          <div className={`mb-6 px-4 py-3 rounded relative ${
            statusMessage.startsWith("Error")
              ? "bg-red-100 text-red-700 border border-red-400"
              : "bg-green-100 text-green-700 border border-green-400"
          }`} role="alert">
            <span className="block sm:inline">{statusMessage}</span>
          </div>
        )}

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
              onClick={() => console.log("Navigate to user profile")} // Replace with actual navigation
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
            {/* First Name & Last Name */}
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
                    type="text"
                    id={name}
                    name={name}
                    value={userDetails[name]}
                    onChange={handleChange}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                )}
              </div>
            ))}

            {/* Contact number */}
            <div className="md:col-span-2">
              <label htmlFor="phone" className="block text-gray-600 text-sm mb-1">
                Contact number
              </label>
              {!isEditing ? (
                <p className="text-gray-800 text-lg font-medium">
                  {userDetails.phone || (
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
                  id="phone"
                  name="phone"
                  value={userDetails.phone || ''} // Show empty string when adding
                  onChange={handleChange}
                  className="shadow-sm border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="e.g., +254712345678"
                />
              )}
            </div>

            {/* Hidden fields for other details, only editable when isEditing is true */}
            {isEditing && (
              <>
                <div>
                  <label htmlFor="address" className="block text-gray-600 text-sm mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={userDetails.address}
                    onChange={handleChange}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-gray-600 text-sm mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={userDetails.city}
                    onChange={handleChange}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-gray-600 text-sm mb-1">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={userDetails.country}
                    onChange={handleChange}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Edit/Save/Cancel Buttons */}
          <div className="mt-8 flex items-center justify-start">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="border border-teal-600 text-teal-600 px-6 py-2 rounded-md hover:bg-teal-50 transition duration-200 font-medium"
              >
                Edit contact details
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to original user data from AuthContext on cancel
                    if (user) {
                      setUserDetails({
                        firstName: user.firstName || 'Fabrizia',
                        lastName: user.lastName || 'Renish',
                        email: user.email || 'fabriziarenish@gmail.com',
                        phone: user.phone || null,
                        address: user.address || '',
                        city: user.city || '',
                        country: user.country || '',
                      });
                    }
                    setStatusMessage(''); // Clear any pending status message
                  }}
                  className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}