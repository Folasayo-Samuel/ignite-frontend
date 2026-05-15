"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Handshake, Mail, RefreshCw, Eye, Globe, XCircle } from "lucide-react"
import { useAdmin } from "@/apis/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils"

interface GrowthPartner {
  _id: string;
  partnerId: string;
  referralCode: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  country: string;
  preferredCurrency: 'NGN' | 'USD';
  partnershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  commissionRate: number;
  metrics: {
    totalReferrals: number;
    activeSubscribers: number;
  };
  balances: {
    NGN?: { lifetime: number; available: number };
    USD?: { lifetime: number; available: number };
  };
  userId?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export function AdminPartnerManagement() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { getGrowthPartners } = useAdmin()
  const { data: result, isLoading, isError, error, refetch } = getGrowthPartners({ page, limit })

  const partners: GrowthPartner[] = Array.isArray(result?.data) ? result.data : []
  const totalPartners = result?.total || 0
  const totalPages = result?.totalPages || 1

  const handleSendEmail = (partner: GrowthPartner) => {
    if (partner.userId?.email) {
      window.location.href = `mailto:${partner.userId.email}?subject=FolaIgnite Partnership Communication`
    }
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'active': return 'default'
      case 'pending': return 'secondary'
      case 'suspended': return 'destructive'
      default: return 'outline'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-600 border-purple-600'
      case 'gold': return 'text-yellow-600 border-yellow-600'
      case 'silver': return 'text-gray-400 border-gray-400'
      default: return 'text-orange-600 border-orange-600'
    }
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
          <p className="text-destructive font-medium mb-2">Failed to load partners</p>
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
            <Handshake className="h-5 w-5" />
            Partnership Management
          </CardTitle>
          <CardDescription>View and manage {totalPartners} growth partners</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {partners.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground italic">
              No growth partners found.
            </div>
          ) : (
            <>
              {partners.map((partner) => (
                <div
                  key={partner._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12 border">
                      <AvatarFallback className="bg-orange-50 text-orange-700">
                        {partner.userId?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "GP"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{partner.userId?.name || "Unknown Partner"}</span>
                        <Badge variant={getStatusVariant(partner.status)} className="capitalize px-1.5 py-0 h-5 text-[10px]">
                          {partner.status}
                        </Badge>
                        <Badge variant="outline" className={`capitalize px-1.5 py-0 h-5 text-[10px] ${getTierColor(partner.partnershipTier)}`}>
                          {partner.partnershipTier}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {partner.userId?.email}
                        </span>
                        <span className="flex items-center gap-1 font-mono bg-muted px-1 rounded">
                          CODE: {partner.referralCode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {partner.country}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 mt-1">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Referrals: </span>
                          <span className="font-bold">{partner.metrics?.totalReferrals || 0}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Earnings: </span>
                          <span className="font-bold text-green-600">
                            {partner.preferredCurrency === 'NGN' 
                              ? formatCurrency((partner.balances?.NGN?.lifetime || 0) / 100, "NGN")
                              : `$${(partner.balances?.USD?.lifetime || 0).toLocaleString()}`}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Joined {new Date(partner.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSendEmail(partner)}>
                        <Mail className="h-4 w-4 mr-2" /> Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" /> View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <XCircle className="h-4 w-4 mr-2" /> Suspend Partner
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4 border-t mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm font-medium">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
