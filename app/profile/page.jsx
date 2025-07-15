"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login") // Redirect to login if not authenticated
    } else if (user) {
      setName(user.name)
      setEmail(user.email)
      fetchUserProfile()
    }
  }, [user, authLoading, router])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setFetchError("Authentication token not found.")
        return
      }

      const response = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setName(data.user.name)
        setEmail(data.user.email)
      } else {
        const errorData = await response.json()
        setFetchError(errorData.error || "Failed to fetch profile data.")
        if (response.status === 401) {
          logout() // Log out if token is invalid
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      setFetchError("Network error or server issue.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFetchError(null)

    if (password && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password: password || undefined }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        })
        setPassword("")
        setConfirmPassword("")
        // Re-fetch user data to update context if email/name changed
        fetchUserProfile()
      } else {
        const errorData = await response.json()
        setFetchError(errorData.error || "Failed to update profile.")
        toast({
          title: "Error",
          description: errorData.error || "Failed to update profile.",
          variant: "destructive",
        })
        if (response.status === 401) {
          logout() // Log out if token is invalid
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setFetchError("Network error or server issue.")
      toast({
        title: "Error",
        description: "Network error or server issue.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
          <CardDescription>Manage your account information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {fetchError && <div className="text-red-500 text-sm text-center">{fetchError}</div>}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">New Password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
