"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MentorDashboardHeader } from "@/components/mentor-dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, ArrowRightLeft, Landmark, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { useMentors } from "@/api/mentors"
import { useMentorCohorts } from "@/apis/mentor-cohorts"
import { useMentorEarnings } from "@/apis/mentor-earnings"
import { useMentorSettings } from "@/apis/mentor-settings"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { toast } from "sonner"

export default function MentorEarningsPage() {
  const { getMyProfile } = useMentors()
  const { getCohorts } = useMentorCohorts()
  const { getWithdrawalHistory, requestWithdrawal } = useMentorEarnings()
  const { updateSettings } = useMentorSettings()

  const { data: profileResult, isLoading: isProfileLoading, refetch: refetchProfile } = getMyProfile()
  const { data: cohortsResult, isLoading: isCohortsLoading } = getCohorts()
  const { data: historyResult, isLoading: isHistoryLoading, refetch: refetchHistory } = getWithdrawalHistory()
  
  const { mutateAsync: updateProfile, isPending: isUpdatingBank } = updateSettings
  const { mutateAsync: doWithdrawal, isPending: isWithdrawing } = requestWithdrawal

  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false)
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    accountName: ""
  })

  const profile = (profileResult as any)?.data || profileResult
  const cohortsData = (cohortsResult as any)?.data || cohortsResult
  const cohorts = Array.isArray(cohortsData) ? cohortsData : (cohortsData?.items || [])
  const historyData = (historyResult as any)?.data || historyResult
  const history = Array.isArray(historyData) ? historyData : []

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-1/4 mb-8" />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    )
  }

  const bankAccount = profile?.bankAccount || null
  const clearedBalance = profile?.clearedBalanceKobo || 0
  const pendingBalance = profile?.pendingBalanceKobo || 0
  const totalEarned = profile?.totalEarnedKobo || 0
  
  const canWithdraw = clearedBalance >= 500000 // 5000 NGN min
  const hasPendingWithdrawal = history.some((w: any) => w.status === 'PENDING')

  const handleUpdateBank = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({ bankAccount: bankForm })
      toast.success("Bank details updated successfully")
      setIsBankDialogOpen(false)
      refetchProfile()
    } catch (error: any) {
      toast.error(error.message || "Failed to update bank details")
    }
  }

  const handleWithdrawRequest = async () => {
    if (!bankAccount?.accountNumber) {
      toast.error("Please add your bank details first.")
      return
    }
    
    try {
      await doWithdrawal()
      toast.success("Withdrawal requested successfully!")
      refetchProfile()
      refetchHistory()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed to request withdrawal")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <MentorDashboardHeader />

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Earnings & Withdrawals</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Available to Withdraw</CardTitle>
                <Wallet className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ₦{(clearedBalance / 100).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Cleared funds ready for payout</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Pending Clearance</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  ₦{(pendingBalance / 100).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Clears 3 days after cohort completion</p>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <Landmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ₦{(totalEarned / 100).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Earnings by Cohort */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings by Cohort</CardTitle>
                <CardDescription>Breakdown of revenue generated per cohort</CardDescription>
              </CardHeader>
              <CardContent>
                {isCohortsLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : cohorts.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">No cohorts created yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cohort</TableHead>
                        <TableHead className="text-center">Enrolled</TableHead>
                        <TableHead className="text-right">Total Collected</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cohorts.map((cohort: any) => (
                        <TableRow key={cohort._id}>
                          <TableCell className="font-medium">{cohort.name}</TableCell>
                          <TableCell className="text-center">{cohort.currentLearnerCount || 0}</TableCell>
                          <TableCell className="text-right text-green-600 font-medium">
                            ₦{((cohort.revenue || 0) / 100).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{cohort.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Withdrawal History */}
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
              </CardHeader>
              <CardContent>
                {isHistoryLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : history.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">No withdrawal history.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((w: any) => (
                        <TableRow key={w._id}>
                          <TableCell>{format(new Date(w.createdAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="font-medium">₦{(w.amountKobo / 100).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <span className="font-medium block">{w.bankAccountSnapshot?.bankName}</span>
                              <span className="text-muted-foreground text-xs">***{w.bankAccountSnapshot?.accountNumber?.slice(-4)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {w.status === 'PENDING' && <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>}
                            {w.status === 'PROCESSING' && <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>}
                            {w.status === 'PAID' && <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>}
                            {w.status === 'REJECTED' && <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-orange-200 dark:border-orange-900/50 shadow-sm">
              <CardHeader>
                <CardTitle>Request Withdrawal</CardTitle>
                <CardDescription>Transfer cleared funds to your bank account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Bank Details Section */}
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Landmark className="h-4 w-4" /> Receiving Bank
                    </h4>
                    <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="link" size="sm" className="h-auto p-0" onClick={() => {
                          setBankForm(bankAccount || { bankName: "", accountNumber: "", accountName: "" })
                        }}>
                          {bankAccount ? 'Edit' : 'Add details'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Bank Details</DialogTitle>
                          <DialogDescription>Update your receiving bank account details.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateBank} className="space-y-4">
                          <div className="space-y-2">
                            <Label>Bank Name</Label>
                            <Input required value={bankForm.bankName} onChange={e => setBankForm({...bankForm, bankName: e.target.value})} placeholder="e.g. Guarantee Trust Bank" />
                          </div>
                          <div className="space-y-2">
                            <Label>Account Number</Label>
                            <Input required value={bankForm.accountNumber} onChange={e => setBankForm({...bankForm, accountNumber: e.target.value})} placeholder="0123456789" />
                          </div>
                          <div className="space-y-2">
                            <Label>Account Name</Label>
                            <Input required value={bankForm.accountName} onChange={e => setBankForm({...bankForm, accountName: e.target.value})} placeholder="Jane Doe" />
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={isUpdatingBank}>
                              {isUpdatingBank ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null} Save Details
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {bankAccount ? (
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{bankAccount.accountName}</p>
                      <p className="text-muted-foreground">{bankAccount.bankName}</p>
                      <p className="text-muted-foreground tracking-widest">{bankAccount.accountNumber}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-600 p-2 bg-amber-50 rounded border border-amber-100">
                      <AlertCircle className="h-4 w-4" />
                      <span>Bank details required for payout</span>
                    </div>
                  )}
                </div>

                {/* Status Checks */}
                <div className="space-y-4">
                  {hasPendingWithdrawal ? (
                    <div className="p-3 bg-blue-50 text-blue-800 rounded border border-blue-100 text-sm">
                      You currently have a withdrawal being processed. You can request another once it clears.
                    </div>
                  ) : !canWithdraw ? (
                    <div className="p-3 bg-muted rounded border text-sm text-muted-foreground">
                      Minimum withdrawal amount is ₦5,000. Your cleared balance is currently ₦{(clearedBalance / 100).toLocaleString()}.
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 text-green-800 rounded border border-green-100 text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Ready to withdraw ₦{(clearedBalance / 100).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
                  disabled={!canWithdraw || hasPendingWithdrawal || !bankAccount || isWithdrawing}
                  onClick={handleWithdrawRequest}
                >
                  {isWithdrawing ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    <><ArrowRightLeft className="mr-2 h-4 w-4" /> Request Payout</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
