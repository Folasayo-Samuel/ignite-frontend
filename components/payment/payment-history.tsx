"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Download,
  RefreshCw,
  Eye,
  ExternalLink
} from "lucide-react"
import { useSubscriptions } from "@/api/subscriptions"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export function PaymentHistory() {
  const { getMySubscriptions, verifyPayment } = useSubscriptions()
  const { data: subsResult, isLoading } = getMySubscriptions()
  const subscriptions = (subsResult as any)?.data || []

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isVerifying, setIsVerifying] = useState<string | null>(null)

  const filteredSubscriptions = subscriptions.filter((sub: any) => {
    const matchesSearch = sub.paymentReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.cohortId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || sub.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleVerifyPayment = async (reference: string) => {
    setIsVerifying(reference)
    try {
      const { mutate: verify } = verifyPayment
      await verify({ reference })
      toast.success("Payment verification completed")
    } catch (error) {
      toast.error("Payment verification failed")
    } finally {
      setIsVerifying(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'pending': return 'secondary'
      case 'expired': return 'destructive'
      case 'cancelled': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'pending': return Clock
      case 'expired': return XCircle
      case 'cancelled': return XCircle
      default: return Clock
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment History</h2>
        <p className="text-muted-foreground">
          View and manage your subscription payments
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by reference or cohort ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("all")}
              >
                All
              </Button>
              <Button
                variant={selectedStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={selectedStatus === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("pending")}
              >
                Pending
              </Button>
              <Button
                variant={selectedStatus === "expired" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("expired")}
              >
                Expired
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Transactions</CardTitle>
              <CardDescription>
                {filteredSubscriptions.length} payment{filteredSubscriptions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubscriptions.map((subscription: any) => {
                const StatusIcon = getStatusIcon(subscription.status)
                
                return (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full bg-muted ${
                        subscription.status === 'active' ? 'text-green-600' :
                        subscription.status === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {subscription.paymentReference || 'N/A'}
                          </p>
                          <Badge variant={getStatusColor(subscription.status)}>
                            {subscription.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Cohort: {subscription.cohortId}</span>
                          <span>Amount: ₦{subscription.amount?.toLocaleString()}</span>
                          {subscription.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(subscription.startDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {subscription.status === 'pending' && subscription.paymentReference && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyPayment(subscription.paymentReference)}
                          disabled={isVerifying === subscription.paymentReference}
                        >
                          {isVerifying === subscription.paymentReference ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          Verify
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {subscription.status === 'active' && (
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
