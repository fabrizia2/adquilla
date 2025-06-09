// src/pages/payment/PaymentFailurePage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle } from 'lucide-react'; // Assuming you have lucide-react icons installed
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const [listingId, setListingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const id = searchParams.get('listingId');
    const paymentStatus = searchParams.get('status');
    const errorMessage = searchParams.get('message'); // Backend should pass a message

    setListingId(id);
    setStatus(paymentStatus || 'failed');
    setMessage(errorMessage || 'An unknown error occurred during payment.');

  }, [searchParams]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[calc(100vh-theme(spacing.20))]">
      <Card className="w-full max-w-md p-6 text-center shadow-lg">
        <CardHeader className="items-center pb-4">
          <XCircle className="h-20 w-20 text-red-500 mb-4" />
          <CardTitle className="text-3xl font-bold text-gray-900">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-gray-700">
            Unfortunately, your payment could not be processed.
          </p>
          {message && (
            <p className="text-md text-red-600 font-medium">Reason: {message}</p>
          )}
          {listingId && (
            <p className="text-md text-gray-600">
              Listing ID: <span className="font-medium">{listingId}</span>
            </p>
          )}
          <p className="text-md text-gray-600">
            Please review the details and try again, or contact support if the problem persists.
          </p>
          <div className="flex flex-col space-y-3 pt-4">
            {listingId && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    {/* Assuming you want to re-initiate payment or go to listing page */}
                    <Link to={`/listing/${listingId}`}>View Listing Details</Link>
                </Button>
            )}
            <Button asChild variant="default" className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white w-full">
              <Link to="/manage-ads">Go to Manage Ads</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}