"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Calendar, Phone, Users, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import Navbar from "@/components/Navbar"

export default function HomePage() {
  const [articles, setArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchFeaturedArticles()
  }, [])

  const fetchFeaturedArticles = async () => {
    try {
      const response = await fetch("/api/articles?featured=true&limit=6")
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/articles?search=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">AfyaHub</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Improving access to reliable health information for Kenyan communities. Get verified health articles,
            vaccination schedules, and emergency contacts all in one place.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search health topics, diseases, treatments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg"
                />
              </div>
              <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700">
                Search
              </Button>
            </div>
          </form>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Link href="/articles">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-800">Health Articles</CardTitle>
                  <CardDescription>Access verified health information and medical advice</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/vaccination">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-800">Vaccination Schedule</CardTitle>
                  <CardDescription>Stay up-to-date with vaccination schedules and reminders</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/emergency">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Phone className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-red-800">Emergency Contacts</CardTitle>
                  <CardDescription>Quick access to emergency numbers and health facilities</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Health Articles</h2>
            <Link href="/articles">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                View All Articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article._id} href={`/articles/${article._id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {article.category}
                        </Badge>
                        {article.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                      </div>
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                      <CardDescription>
                        By {article.author} • {new Date(article.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3">
                        {article.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-green-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Making Healthcare Accessible</h2>
            <p className="text-xl text-green-100">Serving communities across Kenya with reliable health information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-green-200" />
              </div>
              <h3 className="text-4xl font-bold mb-2">10,000+</h3>
              <p className="text-green-100">Users Served</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-12 w-12 text-green-200" />
              </div>
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-green-100">Health Articles</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-green-200" />
              </div>
              <h3 className="text-4xl font-bold mb-2">100%</h3>
              <p className="text-green-100">Verified Content</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Have a Health Question?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our team of healthcare professionals is here to help. Submit your questions and get reliable answers.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Ask a Question
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-green-500 mr-2" />
                <h3 className="text-xl font-bold">AfyaHub</h3>
              </div>
              <p className="text-gray-400">Improving access to reliable health information for Kenyan communities.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/articles" className="hover:text-white">
                    Health Articles
                  </Link>
                </li>
                <li>
                  <Link href="/vaccination" className="hover:text-white">
                    Vaccination
                  </Link>
                </li>
                <li>
                  <Link href="/emergency" className="hover:text-white">
                    Emergency
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <p className="text-gray-400">
                Email: info@afyahub.co.ke
                <br />
                Phone: +254 700 000 000
                <br />
                Nairobi, Kenya
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AfyaHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
