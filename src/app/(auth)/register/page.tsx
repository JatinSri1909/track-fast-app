"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { authApi } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { ApiError } from "@/types/api"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { APP_NAME } from "@/lib/constants"
import { Rocket } from "lucide-react"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await authApi.register(formData)
      router.push("/dashboard")
    } catch (error) {
      const apiError = error as ApiError
      toast({
        title: "Error",
        description: apiError.response?.data?.message || "Registration failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-6 p-6 border rounded-lg">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">{APP_NAME}</h1>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold">Create an account</h2>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={formData.firstName}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={formData.lastName}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  )
}

