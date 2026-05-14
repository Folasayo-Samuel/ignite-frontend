"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAdminCore, AdminCohortRecord } from "@/apis/admin-core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, AlertTriangle, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function AdminCohortsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get("status") || "ALL"

  const { getCohorts, forceCancelCohort } = useAdminCore()
  const { data: cohorts, isLoading } = getCohorts(statusFilter)

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/admin/cohorts?status=${e.target.value}`)
  }

  const handleCancel = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation() // Prevent row click
    if (!confirm(`DANGER: Are you sure you want to FORCE CANCEL cohort "${name}"? This will cancel all active enrollments. This cannot be undone.`)) return
    try {
      await forceCancelCohort.mutateAsync(id)
      alert("Cohort canceled successfully.")
    } catch (e) {
      const err = e as { response?: { data?: { message: string } }, message: string };
      alert("Error: " + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cohorts</h1>
          <p className="text-gray-500">Manage all cohorts across the platform.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Cohort Directory</CardTitle>
            <CardDescription>Click on a cohort to view enrollments.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Filter Status:</span>
            <select
              className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!cohorts || cohorts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">No cohorts found.</TableCell>
                  </TableRow>
                ) : (
                  cohorts.map((cohort: AdminCohortRecord) => (
                    <TableRow 
                      key={cohort._id} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => router.push(`/admin/cohorts/${cohort._id}`)}
                    >
                      <TableCell>
                        <div className="font-medium text-gray-900">{cohort.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{cohort.code}</div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-sm">{cohort.type}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          cohort.status === "active" ? "bg-green-100 text-green-700" :
                          cohort.status === "completed" ? "bg-blue-100 text-blue-700" :
                          cohort.status === "canceled" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {cohort.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {cohort.enrolledCount} / {cohort.maxLearners}
                      </TableCell>
                      <TableCell className="text-right text-gray-600">
                        {formatCurrency(cohort.revenue / 100, "NGN")}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(cohort.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {cohort.status !== "canceled" && cohort.status !== "completed" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => handleCancel(e, cohort._id, cohort.name)}
                              disabled={forceCancelCohort.isPending}
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" /> Force Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
