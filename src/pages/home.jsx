"use client"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Car,
  HomeIcon,
  Laptop,
  Search,
  ShoppingBag,
  Smartphone,
  Sofa,
} from "../components/icons"
import FeaturedListings from "../components/featured-listings"
import { Card, CardContent } from "../components/ui/card"
import { motion } from "framer-motion"

export default function Home() {
  const navigate = useNavigate()

  const categories = [
    { icon: <Car className="h-8 w-8" />, title: "Vehicles", count: 1243, href: "/category/vehicles" },
    { icon: <HomeIcon className="h-8 w-8" />, title: "Properties", count: 867, href: "/category/properties" },
    { icon: <Smartphone className="h-8 w-8" />, title: "Electronics", count: 2156, href: "/category/electronics" },
    { icon: <Sofa className="h-8 w-8" />, title: "Furniture", count: 932, href: "/category/furniture" },
    { icon: <Laptop className="h-8 w-8" />, title: "Computers", count: 754, href: "/category/computers" },
    { icon: <ShoppingBag className="h-8 w-8" />, title: "Other", count: 1587, href: "/category/other" },
  ]

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        {/* YouTube Background Video */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
          <iframe
            className="w-full h-full object-cover"
            src="https://www.youtube.com/embed/O9vO_CVNXlg?autoplay=1&mute=1&controls=0&loop=1&playlist=O9vO_CVNXlg&modestbranding=1&showinfo=0"
            title="AdShare Background Video"
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder="0"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-3xl">
          <motion.h1
            className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Powering Ads, <span className="text-brand-magenta-300">Elevating Brands</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-200 mb-6 drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Your one-stop marketplace for cars, properties, electronics, and more.
          </motion.p>

          <div className="relative w-full max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
            <Input
              type="search"
              placeholder="Search for anything..."
              className="pl-12 pr-4 py-3 rounded-full border-none shadow-md text-gray-800"
            />
          </div>

          <Button className="mt-4 px-8 py-3 rounded-full bg-brand-magenta-500 hover:bg-brand-magenta-600 text-white font-semibold shadow-lg transition">
            Search
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Browse Categories</h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            Find exactly what you're looking for in our organized categories.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => navigate(category.href)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <Card className="hover:shadow-md transition border border-gray-200 hover:border-brand-magenta-300 group">
                  <CardContent className="p-6 flex flex-col items-center text-center h-60 justify-center">
                    <div className="mb-4 rounded-full bg-brand-magenta-500 p-3 text-white">
                      {category.icon}
                    </div>
                    <div className="bg-brand-magenta-500 text-white px-4 py-1.5 rounded-full font-medium group-hover:bg-white group-hover:text-brand-magenta-700 transition-colors border border-transparent group-hover:border-brand-magenta-500">
                      {category.title}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{category.count} listings</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="w-full py-20 bg-brand-magenta-50">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Featured Listings</h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            Check out our most popular listings across all categories.
          </p>
          <FeaturedListings />
          <Button
            variant="outline"
            size="lg"
            className="mt-8 border-brand-magenta-400 text-brand-magenta-600 hover:bg-brand-magenta-500 font-medium"
          >
            View All Listings
          </Button>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-5">
              <div className="inline-block rounded-lg bg-brand-magenta-500 px-3 py-1 text-sm text-white font-medium">
                Sell Fast
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Ready to sell your items?
              </h2>
              <p className="text-gray-600 text-lg max-w-lg">
                Create an account and start listing your items in minutes. Reach thousands of potential buyers.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to="/auth/register">
                  <Button size="lg" className="bg-brand-magenta-500 hover:bg-brand-magenta-600 text-white font-semibold">
                    Get Started
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-300 text-gray-300 hover:bg-gray-400 font-medium"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="../../public/images/carr.png"
                alt="Illustration of selling online"
                width={400}
                height={400}
                className="rounded-xl object-cover shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
