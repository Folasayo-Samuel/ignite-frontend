"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminCore, AdminAuditLogRecord } from "@/apis/admin-core"
import { useAdminSession } from "@/lib/admin-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react"

export default function AdminAuditLogPage() {
  const router = useRouter()
  const { isSuperAdmin, isLoading: isSessionLoading } = useAdminSession()

  const [page, setPage] = useState(1)
  const [actionFilter, setActionFilter] = useState("")

  const { getAuditLogs } = useAdminCore()
  
  // Only fetch if super admin
  const { data, isLoading: isLogsLoading } = getAuditLogs(page, { actionType: actionFilter || undefined })

  useEffect(() => {
    if (!isSessionLoading && !isSuperAdmin) {
      router.replace("/admin/dashboard")
    }
  }, [isSuperAdmin, isSessionLoading, router])

  if (isSessionLoading || !isSuperAdmin) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
  }

  const logs = data?.data || []
  const meta = data?.meta || { totalPages: 1 }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Audit Logs</h1>
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-gray-500">Super Admin system log of all critical actions.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Immutable record of platform changes.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Action Type:</span>
            <select
              className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="auth">Auth / Security</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isLogsLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Admin User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target Resource</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!logs || logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">No logs found.</TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log: AdminAuditLogRecord) => (
                      <TableRow key={log._id}>
                        <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleDateString()}<br/>
                          <span className="text-xs">{new Date(log.createdAt).toLocaleTimeString()}</span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{log.userId?.name || "System"}</div>
                          <div className="text-xs text-gray-500">{log.userId?.email || log.userEmail}</div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                            log.actionType === "delete" ? "bg-red-100 text-red-700" :
                            log.actionType === "update" ? "bg-blue-100 text-blue-700" :
                            log.actionType === "create" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell className="capitalize text-sm text-gray-700">
                          {log.resourceType.replace("_", " ")}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                          {log.description || "No description provided"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 border-t pt-4">
                <p className="text-sm text-gray-500">Page {page} of {meta.totalPages}</p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
