"use client"

import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { ChevronDown, Filter, Search, ShoppingBag } from "../../components/icons"

// Mock data for category listings
const categoryData = {
  vehicles: {
    title: "Vehicles",
    description: "Browse cars, motorcycles, trucks, and more",
    count: 1243,
    listings: [
      {
        id: 1,
        title: "2020 Tesla Model 3 Long Range",
        price: "$39,999",
        location: "San Francisco, CA",
        image: "/images/carr.png",
        featured: true,
      },
      {
        id: 2,
        title: "2019 Honda Civic EX - Low Miles",
        price: "$18,600",
        location: "Los Angeles, CA",
        image: "/images/carr.png",
        featured: false,
      },
      {
        id: 3,
        title: "2021 Ford F-150 XLT 4x4",
        price: "$42,999",
        location: "Dallas, TX",
        image: "/images/carr.png",
        featured: false,
      },
      {
        id: 4,
        title: "2018 Toyota Camry SE",
        price: "$19,750",
        location: "Miami, FL",
        image: "/images/carr.png",
        featured: true,
      },
      {
        id: 5,
        title: "2022 Chevrolet Tahoe LT",
        price: "$54,995",
        location: "Chicago, IL",
        image: "/images/carr.png",
        featured: false,
      },
      {
        id: 6,
        title: "2017 BMW 5 Series 540i",
        price: "$29,900",
        location: "Seattle, WA",
        image: "/images/carr.png",
        featured: false,
      },
    ],
  },
  properties: {
    title: "Properties",
    description: "Find apartments, houses, land, and commercial properties",
    count: 867,
    listings: [
      {
        id: 1,
        title: "Modern 2-Bedroom Apartment",
        price: "$2,600/month",
        location: "New York, NY",
        image: "/images/carr.png",
        featured: true,
      },
      {
        id: 2,
        title: "3-Bedroom Single Family Home",
        price: "$450,000",
        location: "Austin, TX",
        image: "/images/carr.png",
        featured: false,
      },
    ],
  },
  electronics: {
    title: "Electronics",
    description: "Shop smartphones, TVs, cameras, and other electronics",
    count: 2156,
    listings: [
      {
        id: 1,
        title: "iPhone 14 Pro Max - 256GB",
        price: "$899",
        location: "Chicago, IL",
        image: "/images/carr.png",
        featured: false,
      },
      {
        id: 2,
        title: 'Samsung 65" QLED 4K Smart TV',
        price: "$799",
        location: "Houston, TX",
        image: "/images/carr.png",
        featured: true,
      },
    ],
  },
  furniture: {
    title: "Furniture",
    description: "Discover sofas, beds, tables, and more for your home",
    count: 932,
    listings: [
      {
        id: 1,
        title: "Leather Sectional Sofa",
        price: "$1,200",
        location: "Austin, TX",
        image: "/images/carr.png",
        featured: false,
      },
      {
        id: 2,
        title: "Queen Size Bed Frame with Storage",
        price: "$499",
        location: "Portland, OR",
        image: "/images/carr.png",
        featured: true,
      },
    ],
  },
  computers: {
    title: "Computers",
    description: "Find laptops, desktops, and computer accessories",
    count: 754,
    listings: [
      {
        id: 1,
        title: 'MacBook Pro 16" M2 Max',
        price: "$2,899",
        location: "Seattle, WA",
        image: "/images/carr.png",
        featured: true,
      },
      {
        id: 2,
        title: "Custom Gaming PC - RTX 4080, i9",
        price: "$2,499",
        location: "Las Vegas, NV",
        image: "/images/carr.png",
        featured: false,
      },
    ],
  },
  other: {
    title: "Other",
    description: "Browse miscellaneous items that don't fit other categories",
    count: 1587,
    listings: [
      {
        id: 1,
        title: "Mountain Bike - Trek Fuel EX 8",
        price: "$3,299",
        location: "Denver, CO",
        image: "/images/carr.png",
        featured: false,
      },
      {
        id: 2,
        title: "Antique Wooden Chest - 19th Century",
        price: "$750",
        location: "Boston, MA",
        image: "/images/carr.png",
        featured: true,
      },
    ],
  },
}

export default function CategoryPage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const category = categoryData[slug] || {
    title: "Category Not Found",
    description: "This category does not exist",
    count: 0,
    listings: [],
  }

  return (
    <main className="flex-1">
      <section className="w-full py-6 md:py-12 bg-white border border-gray-300 shadow-inner">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">
                <span className="bg-brand-magenta-600 text-white px-4 py-2 rounded-md inline-block">
                  {category.title}
                </span>
              </h1>
              <p className="text-gray-700 mt-2">
                {category.description} • {category.count} listings
              </p>
            </div>
            <div className="w-full flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-600" />
                <Input
                  type="search"
                  placeholder={`Search in ${category.title.toLowerCase()}...`}
                  className="pl-8 w-full border-gray-300 focus:border-brand-magenta-600 focus:ring-brand-magenta-600"
                />
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-300 hover:bg-gray-700 font-medium"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <Button className="bg-brand-magenta-600 hover:bg-brand-magenta-600 text-white font-medium">Search</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.listings.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden h-full transition-all hover:shadow-lg cursor-pointer border-gray-200 hover:border-brand-magenta-300 bg-white"
                onClick={() => navigate(`/listing/${listing.id}`)}
              >
                <div className="relative">
                  <img
                    src={listing.image || "/images/carr.png"}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  {listing.featured && (
                    <Badge className="absolute top-2 right-2 bg-brand-magenta-600 hover:bg-brand-magenta-600 text-white font-medium">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardHeader className="p-4 pb-0">
                  <h3 className="text-lg font-medium line-clamp-1 text-gray-900">{listing.title}</h3>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xl font-bold text-brand-magenta-600">{listing.price}</p>
                  <p className="text-sm text-gray-500">{listing.location}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 border-t border-gray-200">
                  <Badge className="bg-brand-magenta-600 text-white hover:bg-white hover:text-brand-magenta-700 transition-colors border border-transparent hover:border-brand-magenta-600 mt-3">
                    {category.title}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>

          {category.listings.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-brand-magenta-400 text-brand-magenta-600 hover:bg-brand-magenta-600 font-medium"
              >
                Load More
              </Button>
            </div>
          )}

          {category.listings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-brand-magenta-100 p-6 mb-4">
                <ShoppingBag className="h-10 w-10 text-brand-magenta-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">No listings found</h3>
              <p className="text-gray-700 mt-2 mb-6">There are currently no listings in this category.</p>
              <Button
                onClick={() => navigate("/create-listing")}
                className="bg-brand-magenta-600 hover:bg-brand-magenta-600 text-white font-medium"
              >
                Create a Listing
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
