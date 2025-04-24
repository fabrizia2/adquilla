"use client"

import { useParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import { Calendar, Heart, MapPin, MessageCircle, Phone, Share2, User } from "../../components/icons"

// Mock data for a single listing
const listingData = {
  id: 1,
  title: "2020 Tesla Model 3 Long Range",
  price: "$39,999",
  description:
    "Excellent condition 2020 Tesla Model 3 Long Range with only 25,000 miles. Dual motor all-wheel drive, premium interior, autopilot, and full self-driving capability. Pearl white multi-coat exterior with black interior. Includes charging cable and adapters. No accidents, clean title.",
  location: "San Francisco, CA",
  category: "Vehicles",
  subcategory: "Cars",
  condition: "Used - Excellent",
  seller: {
    name: "Alex Johnson",
    memberSince: "January 2019",
    listings: 12,
    rating: 4.9,
    verified: true,
  },
  images: [
    "../../../public/images/carr.png",
    "../../../public/images/carr.png",
    "../../../public/images/carr.png",
    "../../../public/images/carr.png",
  ],
  details: [
    { label: "Make", value: "Tesla" },
    { label: "Model", value: "Model 3" },
    { label: "Year", value: "2020" },
    { label: "Mileage", value: "25,000 miles" },
    { label: "Fuel Type", value: "Electric" },
    { label: "Transmission", value: "Automatic" },
    { label: "Color", value: "Pearl White" },
    { label: "VIN", value: "5YJ3E1EA1LF123456" },
  ],
  postedDate: "3 days ago",
  views: 243,
  featured: true,
}

export default function ListingPage() {
  const { id } = useParams()

  return (
    <main className="flex-1 py-6 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-brand-magenta-500 text-white hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-500">
                  {listingData.category}
                </Badge>
                <Badge className="bg-brand-magenta-500 text-white hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-500">
                  {listingData.subcategory}
                </Badge>
                {listingData.featured && (
                  <Badge className="bg-brand-magenta-500 hover:bg-brand-magenta-600 text-white font-medium">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold md:text-3xl text-gray-200">{listingData.title}</h1>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{listingData.location}</span>
                <span className="text-sm">•</span>
                <Calendar className="h-4 w-4" />
                <span>Posted {listingData.postedDate}</span>
              </div>
              <p className="text-2xl font-bold text-brand-magenta-600">{listingData.price}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={listingData.images[0] || "../../../public/images/carr.png"}
                  alt={listingData.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {listingData.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={image || "../../../public/images/carr.png"}
                      alt={`${listingData.title} - Image ${index + 2}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-400">Description</h2>
              <p className="text-gray-200 leading-relaxed">{listingData.description}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-400">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {listingData.details.map((detail, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium text-gray-400">{detail.label}:</span>
                    <span className="text-gray-200">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-brand-magenta-100 p-2">
                    <User className="h-6 w-6 text-brand-magenta-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-300">{listingData.seller.name}</p>
                    <p className="text-sm text-gray-400">Member since {listingData.seller.memberSince}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Listings</p>
                    <p className="font-medium text-gray-200">{listingData.seller.listings}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Rating</p>
                    <p className="font-medium text-gray-200">{listingData.seller.rating}/5</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button className="w-full bg-brand-magenta-500 hover:bg-brand-magenta-600 text-white font-medium">
                    <Phone className="mr-2 h-4 w-4" /> Show Phone Number
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-400 hover:bg-gray-700 font-medium"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" /> Message Seller
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-medium text-gray-400">Listing Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-400 hover:bg-gray-700 font-medium"
                  >
                    <Heart className="mr-2 h-4 w-4" /> Save
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-400 hover:bg-gray-700 font-medium"
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
                <div className="text-sm text-gray-300">
                  <p>Ad ID: {listingData.id}</p>
                  <p>Views: {listingData.views}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4 text-gray-400">Safety Tips</h3>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li>• Meet in a safe, public place</li>
                  <li>• Don't pay or transfer money in advance</li>
                  <li>• Inspect the item before purchasing</li>
                  <li>• Verify the seller's identity</li>
                  <li>• Report suspicious behavior</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
