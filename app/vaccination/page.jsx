"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, AlertCircle, CheckCircle, Baby, User, Users } from "lucide-react"
import Navbar from "@/components/Navbar"

const vaccinationSchedules = [
  {
    id: "1",
    vaccine: "BCG",
    ageGroup: "Birth",
    description: "Protects against tuberculosis (TB)",
    schedule: "At birth or within 2 weeks",
    location: "All health facilities",
    importance: "high",
  },
  {
    id: "2",
    vaccine: "Polio (OPV)",
    ageGroup: "Birth",
    description: "Protects against poliomyelitis",
    schedule: "At birth, 6, 10, 14 weeks",
    location: "All health facilities",
    importance: "high",
  },
  {
    id: "3",
    vaccine: "DPT-HepB-Hib (Pentavalent)",
    ageGroup: "6 weeks",
    description: "Protects against diphtheria, pertussis, tetanus, hepatitis B, and Haemophilus influenzae type b",
    schedule: "6, 10, 14 weeks",
    location: "All health facilities",
    importance: "high",
  },
  {
    id: "4",
    vaccine: "Pneumococcal (PCV)",
    ageGroup: "6 weeks",
    description: "Protects against pneumococcal diseases",
    schedule: "6, 10, 14 weeks",
    location: "All health facilities",
    importance: "high",
  },
  {
    id: "5",
    vaccine: "Rotavirus",
    ageGroup: "6 weeks",
    description: "Protects against rotavirus diarrhea",
    schedule: "6, 10 weeks",
    location: "All health facilities",
    importance: "medium",
  },
  {
    id: "6",
    vaccine: "Measles-Rubella (MR)",
    ageGroup: "9 months",
    description: "Protects against measles and rubella",
    schedule: "9 months, 18 months",
    location: "All health facilities",
    importance: "high",
  },
  {
    id: "7",
    vaccine: "Yellow Fever",
    ageGroup: "9 months",
    description: "Protects against yellow fever",
    schedule: "9 months (one-time)",
    location: "All health facilities",
    importance: "high",
  },
  {
    id: "8",
    vaccine: "HPV (Human Papillomavirus)",
    ageGroup: "10 years",
    description: "Protects against cervical cancer (for girls)",
    schedule: "10 years (2 doses, 6 months apart)",
    location: "Schools and health facilities",
    importance: "high",
  },
  {
    id: "9",
    vaccine: "COVID-19",
    ageGroup: "12+ years",
    description: "Protects against COVID-19",
    schedule: "2 doses, booster as recommended",
    location: "Designated vaccination centers",
    importance: "high",
  },
  {
    id: "10",
    vaccine: "Tetanus Toxoid (TT)",
    ageGroup: "Pregnant women",
    description: "Protects mother and baby against tetanus",
    schedule: "During pregnancy (2 doses)",
    location: "Antenatal clinics",
    importance: "high",
  },
]

const ageGroups = ["All", "Birth", "6 weeks", "9 months", "10 years", "12+ years", "Pregnant women"]

const importanceColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

const getAgeGroupIcon = (ageGroup) => {
  if (ageGroup.includes("Birth") || ageGroup.includes("weeks") || ageGroup.includes("months")) {
    return <Baby className="h-4 w-4" />
  }
  if (ageGroup.includes("Pregnant")) {
    return <User className="h-4 w-4" />
  }
  return <Users className="h-4 w-4" />
}

export default function VaccinationPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All")
  const [completedVaccines, setCompletedVaccines] = useState(new Set())

  const filteredSchedules =
    selectedAgeGroup === "All"
      ? vaccinationSchedules
      : vaccinationSchedules.filter((schedule) => schedule.ageGroup === selectedAgeGroup)

  const toggleCompletion = (vaccineId) => {
    const newCompleted = new Set(completedVaccines)
    if (newCompleted.has(vaccineId)) {
      newCompleted.delete(vaccineId)
    } else {
      newCompleted.add(vaccineId)
    }
    setCompletedVaccines(newCompleted)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vaccination Schedule</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay up-to-date with Kenya's national vaccination schedule. Protect yourself and your family with timely
            immunizations according to the Ministry of Health guidelines.
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Important Notice</h3>
                <p className="text-blue-800 text-sm">
                  This vaccination schedule follows Kenya's Ministry of Health guidelines. Always consult with your
                  healthcare provider for personalized vaccination advice. Keep your vaccination records up to date.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Age Group Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter by Age Group</h2>
          <div className="flex flex-wrap gap-2">
            {ageGroups.map((ageGroup) => (
              <Button
                key={ageGroup}
                variant={selectedAgeGroup === ageGroup ? "default" : "outline"}
                onClick={() => setSelectedAgeGroup(ageGroup)}
                className={selectedAgeGroup === ageGroup ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {ageGroup}
              </Button>
            ))}
          </div>
        </div>

        {/* Vaccination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchedules.map((schedule) => {
            const isCompleted = completedVaccines.has(schedule.id)
            return (
              <Card
                key={schedule.id}
                className={`hover:shadow-lg transition-shadow ${isCompleted ? "bg-green-50 border-green-200" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getAgeGroupIcon(schedule.ageGroup)}
                        <Badge variant="outline" className="text-xs">
                          {schedule.ageGroup}
                        </Badge>
                        <Badge className={importanceColors[schedule.importance]}>
                          {schedule.importance.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="flex items-center gap-2">
                        {schedule.vaccine}
                        {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </CardTitle>
                      <CardDescription>{schedule.description}</CardDescription>
                    </div>
                    <Button
                      variant={isCompleted ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCompletion(schedule.id)}
                      className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {isCompleted ? "Completed" : "Mark Complete"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        <strong>Schedule:</strong> {schedule.schedule}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        <strong>Location:</strong> {schedule.location}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Vaccination Centers */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Find Vaccination Centers
            </CardTitle>
            <CardDescription>Locate nearby health facilities offering vaccination services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Kenyatta National Hospital</h4>
                <p className="text-sm text-gray-600 mb-2">Upper Hill, Nairobi</p>
                <p className="text-sm text-gray-600">Phone: +254 20 2726300</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Moi Teaching & Referral Hospital</h4>
                <p className="text-sm text-gray-600 mb-2">Eldoret, Uasin Gishu</p>
                <p className="text-sm text-gray-600">Phone: +254 53 203 3471</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Coast Provincial General Hospital</h4>
                <p className="text-sm text-gray-600 mb-2">Mombasa, Coast</p>
                <p className="text-sm text-gray-600">Phone: +254 41 231 2191</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline">Find More Centers Near You</Button>
            </div>
          </CardContent>
        </Card>

        {/* Vaccination Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Vaccination Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Before Vaccination</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ensure your child is healthy</li>
                  <li>• Bring vaccination card/records</li>
                  <li>• Inform healthcare provider of any allergies</li>
                  <li>• Ask questions if you have concerns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">After Vaccination</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Monitor for any side effects</li>
                  <li>• Keep vaccination records safe</li>
                  <li>• Schedule next appointment if needed</li>
                  <li>• Contact healthcare provider if concerned</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
