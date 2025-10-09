import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Download } from "lucide-react"

export function PartnerDashboardHeader() {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">TechHub Academy</h1>
            <p className="text-sm text-muted-foreground">Partner Dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Report</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="TechHub" />
              <AvatarFallback>TH</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
