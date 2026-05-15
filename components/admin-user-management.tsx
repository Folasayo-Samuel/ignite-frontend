"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MoreVertical, UserCheck, UserX, Shield, RefreshCw, Users, ChevronLeft, ChevronRight, Mail } from "lucide-react"
import { useAdminCore, AdminUserRecord } from "@/apis/admin-core"
import { useAdmin } from "@/apis/admin"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type UserRole = "student" | "mentor" | "partner" | "admin"

export function AdminUserManagement() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearch, setActiveSearch] = useState("")
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null)
  const [newRole, setNewRole] = useState<UserRole>("student")
  const limit = 8

  const { getUsers, toggleUserSuspend } = useAdminCore()
  const { switchUserRole, sendAdminEmail } = useAdmin()

  const { data: usersData, isLoading, refetch } = getUsers({ search: activeSearch, page, limit })
  const users = usersData?.data || []
  const totalPages = usersData?.totalPages || 1
  const totalUsers = usersData?.total || 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveSearch(searchQuery)
    setPage(1)
  }

  const handleOpenRoleDialog = (user: AdminUserRecord) => {
    setSelectedUser(user)
    setNewRole(user.role as UserRole)
    setRoleDialogOpen(true)
  }

  const handleOpenSuspendDialog = (user: AdminUserRecord) => {
    setSelectedUser(user)
    setSuspendDialogOpen(true)
  }

  const handleRoleChange = () => {
    if (!selectedUser) return

    const { mutate } = switchUserRole(selectedUser._id)
    mutate(
      { newRole },
      {
        onSuccess: () => {
          toast.success(`Role updated to ${newRole}`)
          setRoleDialogOpen(false)
          setSelectedUser(null)
          refetch()
        },
        onError: () => toast.error("Failed to update role"),
      }
    )
  }

  const handleSuspendToggle = () => {
    if (!selectedUser) return

    const willBeSuspended = !selectedUser.isSuspended

    toggleUserSuspend.mutate(
      { id: selectedUser._id, suspended: willBeSuspended },
      {
        onSuccess: () => {
          toast.success(willBeSuspended ? "User suspended" : "User reactivated")
          setSuspendDialogOpen(false)
          setSelectedUser(null)
          refetch()
        },
        onError: () => toast.error("Action failed"),
      }
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "mentor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "partner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Directory
            </CardTitle>
            <CardDescription>View and manage platform members ({totalUsers})</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-20"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1 h-8">Search</Button>
            </form>

            <div className="rounded-md border bg-card overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">
                        {activeSearch ? `No users match "${activeSearch}"` : "No users found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user: AdminUserRecord) => (
                      <TableRow key={user._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-orange-100 text-orange-700">
                                {user.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{user.name || "Unnamed"}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`capitalize px-2 py-0 h-5 text-[10px] ${getRoleColor(user.role)}`} variant="outline">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isSuspended ? "destructive" : "outline"} className="px-2 py-0 h-5 text-[10px]">
                            {user.isSuspended ? "Suspended" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-xs"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setEmailSubject("")
                                  setEmailMessage("")
                                  setEmailDialogOpen(true)
                                }}
                              >
                                <Mail className="mr-2 h-3 w-3" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenRoleDialog(user)} className="text-xs">
                                <Shield className="mr-2 h-3 w-3" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className={user.isSuspended ? "text-green-600 text-xs" : "text-red-600 text-xs"}
                                onClick={() => handleOpenSuspendDialog(user)}
                              >
                                {user.isSuspended ? (
                                  <>
                                    <UserCheck className="mr-2 h-3 w-3" />
                                    Reactivate User
                                  </>
                                ) : (
                                  <>
                                    <UserX className="mr-2 h-3 w-3" />
                                    Suspend User
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the platform access level for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Learner</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="partner">Learning Partner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRoleChange} className="bg-orange-600 hover:bg-orange-700">Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isSuspended ? "Reactivate User" : "Suspend User"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.isSuspended
                ? `Confirm reactivation for ${selectedUser?.name}. They will regain access immediately.`
                : `Are you sure you want to suspend ${selectedUser?.name}? Access to the platform will be revoked.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
            <Button
              variant={selectedUser?.isSuspended ? "default" : "destructive"}
              onClick={handleSuspendToggle}
            >
              {selectedUser?.isSuspended ? "Reactivate Account" : "Confirm Suspension"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send a custom email to {selectedUser?.name} ({selectedUser?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                placeholder="Email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-message">Message</Label>
              <Textarea
                id="email-message"
                placeholder="Write your message here..."
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              disabled={!emailSubject.trim() || !emailMessage.trim() || sendAdminEmail.isPending}
              onClick={() => {
                if (!selectedUser) return
                sendAdminEmail.mutate(
                  { to: selectedUser.email, subject: emailSubject, message: emailMessage },
                  {
                    onSuccess: (data: any) => {
                      toast.success(`Email sent to ${selectedUser.name}`)
                      setEmailDialogOpen(false)
                    },
                    onError: () => toast.error("Failed to send email"),
                  }
                )
              }}
            >
              {sendAdminEmail.isPending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
