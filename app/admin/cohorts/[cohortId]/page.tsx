"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { useAdminCore, AdminEnrollmentRecord } from "@/apis/admin-core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ArrowLeft } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function AdminCohortDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const cohortId = params.cohortId as string

  const { getCohortEnrollments } = useAdminCore()
  const { data: enrollments, isLoading } = getCohortEnrollments(cohortId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Cohorts
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cohort Enrollments</h1>
        <p className="text-gray-500">View all learners enrolled in this specific cohort.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learner Roster</CardTitle>
          <CardDescription>All students who have joined this cohort.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!enrollments || enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">No enrollments found for this cohort.</TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enrollment: AdminEnrollmentRecord) => (
                    <TableRow key={enrollment._id}>
                      <TableCell className="font-medium">
                        {enrollment.studentId?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {enrollment.studentId?.email || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          enrollment.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                          enrollment.paymentStatus === "failed" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {enrollment.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency((enrollment.subscriptionAmount || 0) / 100, enrollment.subscriptionCurrency || "NGN")}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          enrollment.status === "active" ? "bg-blue-100 text-blue-700" :
                          enrollment.status === "completed" ? "bg-green-100 text-green-700" :
                          enrollment.status === "canceled" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {enrollment.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
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
