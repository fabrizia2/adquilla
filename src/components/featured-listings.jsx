"use client"

import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"

// Mock data for featured listings
const featuredListings = [
  {
    id: 1,
    title: "2020 Tesla Model 3 Long Range",
    price: "$39,999",
    location: "San Francisco, CA",
    category: "Vehicles",
    image: "/images/carr.png",
    featured: true,
  },
  {
    id: 2,
    title: "Modern 2-Bedroom Apartment",
    price: "$2,500/month",
    location: "New York, NY",
    category: "Properties",
    image: "/images/carr.png",
    featured: true,
  },
  {
    id: 3,
    title: "iPhone 14 Pro Max - 256GB",
    price: "$899",
    location: "Chicago, IL",
    category: "Electronics",
    image: "/images/carr.png",
    featured: false,
  },
  {
    id: 4,
    title: "Leather Sectional Sofa",
    price: "$1,200",
    location: "Austin, TX",
    category: "Furniture",
    image: "/images/carr.png",
    featured: false,
  },
  {
    id: 5,
    title: 'MacBook Pro 16" M2 Max',
    price: "$2,899",
    location: "Seattle, WA",
    category: "Computers",
    image: "/images/carr.png",
    featured: true,
  },
  {
    id: 6,
    title: "Mountain Bike - Trek Fuel EX 8",
    price: "$3,299",
    location: "Denver, CO",
    category: "Sports",
    image: "/images/carr.png",
    featured: false,
  },
]

export default function FeaturedListings() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      {featuredListings.map((listing) => (
        <Card
          key={listing.id}
          className="overflow-hidden h-full transition-all hover:shadow-lg cursor-pointer bg-white border-gray-200 hover:border-brand-magenta-300"
          onClick={() => navigate(`/listing/${listing.id}`)}
        >
          <div className="relative">
            <img src={listing.image || "/placeholder.svg"} alt={listing.title} className="w-full h-48 object-cover" />
            {listing.featured && (
              <Badge className="absolute top-2 right-2 bg-brand-magenta-600 hover:bg-brand-magenta-600 text-white font-medium">
                Featured
              </Badge>
            )}
          </div>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium line-clamp-1 text-gray-800">{listing.title}</h3>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-xl font-bold text-brand-magenta-600">{listing.price}</p>
            <p className="text-sm text-gray-600">{listing.location}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 border-t border-gray-200">
            <Badge className="bg-brand-magenta-600 text-white hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-500">
              {listing.category}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
