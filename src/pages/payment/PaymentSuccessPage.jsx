// src/pages/payment/PaymentSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react'; // Assuming you have lucide-react icons installed
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [listingId, setListingId] = useState(null);
  const [transactionRef, setTransactionRef] = useState(null);

  useEffect(() => {
    const id = searchParams.get('listingId');
    const txRef = searchParams.get('tx_ref'); // Assuming your backend passes this
    const status = searchParams.get('status'); // Should be 'success'

    setListingId(id);
    setTransactionRef(txRef);

    // Optional: You could fetch the ad details here if you want to display them
    // or confirm its 'featured' status from your API.
    // However, for a quick redirect, relying on the backend's verification
    // and marking as featured before redirecting is common.

  }, [searchParams]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gray-100 min-h-[calc(100vh-theme(spacing.20))]">
      <Card className="w-full max-w-md p-6 text-center shadow-lg bg-white">
        <CardHeader className="items-center pb-4">
          <CheckCircle2 className="h-20 w-20 text-brand-magenta-600 mb-4" />
          <CardTitle className="text-3xl font-bold text-gray-900">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-gray-700">
            Congratulations! Your ad has been successfully featured.
          </p>
          {listingId && (
            <p className="text-md text-gray-600">
              Listing ID: <span className="font-medium">{listingId}</span>
            </p>
          )}
          {transactionRef && (
            <p className="text-md text-gray-600">
              Transaction Reference: <span className="font-medium">{transactionRef}</span>
            </p>
          )}
          <p className="text-md text-gray-600">
            It will now receive increased visibility for 1 week.
          </p>
          <div className="flex flex-col space-y-3 pt-4">
            {listingId && (
              <Button asChild className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white w-full">
                <Link to={`/listing/${listingId}`}>View Your Featured Ad</Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link to="/manage-ads">Go to Manage Ads</Link>
            </Button>
            <Button asChild variant="ghost" className="bg-brand-magenta-600 hover:bg-brand-magenta-700 text-white w-full">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}