"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Eye, AlertCircle, RefreshCw } from "lucide-react"
import { useAdmin } from "@/apis/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

export function AdminProjectModeration() {
  const { getProjects } = useAdmin()
  const { data: projectsResponse, isLoading, refetch } = getProjects()

  const projects = Array.isArray(projectsResponse) ? projectsResponse : []
  const handleApprove = (id: string) => {
    toast.info("Approval function coming soon!")
    // TODO: Wire up actual approval mutation
  }

  const handleReject = (id: string) => {
    toast.info("Rejection function coming soon!")
    // TODO: Wire up actual rejection mutation
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Moderation</CardTitle>
        <CardDescription>Review and approve submitted projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Loading projects...
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No projects found.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project: any) => (
                  <TableRow key={project._id}>
                    <TableCell className="font-medium">{project.title || "Untitled Project"}</TableCell>
                    <TableCell>{project.studentId?.name || "Unknown Student"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.track || "N/A"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "Approved" || project.status === "approved"
                            ? "default"
                            : project.status === "Flagged" || project.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {(project.status === "Flagged" || project.status === "rejected") && <AlertCircle className="mr-1 h-3 w-3" />}
                        {project.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {project.createdAt ? formatDistanceToNow(new Date(project.createdAt), { addSuffix: true }) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(project.status === "Pending" || project.status === "pending") && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApprove(project._id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleReject(project._id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
