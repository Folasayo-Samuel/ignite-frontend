"use client"

import { useParams, useRouter } from "next/navigation"
import { useAdmin } from "@/apis/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Link as LinkIcon, ArrowLeft, RefreshCw, Trash2, Edit } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminEventDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  // Note: Assuming a getEvent(id) hook exists or will be added to useAdmin
  const { getEvents } = useAdmin()
  const { data: eventsData, isLoading, refetch } = getEvents()
  
  const event = Array.isArray(eventsData) 
    ? eventsData.find((e: any) => e._id === id) 
    : (eventsData as any)?.data?.find((e: any) => e._id === id)

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("en-US", {
      weekday: 'long',
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="text-xl font-semibold">Event not found</div>
        <p className="text-muted-foreground text-center max-w-md">
          The event you are looking for does not exist or has been removed.
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/content">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Content
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="-ml-2">
          <Link href="/admin/content">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Content
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="capitalize">
                  {event.type}
                </Badge>
                {event.isPublic ? (
                  <Badge variant="default" className="bg-green-600">Public</Badge>
                ) : (
                  <Badge variant="secondary">Private</Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <CardDescription className="mt-2 text-base">
                {event.description || "No description provided."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-sm font-medium text-foreground">Date & Time</div>
                  <div className="text-sm">{formatDate(event.startDate)}</div>
                  {event.endDate && (
                    <div className="text-xs">Until {formatDate(event.endDate)}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-sm font-medium text-foreground">Attendance</div>
                  <div className="text-sm">
                    <span className="font-bold text-foreground">{event.currentAttendees || 0}</span> registered out of <span className="font-bold text-foreground">{event.maxAttendees || "∞"}</span> slots
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-sm font-medium text-foreground">Location</div>
                  <div className="text-sm capitalize">{event.location?.type || "Virtual"}</div>
                </div>
              </div>

              {event.location?.meetingLink && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <LinkIcon className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Meeting Link</div>
                    <Link 
                      href={event.location.meetingLink} 
                      target="_blank" 
                      className="text-sm text-orange-600 hover:underline break-all"
                    >
                      {event.location.meetingLink}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" /> Registered Attendees
            </h3>
            <div className="bg-muted/30 rounded-lg p-10 text-center text-muted-foreground">
              Attendee list management coming soon.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
