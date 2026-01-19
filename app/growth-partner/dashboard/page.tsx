"use client"

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts"
import {
    Users,
    Wallet,
    CreditCard,
    TrendingUp,
    Copy,
    AlertCircle,
    Loader2,
    ExternalLink
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import Link from "next/link"
import { useGrowthPartner } from "@/api/growth-partner"

export default function GrowthPartnerDashboardPage() {
    const { getDashboard, getAnalytics } = useGrowthPartner()

    // Fetch data with real-time polling
    const { data, isLoading: isDashboardLoading, isError: isDashboardError, refetch: refetchDashboard } = getDashboard()
    const { data: analytics, isLoading: isAnalyticsLoading, isError: isAnalyticsError } = getAnalytics()

    const loading = isDashboardLoading || isAnalyticsLoading
    const error = isDashboardError || isAnalyticsError

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard!")
    }

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-muted-foreground">Failed to load dashboard data</p>
                <Button onClick={() => refetchDashboard()}>Try Again</Button>
            </div>
        )
    }

    const { partner, referralLink, recentActivity } = data
    const { metrics } = partner

    // Transform analytics data for the chart
    const chartData = analytics?.earningsBreakdown?.byMonth.map((item: any) => ({
        name: item.month,
        earnings: item.amount
    })) || []

    return (
        <div className="space-y-8">
            {/* Header Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Earnings
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{(metrics?.lifetimeEarnings || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime commissions earned
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Available Balance
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{(metrics?.pendingEarnings || 0).toLocaleString()}</div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                                Ready to withdraw
                            </p>
                            {(metrics?.pendingEarnings || 0) >= 5000 && (
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                                    <Link href="/growth-partner/withdrawals">Withdraw</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Referrals
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.totalReferrals || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {metrics?.activeSubscribers || 0} subscribed active users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Conversion Rate
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(metrics?.totalReferrals || 0) > 0
                                ? Math.round(((metrics?.activeSubscribers || 0) / (metrics?.totalReferrals || 0)) * 100)
                                : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Click to subscription rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Content Area */}
                <div className="col-span-4 space-y-4">
                    {/* Referral Link Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Referral Link</CardTitle>
                            <CardDescription>
                                Share this link to earn 20% commission on every subscription
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                                        <ExternalLink className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={referralLink}
                                        className="flex h-10 w-full rounded-md border border-input bg-muted pl-10 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <Button onClick={() => copyToClipboard(referralLink)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Earnings Chart */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => {
                                            if (!value) return '';
                                            const [year, month] = value.split('-');
                                            const date = new Date(parseInt(year), parseInt(month) - 1);
                                            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                                        }}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₦${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`₦${value}`, 'Earnings']}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="earnings" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity Sidebar */}
                <div className="col-span-3">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Your latest referrals and commissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px]">
                                {recentActivity.length > 0 ? (
                                    <div className="space-y-8">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className={`space-y-1 ${activity.type === 'subscribed' ? 'text-green-500' : 'text-blue-500'
                                                    }`}>
                                                    {activity.type === 'subscribed' ? (
                                                        <Wallet className="h-4 w-4" />
                                                    ) : (
                                                        <Users className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {activity.type === 'subscribed' ? 'Commission Earned' : 'New Referral'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {activity.referredUser ? activity.referredUser.name : 'Anonymous User'}
                                                        {activity.type === 'subscribed' && ` paid subscription`}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">
                                                    {activity.commission > 0 ? `+₦${activity.commission.toLocaleString()}` : ''}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No recent activity
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
