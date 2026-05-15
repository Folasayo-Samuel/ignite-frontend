"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminResourcesManagement } from "@/components/admin-resources-management"
import { AdminEventsManagement } from "@/components/admin-events-management"
import { AdminTestimonialsManagement } from "@/components/admin-testimonials-management"

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">Manage learning resources, events, and success stories</p>
      </div>

      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources">
          <AdminResourcesManagement />
        </TabsContent>
        
        <TabsContent value="events">
          <AdminEventsManagement />
        </TabsContent>
        
        <TabsContent value="testimonials">
          <AdminTestimonialsManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
