// src/pages/my-alerts.jsx
import React from 'react';
import { FaBellSlash } from 'react-icons/fa'; // Icon for no alerts

export default function MyAlertsPage() {
  // In a real application, fetch user's alerts from an API
  const userAlerts = [
    { id: 'alert1', type: 'New Listing', message: 'New "iPhone 15" listed in London for £800.', date: '2025-05-23' },
    { id: 'alert2', type: 'Price Drop', message: 'Price drop on "Luxury Watch" from £500 to £450.', date: '2025-05-21' },
    { id: 'alert3', type: 'Message', message: 'New message from John Doe regarding "Vintage Camera".', date: '2025-05-20' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Alerts</h1>

      {userAlerts.length === 0 ? (
        <div className="text-center py-10">
          <FaBellSlash className="text-pink-600 text-6xl mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-4">You have no active alerts.</p>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-md text-lg font-semibold transition duration-300">
            Create New Alert
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userAlerts.map((alert) => (
            <div key={alert.id} className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">{alert.type} on {alert.date}</p>
                <p className="text-lg text-gray-800">{alert.message}</p>
              </div>
              <div>
                <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                <button className="text-red-600 hover:text-red-900">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}