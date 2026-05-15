"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Heart, Mail, RefreshCw, CheckCircle, XCircle, Globe, Link as LinkIcon, Eye } from "lucide-react"
import { useAdmin } from "@/apis/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils"

interface Sponsorship {
  _id: string;
  fullName: string;
  email: string;
  organization?: string;
  websiteUrl?: string;
  logoUrl?: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  isApproved: boolean;
  reference: string;
  paidAt?: string;
  createdAt: string;
}

export function AdminSponsorManagement() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { getSponsors, approveSponsor, rejectSponsor } = useAdmin()
  const { data: sponsorsData, isLoading, isError, error, refetch } = getSponsors({ page, limit })

  const sponsors: Sponsorship[] = sponsorsData?.data || []
  const totalPages = sponsorsData?.totalPages || 1

  const handleApprove = (sponsor: Sponsorship) => {
    approveSponsor.mutate({ id: sponsor._id }, {
      onSuccess: () => {
        toast.success(`Sponsorship from ${sponsor.fullName} approved`)
        refetch()
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to approve sponsor")
      }
    })
  }

  const handleReject = (sponsor: Sponsorship) => {
    rejectSponsor.mutate({ id: sponsor._id }, {
      onSuccess: () => {
        toast.success(`Sponsorship from ${sponsor.fullName} rejected/unapproved`)
        refetch()
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to reject sponsor")
      }
    })
  }

  const handleSendEmail = (sponsor: Sponsorship) => {
    window.location.href = `mailto:${sponsor.email}?subject=FolaIgnite Sponsorship Inquiry`
  }

  const getTierFromAmount = (amount: number): { label: string; color: string } => {
    if (amount >= 500000) return { label: 'Visionary Sponsor', color: 'text-purple-600 bg-purple-50 border-purple-200' }
    if (amount >= 100000) return { label: 'Champion Sponsor', color: 'text-blue-600 bg-blue-50 border-blue-200' }
    if (amount >= 20000) return { label: 'Career Catalyst', color: 'text-green-600 bg-green-50 border-green-200' }
    return { label: 'Community Backer', color: 'text-orange-600 bg-orange-50 border-orange-200' }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="py-10 text-center">
          <p className="text-destructive font-medium mb-2">Failed to load sponsors</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Sponsorship Management
          </CardTitle>
          <CardDescription>Review and manage {sponsors.length} platform sponsors</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sponsors.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground italic">
              No sponsors found.
            </div>
          ) : (
            sponsors.map((sponsor) => {
              const tier = getTierFromAmount(sponsor.amount)
              
              return (
                <div
                  key={sponsor._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={sponsor.logoUrl} />
                      <AvatarFallback className="bg-blue-50 text-blue-700">
                        {sponsor.organization ? sponsor.organization[0].toUpperCase() : sponsor.fullName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{sponsor.fullName}</span>
                        {sponsor.organization && (
                          <span className="text-sm text-muted-foreground">at {sponsor.organization}</span>
                        )}
                        <Badge variant={sponsor.isApproved ? "default" : "secondary"} className="capitalize px-1.5 py-0 h-5 text-[10px]">
                          {sponsor.isApproved ? 'Approved' : 'Pending Approval'}
                        </Badge>
                        <Badge variant="outline" className={`capitalize px-1.5 py-0 h-5 text-[10px] ${tier.color}`}>
                          {tier.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {sponsor.email}
                        </span>
                        {sponsor.websiteUrl && (
                          <a href={sponsor.websiteUrl} target="_blank" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
                            <LinkIcon className="h-3 w-3" /> {sponsor.websiteUrl.replace(/^https?:\/\//, '').split('/')[0]}
                          </a>
                        )}
                        <span className={`flex items-center gap-1 font-bold ${sponsor.status === 'success' ? 'text-green-600' : 'text-orange-500'}`}>
                          {sponsor.status === 'success' ? '✓ Paid' : '⌛ Pending Payment'}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 mt-1">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Amount: </span>
                          <span className="font-bold">{formatCurrency(sponsor.amount, "NGN")}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Reference: <span className="font-mono">{sponsor.reference}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Requested {new Date(sponsor.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!sponsor.isApproved ? (
                      <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 border-green-200" onClick={() => handleApprove(sponsor)}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive border-red-100" onClick={() => handleReject(sponsor)}>
                        <XCircle className="h-4 w-4 mr-1" /> Revoke
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSendEmail(sponsor)}>
                          <Mail className="h-4 w-4 mr-2" /> Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t">
            <p className="text-[11px] text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-3 w-3 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
