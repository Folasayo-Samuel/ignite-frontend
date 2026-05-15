"use client"

import React, { useState } from "react"
import { useAdminCore, AdminUserRecord } from "@/apis/admin-core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Ban, UserCheck, Search } from "lucide-react"

export default function AdminLearnersPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [activeSearch, setActiveSearch] = useState("")
  const limit = 20

  const { getUsers, toggleUserSuspend } = useAdminCore()
  const { data: result, isLoading } = getUsers({ search: activeSearch, page, limit })
  const users = result?.data || []
  const totalPages = result?.totalPages || 1

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveSearch(searchInput)
    setPage(1)
  }

  const handleToggleSuspend = async (id: string, isCurrentlySuspended: boolean) => {
    const action = isCurrentlySuspended ? "Unban" : "Ban"
    if (!confirm(`Are you sure you want to ${action} this user?`)) return
    try {
      await toggleUserSuspend.mutateAsync({ id, suspended: !isCurrentlySuspended })
    } catch (e) {
      const err = e as { response?: { data?: { message: string } }, message: string };
      alert("Error: " + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Learners & Users</h1>
        <p className="text-gray-500">Manage all registered users on the platform.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>View, ban, or unban users.</CardDescription>
          </div>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search name or email..."
                className="pl-9 pr-4 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">Search</Button>
            {activeSearch && (
              <Button type="button" variant="ghost" onClick={() => { setSearchInput(""); setActiveSearch(""); setPage(1); }}>
                Clear
              </Button>
            )}
          </form>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Cohorts</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">No users found.</TableCell>
                    </TableRow>
                  ) : (
                    users.map((user: AdminUserRecord) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>{user.enrolledCohortsCount}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {user.isSuspended ? (
                            <span className="text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded">Banned</span>
                          ) : (
                            <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">Active</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={user.isSuspended ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-red-600 hover:text-red-700 hover:bg-red-50"}
                            onClick={() => handleToggleSuspend(user._id, user.isSuspended)}
                            disabled={toggleUserSuspend.isPending}
                          >
                            {user.isSuspended ? <><UserCheck className="h-4 w-4 mr-2" /> Unban</> : <><Ban className="h-4 w-4 mr-2" /> Ban</>}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4 border-t mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm font-medium">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
