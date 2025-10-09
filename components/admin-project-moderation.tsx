"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Eye, AlertCircle } from "lucide-react"

export function AdminProjectModeration() {
  const [projects, setProjects] = useState([
    {
      id: "1",
      title: "E-commerce Dashboard",
      author: "Amara Okafor",
      status: "Pending",
      submittedAt: "2 hours ago",
      track: "Frontend",
    },
    {
      id: "2",
      title: "Weather App",
      author: "Kwame Mensah",
      status: "Pending",
      submittedAt: "5 hours ago",
      track: "Full Stack",
    },
    {
      id: "3",
      title: "Task Manager",
      author: "Zara Ahmed",
      status: "Flagged",
      submittedAt: "1 day ago",
      track: "Backend",
    },
  ])

  const handleApprove = (id: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, status: "Approved" } : p)))
  }

  const handleReject = (id: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p)))
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
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.track}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        project.status === "Approved"
                          ? "default"
                          : project.status === "Flagged"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {project.status === "Flagged" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.submittedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {project.status === "Pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(project.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleReject(project.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
