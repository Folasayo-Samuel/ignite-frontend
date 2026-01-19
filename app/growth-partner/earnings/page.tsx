"use client"

import { useState, useEffect } from "react"
import { getEarningsBreakdown } from "@/lib/services/growth-partner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts"
import { Loader2, TrendingUp, Calendar, Wallet } from "lucide-react"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

export default function EarningsPage() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const result = await getEarningsBreakdown()
            setData(result)
        } catch (err) {
            toast.error("Failed to load earnings report")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading report...</p>
            </div>
        )
    }

    if (!data) return null;

    const chartData = data.byMonth.map((item: any) => ({
        name: item.month,
        amount: item.amount
    }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Earnings Report</h1>
                <p className="text-muted-foreground">
                    Detailed breakdown of your commission performance
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{data.thisMonth.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{data.lastMonth.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.thisMonth > data.lastMonth
                                ? `+${Math.round(((data.thisMonth - data.lastMonth) / (data.lastMonth || 1)) * 100)}% growth`
                                : `${Math.round(((data.thisMonth - data.lastMonth) / (data.lastMonth || 1)) * 100)}% change`}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lifetime Total</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{data.lifetime.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                    <CardDescription>Earnings over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    const [year, month] = value.split('-');
                                    const date = new Date(parseInt(year), parseInt(month) - 1);
                                    return date.toLocaleDateString('en-US', { month: 'short' });
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
                                formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Earnings']}
                                cursor={{ fill: 'transparent' }}
                                labelFormatter={(value) => {
                                    const [year, month] = value.split('-');
                                    const date = new Date(parseInt(year), parseInt(month) - 1);
                                    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                                }}
                            />
                            <Bar dataKey="amount" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Details by Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.byMonth.slice().reverse().map((item: any) => (
                                <div key={item.month} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            {new Date(item.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <span className="font-bold">₦{item.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
