// src/pages/favourites.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartBroken } from 'react-icons/fa'; // Example icon for no favorites

export default function FavouritesPage() {
  // In a real application, fetch user's favorited listings from an API
  const favoritedListings = [
    { id: 'fav1', title: 'Rare Stamp Collection', price: '£150', imageUrl: 'https://via.placeholder.com/150/FF69B4/FFFFFF?text=Stamp', location: 'London' },
    { id: 'fav2', title: 'Gaming PC (High-End)', price: '£1200', imageUrl: 'https://via.placeholder.com/150/FF69B4/FFFFFF?text=PC', location: 'Manchester' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Favourites</h1>

      {favoritedListings.length === 0 ? (
        <div className="text-center py-10">
          <FaHeartBroken className="text-pink-600 text-6xl mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-4">You haven't favorited any listings yet.</p>
          <Link
            to="/"
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-md text-lg font-semibold transition duration-300"
          >
            Explore Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritedListings.map((listing) => (
            <div key={listing.id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
              <Link to={`/listing/${listing.id}`} className="block">
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4 flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  <Link to={`/listing/${listing.id}`} className="hover:text-pink-600">
                    {listing.title}
                  </Link>
                </h2>
                <p className="text-gray-700 text-lg font-bold mb-1">{listing.price}</p>
                <p className="text-gray-500 text-sm">{listing.location}</p>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm transition duration-300">
                  Contact Seller
                </button>
                <button className="ml-2 text-gray-600 hover:text-red-600 px-4 py-2 rounded-md text-sm border border-gray-300 hover:border-red-600 transition duration-300">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}