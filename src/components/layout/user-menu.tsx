"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/services/api"
import { ApiError } from "@/types/api"

export function UserMenu() {
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await authApi.logout()
      window.location.href = '/login'
    } catch (error) {
      const apiError = error as ApiError
      toast({
        title: "Error",
        description: apiError.response?.data?.message || "Failed to logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <Button
        variant="outline"
        size="icon"
        onClick={handleLogout}
        title="Logout"
      >
        <LogOut className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Logout</span>
      </Button>
    </div>
  )
} 