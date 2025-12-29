"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, Server, Database, Wifi, WifiOff, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/hooks/axiosInstance"

interface HealthStatus {
    api: 'healthy' | 'degraded' | 'down' | 'checking'
    database: 'healthy' | 'degraded' | 'down' | 'checking'
    paymentGateway: 'healthy' | 'degraded' | 'down' | 'checking'
    lastChecked: Date | null
}

export function SystemHealthDashboard() {
    const [health, setHealth] = useState<HealthStatus>({
        api: 'checking',
        database: 'checking',
        paymentGateway: 'checking',
        lastChecked: null,
    })
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        checkHealth()

        // Re-check health every 60 seconds
        const interval = setInterval(checkHealth, 60000)
        return () => clearInterval(interval)
    }, [])

    const checkHealth = async () => {
        setIsChecking(true)

        // Check API health
        let apiStatus: 'healthy' | 'degraded' | 'down' = 'down'
        let dbStatus: 'healthy' | 'degraded' | 'down' = 'down'
        let paymentStatus: 'healthy' | 'degraded' | 'down' = 'degraded' // Default to degraded until checked

        try {
            const startTime = Date.now()
            const response = await api.get('/auth/countries')
            const responseTime = Date.now() - startTime

            if (response.status === 200) {
                apiStatus = responseTime < 1000 ? 'healthy' : 'degraded'
                dbStatus = 'healthy' // If API works, DB is likely working
            }
        } catch (error) {
            apiStatus = 'down'
            dbStatus = 'down'
        }

        // Check payment config (indicates Paystack connectivity)
        try {
            const paymentRes = await api.get('/payment/config')
            if (paymentRes.status === 200) {
                paymentStatus = 'healthy'
            }
        } catch (error) {
            paymentStatus = 'degraded'
        }

        setHealth({
            api: apiStatus,
            database: dbStatus,
            paymentGateway: paymentStatus,
            lastChecked: new Date(),
        })
        setIsChecking(false)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'degraded':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />
            case 'down':
                return <XCircle className="h-5 w-5 text-red-500" />
            case 'checking':
                return <Activity className="h-5 w-5 text-muted-foreground animate-pulse" />
            default:
                return <Activity className="h-5 w-5 text-muted-foreground" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'healthy':
                return <Badge className="bg-green-500 hover:bg-green-600">Healthy</Badge>
            case 'degraded':
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">Degraded</Badge>
            case 'down':
                return <Badge variant="destructive">Down</Badge>
            case 'checking':
                return <Badge variant="secondary">Checking...</Badge>
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    const services = [
        {
            name: 'API Server',
            description: 'Backend REST API',
            status: health.api,
            icon: Server,
        },
        {
            name: 'Database',
            description: 'MongoDB connection',
            status: health.database,
            icon: Database,
        },
        {
            name: 'Payment Gateway',
            description: 'Paystack integration',
            status: health.paymentGateway,
            icon: health.paymentGateway === 'healthy' ? Wifi : WifiOff,
        },
    ]

    const overallStatus =
        services.every(s => s.status === 'healthy') ? 'All Systems Operational' :
            services.some(s => s.status === 'down') ? 'System Issues Detected' :
                services.some(s => s.status === 'degraded') ? 'Performance Degradation' :
                    'Checking Status...'

    const overallColor =
        services.every(s => s.status === 'healthy') ? 'text-green-600' :
            services.some(s => s.status === 'down') ? 'text-red-600' :
                services.some(s => s.status === 'degraded') ? 'text-yellow-600' :
                    'text-muted-foreground'

    if (isChecking && health.lastChecked === null) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-16" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            System Health
                        </CardTitle>
                        <CardDescription>
                            Real-time status of platform services
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <p className={`font-semibold ${overallColor}`}>{overallStatus}</p>
                        {health.lastChecked && (
                            <p className="text-xs text-muted-foreground">
                                Last checked: {health.lastChecked.toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {services.map((service) => (
                        <div
                            key={service.name}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-muted">
                                    <service.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">{service.name}</p>
                                    <p className="text-sm text-muted-foreground">{service.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(service.status)}
                                {getStatusBadge(service.status)}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={checkHealth}
                    disabled={isChecking}
                    className="mt-4 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                    {isChecking ? 'Checking...' : 'Refresh Status'}
                </button>
            </CardContent>
        </Card>
    )
}
