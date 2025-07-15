"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Clock, Search, AlertTriangle, Heart, Ambulance } from "lucide-react"
import Navbar from "@/components/Navbar"

const emergencyContacts = [
  {
    id: "1",
    name: "Kenya Emergency Services",
    type: "hotline",
    phone: "999",
    location: "Nationwide",
    available: "24/7",
    description: "National emergency hotline for police, fire, and medical emergencies",
    county: "All",
  },
  {
    id: "2",
    name: "Kenya Red Cross Emergency",
    type: "ambulance",
    phone: "1199",
    location: "Nationwide",
    available: "24/7",
    description: "Emergency ambulance and rescue services",
    county: "All",
  },
  {
    id: "3",
    name: "Kenyatta National Hospital",
    type: "hospital",
    phone: "+254 20 2726300",
    location: "Upper Hill, Nairobi",
    available: "24/7",
    description: "National referral hospital with emergency services",
    county: "Nairobi",
  },
  {
    id: "4",
    name: "Aga Khan University Hospital",
    type: "hospital",
    phone: "+254 20 3662000",
    location: "Parklands, Nairobi",
    available: "24/7",
    description: "Private hospital with 24/7 emergency services",
    county: "Nairobi",
  },
  {
    id: "5",
    name: "Moi Teaching & Referral Hospital",
    type: "hospital",
    phone: "+254 53 203 3471",
    location: "Eldoret, Uasin Gishu",
    available: "24/7",
    description: "Regional referral hospital serving Western Kenya",
    county: "Uasin Gishu",
  },
  {
    id: "6",
    name: "Coast Provincial General Hospital",
    type: "hospital",
    phone: "+254 41 231 2191",
    location: "Mombasa, Coast",
    available: "24/7",
    description: "Main referral hospital for Coast region",
    county: "Mombasa",
  },
  {
    id: "7",
    name: "St. Francis Community Hospital",
    type: "ambulance",
    phone: "+254 67 52023",
    location: "Kasarani, Nairobi",
    available: "24/7",
    description: "Community hospital with ambulance services",
    county: "Nairobi",
  },
  {
    id: "8",
    name: "Poison Information Centre",
    type: "hotline",
    phone: "+254 20 2725560",
    location: "Nairobi",
    available: "24/7",
    description: "Emergency poison control and information",
    county: "All",
  },
  {
    id: "9",
    name: "Nakuru Provincial General Hospital",
    type: "hospital",
    phone: "+254 51 221 4000",
    location: "Nakuru, Nakuru",
    available: "24/7",
    description: "Regional hospital serving Rift Valley region",
    county: "Nakuru",
  },
  {
    id: "10",
    name: "Kisumu District Hospital",
    type: "hospital",
    phone: "+254 57 202 3900",
    location: "Kisumu, Kisumu",
    available: "24/7",
    description: "Regional hospital serving Nyanza region",
    county: "Kisumu",
  },
]

const counties = ["All", "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", "Machakos", "Kiambu"]

const typeColors = {
  hospital: "bg-blue-100 text-blue-800",
  ambulance: "bg-red-100 text-red-800",
  hotline: "bg-green-100 text-green-800",
  pharmacy: "bg-purple-100 text-purple-800",
}

const typeIcons = {
  hospital: Heart,
  ambulance: Ambulance,
  hotline: Phone,
  pharmacy: Heart,
}

export default function EmergencyPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCounty, setSelectedCounty] = useState("All")
  const [selectedType, setSelectedType] = useState("all")

  const filteredContacts = emergencyContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCounty = selectedCounty === "All" || contact.county === selectedCounty || contact.county === "All"

    const matchesType = selectedType === "all" || contact.type === selectedType

    return matchesSearch && matchesCounty && matchesType
  })

  const callEmergency = (phone) => {
    window.open(`tel:${phone}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Emergency Contacts</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Quick access to emergency numbers and health facilities across Kenya. Save these contacts and know where to
            get help when you need it most.
          </p>
        </div>

        {/* Emergency Alert */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">In Case of Emergency</h3>
                <p className="text-red-800 text-sm mb-2">
                  For immediate life-threatening emergencies, call <strong>999</strong> or <strong>1199</strong> first.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => callEmergency("999")}>
                    <Phone className="h-4 w-4 mr-1" />
                    Call 999
                  </Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => callEmergency("1199")}>
                    <Ambulance className="h-4 w-4 mr-1" />
                    Call 1199
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search hospitals, services, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {counties.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                <option value="hospital">Hospitals</option>
                <option value="ambulance">Ambulance</option>
                <option value="hotline">Hotlines</option>
                <option value="pharmacy">Pharmacies</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContacts.map((contact) => {
            const IconComponent = typeIcons[contact.type]
            return (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="h-4 w-4" />
                        <Badge className={typeColors[contact.type]}>{contact.type.toUpperCase()}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {contact.available}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <CardDescription>{contact.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{contact.phone}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => callEmergency(contact.phone)}
                        className="ml-auto"
                      >
                        Call Now
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{contact.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Available: {contact.available}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* First Aid Tips */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Basic First Aid Tips
            </CardTitle>
            <CardDescription>Essential first aid knowledge that could save a life</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-red-800">Choking</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Encourage coughing</li>
                  <li>• Give 5 back blows</li>
                  <li>• Give 5 abdominal thrusts</li>
                  <li>• Call for help if unsuccessful</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-red-800">Bleeding</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Apply direct pressure</li>
                  <li>• Elevate the wound</li>
                  <li>• Use clean cloth/bandage</li>
                  <li>• Seek medical attention</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-red-800">Burns</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cool with running water</li>
                  <li>• Remove jewelry/clothing</li>
                  <li>• Cover with clean cloth</li>
                  <li>• Don't use ice or butter</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Preparedness */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Emergency Preparedness</CardTitle>
            <CardDescription>Be prepared for medical emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Emergency Kit Essentials</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• First aid supplies</li>
                  <li>• Emergency medications</li>
                  <li>• Important phone numbers</li>
                  <li>• Medical information cards</li>
                  <li>• Flashlight and batteries</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Important Information to Keep</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Medical conditions and allergies</li>
                  <li>• Current medications</li>
                  <li>• Emergency contact numbers</li>
                  <li>• Insurance information</li>
                  <li>• Blood type</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
