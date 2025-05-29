// src/pages/help-contact.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function HelpContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Help & Contact</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Help Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaQuestionCircle className="mr-3 text-pink-600" /> Frequently Asked Questions
          </h2>
          <p className="text-gray-700 mb-4">
            Find answers to the most common questions about using Adaquila, posting ads, managing your account, and more.
          </p>
          <Link
            to="/faq" // Assuming you'll have an actual FAQ page
            className="text-pink-600 hover:underline font-medium"
          >
            Go to FAQ
          </Link>
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Guides & Tutorials</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li><Link to="/guides/posting-ads" className="text-pink-600 hover:underline">How to Post an Ad</Link></li>
              <li><Link to="/guides/safe-trading" className="text-pink-600 hover:underline">Safe Trading Tips</Link></li>
              <li><Link to="/guides/account-settings" className="text-pink-600 hover:underline">Managing Your Account</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaEnvelope className="mr-3 text-pink-600" /> Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            Can't find what you're looking for? Reach out to our support team.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-2">
                <FaEnvelope className="mr-2 text-gray-600" /> Email Support
              </h3>
              <p className="text-gray-700">
                Send us an email and we'll get back to you as soon as possible.
                <br />
                <a href="mailto:support@adaquila.com" className="text-pink-600 hover:underline">support@adaquila.com</a>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-2">
                <FaPhone className="mr-2 text-gray-600" /> Phone Support
              </h3>
              <p className="text-gray-700">
                Available Monday - Friday, 9 AM - 5 PM (EAT).
                <br />
                <a href="tel:+254712345678" className="text-pink-600 hover:underline">+254 712 345 678</a>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Form</h3>
              <p className="text-gray-700">
                Fill out our online form for specific inquiries.
              </p>
              <Link
                to="/contact-form" // Assuming you'll have a contact form page
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm transition duration-300 mt-2 inline-block"
              >
                Open Contact Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}