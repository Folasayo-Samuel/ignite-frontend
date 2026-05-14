"use client"

import { useState } from "react"
import { useAdmins, useCreateAdmin, useToggleAdminStatus } from "@/apis/admin-team"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Shield, ShieldAlert, Mail, UserPlus, CheckCircle2, XCircle, MoreHorizontal, Copy } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { toast } from "sonner"

export default function AdminTeamPage() {
  const { data: admins, isLoading } = useAdmins()
  const { mutate: createAdmin, isPending: isCreating } = useCreateAdmin()
  const { mutate: toggleStatus, isPending: isToggling } = useToggleAdminStatus()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    createAdmin(formData, {
      onSuccess: () => {
        setIsDialogOpen(false)
        setFormData({ name: "", email: "", role: "admin" })
      }
    })
  }

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    if (confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this admin?`)) {
      toggleStatus({ id, isActive: !currentStatus })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Team Management</h1>
          <p className="text-gray-500">Manage internal administrators and platform access.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Administrator</DialogTitle>
              <DialogDescription>
                Create a new admin account. They will receive an email with their temporary password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, role: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Standard Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Super Admins have full access including team management. Standard admins cannot manage the team.
                </p>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Admin"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active Team Members</CardTitle>
          <CardDescription>All administrators with access to the FolaIgnite admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Loading team members...
                    </TableCell>
                  </TableRow>
                ) : admins?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No administrators found.
                    </TableCell>
                  </TableRow>
                ) : (
                  admins?.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-medium">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{admin.name}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Mail className="mr-1 h-3 w-3" />
                              {admin.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={admin.role === 'super_admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-100' : 'bg-blue-100 text-blue-700 hover:bg-blue-100'}
                        >
                          {admin.role === 'super_admin' ? (
                            <><ShieldAlert className="mr-1 h-3 w-3" /> Super Admin</>
                          ) : (
                            <><Shield className="mr-1 h-3 w-3" /> Admin</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {admin.isActive ? (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                            <XCircle className="mr-1 h-3 w-3" /> Suspended
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {admin.lastLoginAt ? format(new Date(admin.lastLoginAt), "MMM d, yyyy HH:mm") : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => copyToClipboard(admin.email)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(admin._id, admin.isActive)}
                              className={admin.isActive ? "text-red-600 focus:text-red-600" : "text-green-600 focus:text-green-600"}
                              disabled={isToggling}
                            >
                              {admin.isActive ? (
                                <><XCircle className="mr-2 h-4 w-4" /> Deactivate Account</>
                              ) : (
                                <><CheckCircle2 className="mr-2 h-4 w-4" /> Activate Account</>
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
        </CardContent>
      </Card>
    </div>
  )
}
