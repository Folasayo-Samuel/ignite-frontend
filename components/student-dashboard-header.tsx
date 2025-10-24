"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { Bell, Settings } from "lucide-react"

export function StudentDashboardHeader() {

  const {currentUser} = useAuthStore()

  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {currentUser?.name}!</h1>
            <p className="text-sm text-muted-foreground">Keep up the great work on your learning journey</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Amara" />
              <AvatarFallback>AO</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
