"use client"

import { useState } from "react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import { useGrowthPartner } from "@/apis/growth-partner"
import { RoleGuard } from "@/components/shared/RoleGuard"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/shared/LoadingScreen"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { 
  Copy, Check, Share2, TrendingUp, Users, MousePointerClick, 
  Wallet, ArrowDownRight, ArrowUpRight, DollarSign, Activity, AlertCircle
} from "lucide-react"

export default function GrowthPartnerDashboardPage() {
  return (
    <RoleGuard allowedRoles={["student", "mentor", "partner", "admin"]}>
      <PartnerDashboardContent />
    </RoleGuard>
  )
}

function PartnerDashboardContent() {
  const { getDashboard, getAnalytics, getTransactions, getWithdrawals, requestWithdrawal } = useGrowthPartner()
  
  const { data: dashboard, isLoading: dashLoading } = getDashboard()
  const { data: analytics, isLoading: analyticsLoading } = getAnalytics()
  const { data: transactionsRes } = getTransactions({ limit: 10 })
  const { data: withdrawalsRes } = getWithdrawals({ limit: 5 })

  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCaption, setCopiedCaption] = useState<string | null>(null)
  
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  if (dashLoading || analyticsLoading) return <LoadingScreen />

  // If user is not a partner yet, they shouldn't see this dashboard data, 
  // but let's assume the API returns null or errors if not registered.
  if (!dashboard?.partner) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Not a Growth Partner Yet</h2>
          <p className="text-muted-foreground mb-6">You need to register as a growth partner to access this dashboard.</p>
          <Button asChild>
            <Link href="/home/growth-partner">Learn about the program</Link>
          </Button>
        </div>
      </main>
    )
  }

  const { partner, referralLink } = dashboard
  const stats = analytics?.referralStats
  const earnings = analytics?.earningsBreakdown
  const transactions = transactionsRes?.data || []
  const withdrawals = withdrawalsRes?.data || []

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopiedLink(true)
    toast.success("Referral link copied!")
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCopyCaption = (platform: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCaption(platform)
    toast.success(`${platform} caption copied!`)
    setTimeout(() => setCopiedCaption(null), 2000)
  }

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(withdrawalAmount)
    if (isNaN(amount) || amount < 5000) {
      return toast.error("Minimum withdrawal is ₦5,000")
    }
    if (amount > (earnings?.pending || 0)) {
      return toast.error("Insufficient cleared balance")
    }

    try {
      setIsWithdrawing(true)
      await requestWithdrawal.mutateAsync({ amount })
      toast.success("Withdrawal request submitted successfully!")
      setWithdrawalAmount("")
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit withdrawal request")
    } finally {
      setIsWithdrawing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
  }

  const captions = {
    whatsapp: `I found an affordable way to build real tech skills in 30 days with a mentor. Check out FolaIgnite 👇 ${referralLink}`,
    twitter: `Want to learn tech skills with a mentor in just 30 minutes/day? Try @FolaIgnite — 30-day challenges, real projects, ₦5k. Start here: ${referralLink}`,
    linkedin: `I recently discovered FolaIgnite, an excellent platform for building practical tech skills through 30-day mentored challenges. Highly recommended for aspiring developers and designers. Check it out: ${referralLink}`
  }

  return (
    <main className="min-h-screen flex flex-col bg-muted/20">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Growth Partner Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your referrals, track earnings, and request withdrawals.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 uppercase tracking-wider py-1">
              Tier: {partner.partnershipTier}
            </Badge>
            <Badge className={partner.status === 'active' ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500"}>
              {partner.status}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-background border shadow-sm h-12 p-1">
            <TabsTrigger value="overview" className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
            <TabsTrigger value="referrals" className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">My Link & Referrals</TabsTrigger>
            <TabsTrigger value="commissions" className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Commissions & History</TabsTrigger>
            <TabsTrigger value="withdrawals" className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Withdrawals</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Link Clicks</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.clicked || 0}</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Signups</CardTitle>
                  <Users className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.signedUp || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Users who created an account</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Paid Conversions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.subscribed || 0}</div>
                  <p className="text-xs text-green-600 mt-1 font-medium">{stats?.conversionRate?.toFixed(1) || 0}% conversion rate</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm bg-primary/5 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-primary">Total Earned</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(earnings?.lifetime || 0)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Link Card */}
              <Card className="md:col-span-2 shadow-sm border-orange-100">
                <CardHeader>
                  <CardTitle>Your Referral Link</CardTitle>
                  <CardDescription>Share this link to earn 20% commission on every enrollment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input readOnly value={referralLink} className="bg-muted font-mono text-sm" />
                    <Button onClick={handleCopyLink} variant="secondary" className="shrink-0 w-24">
                      {copiedLink ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copiedLink ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="bg-white p-2 rounded border shadow-sm shrink-0">
                      <QRCodeSVG value={referralLink} size={80} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-1">Scan to register</h4>
                      <p className="text-sm text-orange-700">
                        You can show this QR code to friends in person to instantly direct them to your referral page.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Balances Card */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Wallet Balances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Available (Cleared)</span>
                    </div>
                    <span className="font-bold">{formatCurrency(earnings?.pending || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg opacity-70">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Pending (Escrow)</span>
                    </div>
                    <span className="font-bold">{formatCurrency((earnings?.lifetime || 0) - (earnings?.withdrawn || 0) - (earnings?.pending || 0) || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg opacity-70">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Withdrawn</span>
                    </div>
                    <span className="font-bold">{formatCurrency(earnings?.withdrawn || 0)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* REFERRALS TAB */}
          <TabsContent value="referrals" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Share Ready Captions</CardTitle>
                <CardDescription>Click to copy pre-written promotional text optimized for different platforms.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.entries(captions)).map(([platform, text]) => (
                    <div key={platform} className="border rounded-lg p-4 relative group hover:border-primary transition-colors flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold capitalize text-sm">{platform}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground flex-1 mb-4">"{text}"</p>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full mt-auto"
                        onClick={() => handleCopyCaption(platform, text)}
                      >
                        {copiedCaption === platform ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        Copy {platform} Text
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
                <CardDescription>Users who signed up using your link.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  View full referral history in the Commissions tab.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMMISSIONS TAB */}
          <TabsContent value="commissions" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Commission History</CardTitle>
                <CardDescription>A record of all your earnings from referred enrollments.</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg bg-muted/30">
                    <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                    <h3 className="text-lg font-medium mb-1">No commissions yet</h3>
                    <p className="text-sm text-muted-foreground">Share your link to start earning!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx: any) => (
                          <TableRow key={tx.transactionId}>
                            <TableCell className="whitespace-nowrap">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={tx.type === 'commission' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}>
                                {tx.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">{tx.description}</TableCell>
                            <TableCell>
                              <Badge variant={
                                tx.status === 'cleared' || tx.status === 'completed' ? 'default' : 
                                tx.status === 'pending' ? 'secondary' : 'destructive'
                              }>
                                {tx.status}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-medium ${tx.type === 'commission' ? 'text-green-600' : 'text-foreground'}`}>
                              {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* WITHDRAWALS TAB */}
          <TabsContent value="withdrawals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Request Withdrawal</CardTitle>
                  <CardDescription>Transfer your cleared earnings to your bank account.</CardDescription>
                </CardHeader>
                <form onSubmit={handleWithdrawal}>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                      <span className="text-sm font-medium">Available Balance</span>
                      <span className="font-bold text-lg">{formatCurrency(earnings?.pending || 0)}</span>
                    </div>

                    {(earnings?.pending || 0) < 5000 ? (
                      <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <p>Minimum withdrawal amount is ₦5,000. Keep referring to reach the threshold!</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount to withdraw</label>
                        <Input 
                          type="number" 
                          placeholder="e.g. 5000" 
                          min="5000"
                          max={earnings?.pending || 0}
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                          required
                        />
                        {partner.bankDetails?.NGN?.isVerified ? (
                          <p className="text-xs text-muted-foreground mt-2">
                            Funds will be sent to {partner.bankDetails.NGN.bankName} (...{partner.bankDetails.NGN.accountNumber.slice(-4)})
                          </p>
                        ) : (
                          <p className="text-xs text-destructive mt-2">
                            Please verify your bank details in profile settings before withdrawing.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90" 
                      disabled={isWithdrawing || (earnings?.pending || 0) < 5000 || !partner.bankDetails?.NGN?.isVerified}
                    >
                      {isWithdrawing ? "Processing..." : "Submit Request"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              <Card className="md:col-span-2 shadow-sm">
                <CardHeader>
                  <CardTitle>Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                  {withdrawals.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No withdrawal history found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {withdrawals.map((w: any) => (
                            <TableRow key={w.withdrawalId}>
                              <TableCell>{new Date(w.requestedAt).toLocaleDateString()}</TableCell>
                              <TableCell className="font-medium">{formatCurrency(w.amount)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {w.bankDetails?.bankName} (...{w.bankDetails?.accountNumber?.slice(-4)})
                              </TableCell>
                              <TableCell>
                                <Badge variant={w.status === 'completed' ? 'default' : w.status === 'pending' ? 'secondary' : 'destructive'}>
                                  {w.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </main>
  )
}
