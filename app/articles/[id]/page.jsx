"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import Navbar from "@/components/Navbar"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ArticleDetailPage({ params }) {
  const { id } = params
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchArticle()
    }
  }, [id])

  const fetchArticle = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/articles/${id}`)
      const data = await response.json()

      if (response.ok) {
        setArticle(data.article)
      } else {
        setError(data.error || "Failed to fetch article.")
      }
    } catch (err) {
      setError("Network error or server issue.")
      console.error("Error fetching article:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex items-center gap-4 text-sm">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>Article not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {article.category}
              </Badge>
              {article.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">{article.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
