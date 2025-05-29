// src/pages/manage-job-ads.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ManageJobAdsPage() {
  // In a real application, you would fetch the user's job ads from an API
  const userJobAds = [
    { id: 'job1', title: 'Senior Software Engineer', company: 'Tech Solutions Inc.', status: 'Active', applications: 15, datePosted: '2025-05-10' },
    { id: 'job2', title: 'Marketing Manager', company: 'Creative Marketing Ltd.', status: 'Active', applications: 8, datePosted: '2025-05-12' },
    { id: 'job3', title: 'Part-time Graphic Designer', company: 'Design Co.', status: 'Expired', applications: 2, datePosted: '2025-04-20' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage My Job Ads</h1>

      {userJobAds.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 mb-4">You haven't posted any job ads yet.</p>
          <Link
            to="/create-job-listing" // Assuming a different page for job listings
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-md text-lg font-semibold transition duration-300"
          >
            Post a New Job Ad
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-left text-sm uppercase font-semibold">
                <th className="px-5 py-3">Job Title</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Applications</th>
                <th className="px-5 py-3">Date Posted</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userJobAds.map((job) => (
                <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-5 text-sm text-gray-900">
                    <Link to={`/job-listing/${job.id}`} className="text-pink-600 hover:underline">
                      {job.title}
                    </Link>
                  </td>
                  <td className="px-5 py-5 text-sm text-gray-900">{job.company}</td>
                  <td className="px-5 py-5 text-sm text-gray-900">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                        job.status === 'Active' ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 opacity-50 rounded-full ${
                          job.status === 'Active' ? 'bg-green-200' : 'bg-red-200'
                        }`}
                      ></span>
                      <span className="relative">{job.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 text-sm text-gray-900">{job.applications}</td>
                  <td className="px-5 py-5 text-sm text-gray-900">{job.datePosted}</td>
                  <td className="px-5 py-5 text-sm text-gray-900 text-right">
                    <button className="text-blue-600 hover:text-blue-900 mx-2">View Apps</button>
                    <button className="text-green-600 hover:text-green-900 mx-2">Edit</button>
                    <button className="text-red-600 hover:text-red-900 mx-2">Close Ad</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}