"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react"
import Navbar from "@/components/Navbar"
import { useAuth } from "@/hooks/useAuth"

const categories = [
  "General Health Question",
  "Maternal Health",
  "Child Health",
  "Mental Health",
  "Nutrition",
  "Disease Prevention",
  "Emergency Care",
  "Vaccination",
  "Other",
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user && { Authorization: `Bearer ${localStorage.getItem("token")}` }),
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          category: "",
          subject: "",
          message: "",
        })
      } else {
        const data = await response.json()
        setError(data.error || "Failed to send message")
      }
    } catch (error) {
      setError("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h2>
                <p className="text-gray-600">
                  Thank you for contacting AfyaHub. Our healthcare professionals will review your question and respond
                  within 24-48 hours.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={() => setSuccess(false)} className="bg-green-600 hover:bg-green-700">
                  Send Another Message
                </Button>
                <div>
                  <Button variant="outline" onClick={() => (window.location.href = "/")}>
                    Return to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Our Health Experts</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a health question? Our team of qualified healthcare professionals is here to help. Submit your question
            and get reliable, evidence-based answers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ask a Health Question</CardTitle>
                <CardDescription>
                  Fill out the form below and our healthcare team will respond to your question
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                      placeholder="Brief description of your question"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Question *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                      rows={6}
                      placeholder="Please provide detailed information about your health question. Include relevant symptoms, duration, and any other important details."
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Disclaimer:</strong> This service is for general health information only and should not
                      replace professional medical advice. For emergencies, please call 999 or visit your nearest
                      healthcare facility immediately.
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Question
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">info@afyahub.co.ke</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">+254 700 000 000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-600">
                      AfyaHub Health Center
                      <br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-gray-600">24-48 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">How quickly will I get a response?</h4>
                  <p className="text-sm text-gray-600">
                    Our healthcare team typically responds within 24-48 hours during business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Is this service free?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, our health information service is completely free for all users.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Can I get a diagnosis?</h4>
                  <p className="text-sm text-gray-600">
                    We provide general health information and guidance, but cannot provide specific diagnoses. Please
                    consult a healthcare provider for diagnosis.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Emergency?</h4>
                    <p className="text-red-800 text-sm mb-2">
                      For medical emergencies, don't wait for a response. Call emergency services immediately.
                    </p>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Call 999 Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
