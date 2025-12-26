"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Activity, BarChart3 } from "lucide-react"
import { useAnalytics, TrackData } from "@/api/analytics"

interface AnalyticsTracksCardProps {
    range?: string
}

export function AnalyticsTracksCard({ range }: AnalyticsTracksCardProps) {
    const { getTopTracks, getActiveTracks } = useAnalytics(range)
    const { data: topTracksResult, isLoading: loadingTop } = getTopTracks()
    const { data: activeTracksResult, isLoading: loadingActive } = getActiveTracks()

    const topTracks = (topTracksResult as any)?.data || []
    const activeTracks = (activeTracksResult as any)?.data || []

    const isLoading = loadingTop || loadingActive

    // Get max values for relative progress bars
    const maxUsers = Math.max(...topTracks.map((t: TrackData) => t.totalUsers || 0), 1)
    const maxActivity = Math.max(...activeTracks.map((t: TrackData) => t.activityVolume || 0), 1)

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full mb-4" />
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-2 w-full" />
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
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Tech Tracks Performance
                </CardTitle>
                <CardDescription>
                    Track engagement and activity across learning paths
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="top" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="top" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">Top Tracks</span>
                            <span className="sm:hidden">Top</span>
                        </TabsTrigger>
                        <TabsTrigger value="active" className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            <span className="hidden sm:inline">Most Active</span>
                            <span className="sm:hidden">Active</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Top Tracks by Total Users */}
                    <TabsContent value="top" className="space-y-4">
                        {topTracks.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground">No track data available</p>
                            </div>
                        ) : (
                            topTracks.map((track: TrackData, index: number) => (
                                <TrackItem
                                    key={track.trackId || index}
                                    rank={index + 1}
                                    name={track.trackName}
                                    value={track.totalUsers || 0}
                                    maxValue={maxUsers}
                                    label="learners"
                                    icon={<Users className="h-4 w-4" />}
                                />
                            ))
                        )}
                    </TabsContent>

                    {/* Most Active Tracks */}
                    <TabsContent value="active" className="space-y-4">
                        {activeTracks.length === 0 ? (
                            <div className="text-center py-8">
                                <Activity className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground">No activity data available</p>
                            </div>
                        ) : (
                            activeTracks.map((track: TrackData, index: number) => (
                                <TrackItem
                                    key={track.trackId || index}
                                    rank={index + 1}
                                    name={track.trackName}
                                    value={track.activityVolume || 0}
                                    maxValue={maxActivity}
                                    label="activities"
                                    icon={<TrendingUp className="h-4 w-4" />}
                                />
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

interface TrackItemProps {
    rank: number
    name: string
    value: number
    maxValue: number
    label: string
    icon: React.ReactNode
}

function TrackItem({ rank, name, value, maxValue, label, icon }: TrackItemProps) {
    const percentage = (value / maxValue) * 100

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    <Badge
                        variant={rank <= 3 ? "default" : "secondary"}
                        className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                        {rank}
                    </Badge>
                    <span className="font-medium truncate">{name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                    {icon}
                    <span>{value.toLocaleString()} {label}</span>
                </div>
            </div>
            <Progress value={percentage} className="h-2" />
        </div>
    )
}
