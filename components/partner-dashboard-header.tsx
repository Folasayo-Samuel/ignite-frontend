import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Download, CheckCircle } from "lucide-react"
import { useAuthContext } from "@/components/auth/auth-provider"
import { useOrganizations } from "@/api/organizations"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function PartnerDashboardHeader() {
  const { user } = useAuthContext();
  const orgId = user?.organizationId || "";
  const { getOrganization } = useOrganizations();
  const { data: orgResult, isLoading } = getOrganization(orgId);
  const org = (orgResult as any)?.data;

  const isVerified = org?.subscription?.tier === 'growth' || org?.subscription?.tier === 'scale';

  if (isLoading && orgId) {
    return (
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">
                {org?.name || "My Organization"}
              </h1>
              {isVerified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800 gap-1">
                  <CheckCircle className="h-3 w-3 fill-current" />
                  Verified Partner
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Learning Partner Dashboard</p>
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
              <AvatarImage src={org?.logo || "/placeholder.svg?height=40&width=40"} alt={org?.name || "Org"} />
              <AvatarFallback>{org?.name?.substring(0, 2).toUpperCase() || "OR"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
