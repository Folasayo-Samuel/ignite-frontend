"use client"

import { useStudents } from "@/apis/student"
import { StudentDashboardHeader } from "@/components/students/student-dashboard-header"
import { LoadingScreen } from "@/components/shared/LoadingScreen"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Flame, Calendar, Image as ImageIcon, Video, PlayCircle } from "lucide-react"
import { RoleGuard } from "@/components/shared/RoleGuard"

export default function LearnerLogsPage() {
  return (
    <RoleGuard allowedRoles={["student"]}>
      <LearnerLogsContent />
    </RoleGuard>
  )
}

function LearnerLogsContent() {
  const { getMyProgress } = useStudents()
  const { data, isLoading } = getMyProgress()

  if (isLoading) {
    return <LoadingScreen />
  }

  const logs = data?.logs || []
  // Sort logs in descending order (most recent first)
  const sortedLogs = [...logs].sort((a, b) => b.dayNumber - a.dayNumber)

  return (
    <div>
      <StudentDashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full max-w-4xl">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Learning Timeline</h1>
          <p className="text-muted-foreground text-lg">
            A complete history of your daily logs and progress in the 30-day challenge.
          </p>
        </div>

        {sortedLogs.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No logs found yet</h3>
              <p className="text-muted-foreground">
                Return to the dashboard to submit your very first daily learning log.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {sortedLogs.map((log: any) => (
              <div key={log._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-orange-100 dark:bg-orange-900/50 text-orange-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Flame className="h-4 w-4" />
                </div>
                
                {/* Card */}
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-3 bg-muted/20 border-b">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Badge variant="outline" className="mb-2 bg-background">Day {log.dayNumber}</Badge>
                        <CardTitle className="text-base text-muted-foreground">
                          {format(new Date(log.createdAt), "MMMM d, yyyy")}
                        </CardTitle>
                      </div>
                      {!log.isPublic && (
                        <Badge variant="secondary" className="text-xs">Private</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">What I learned</h4>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{log.summary}</p>
                    </div>

                    {log.whatIBuilt && (
                      <div className="pt-3 border-t">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">What I built</h4>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{log.whatIBuilt}</p>
                      </div>
                    )}

                    {(log.mediaUrls?.length > 0 || log.videoUrls?.length > 0) && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t">
                        {log.mediaUrls?.map((url: string, i: number) => (
                          <div key={i} className="h-16 w-16 relative rounded overflow-hidden border">
                            <img src={url} alt={`Media ${i}`} className="object-cover w-full h-full" />
                          </div>
                        ))}
                        {log.videoUrls?.map((url: string, i: number) => (
                          <a key={i} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs bg-muted px-2 py-1 h-16 rounded border hover:bg-muted/80">
                            <PlayCircle className="h-4 w-4 text-blue-500" />
                            <span>Video</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
