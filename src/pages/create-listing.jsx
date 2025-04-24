"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ImagePlus, Upload } from "../components/icons"

export default function CreateListingPage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle listing creation logic here
    console.log({ title, category, price, description, location })
  }

  return (
    <main className="flex-1 py-12">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create a New Listing</h1>
            <p className="text-muted-foreground">
              Fill out the form below to create your listing. The more details you provide, the better!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the essential details about your listing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., 2020 Tesla Model 3 Long Range"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                      <SelectItem value="properties">Properties</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="computers">Computers</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    placeholder="e.g., 39999"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>Provide a detailed description of your item.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail. Include condition, features, and any other relevant information."
                    className="min-h-[200px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
                <CardDescription>Add photos of your item. You can upload up to 10 photos.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div className="relative aspect-square flex flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                    <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Upload photo</p>
                      <p className="text-xs text-muted-foreground">Drag & drop or click</p>
                    </div>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="relative aspect-square flex flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Add photo</p>
                        <p className="text-xs text-muted-foreground">Click to upload</p>
                      </div>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" type="button" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button type="submit">Create Listing</Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
