"use client"

import { useState } from "react"
import { Plus, MoreVertical, Trash, Edit, Mail, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganizations, Member } from "@/api/organizations"
import { toast } from "sonner"
import { format } from "date-fns"

interface OrganizationUserManagementProps {
    orgId: string;
}

export function OrganizationUserManagement({ orgId }: OrganizationUserManagementProps) {
    const { getMembers, addMember, removeMember, updateMemberRole } = useOrganizations();
    const { data: membersResult, isLoading, refetch } = getMembers(orgId);

    const { mutate: inviteUser, isPending: isInviting } = addMember(orgId);
    const { mutate: removeUser, isPending: isRemoving } = removeMember(orgId, ""); // Dynamic call with real ID wrapper
    const { mutate: updateUser, isPending: isUpdating } = updateMemberRole(orgId, "");

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("viewer");

    const members = (membersResult as any)?.data as Member[] || [];

    const handleInvite = () => {
        if (!inviteEmail) return;
        inviteUser({ email: inviteEmail, role: inviteRole }, {
            onSuccess: () => {
                toast.success(`Invite sent to ${inviteEmail}`);
                setIsInviteOpen(false);
                setInviteEmail("");
                refetch();
            },
            onError: () => toast.error("Failed to send invite")
        });
    };

    const handleRemove = (userId: string) => {
        // In a real app we'd confirm first
        // Since removeMember hook needs ID at init, we use a wrapper in api/organizations or assume hook returns a mutate that accepts id?
        // Actually my definition in api/organizations was: const removeMember = (orgId, userId) => useApiMutation(...)
        // So I can't call it dynamically here easily without a sub-component or a better hook design.
        // Current api design flaw: hooks are per-resource.
        // I will create a Row component to handle per-user actions.
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage who has access to this organization</CardDescription>
                </div>
                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite Member</DialogTitle>
                            <DialogDescription>
                                Send an invitation email to add a new member.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label>Email address</label>
                                <Input
                                    placeholder="colleague@company.com"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label>Role</label>
                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                            <Button onClick={handleInvite} disabled={isInviting}>Send Invite</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No members found. Invite someone to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((member) => (
                                <MemberRow key={member.userId} member={member} orgId={orgId} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function MemberRow({ member, orgId }: { member: Member, orgId: string }) {
    const { removeMember, updateMemberRole } = useOrganizations();
    const { mutate: remove, isPending: isRemoving } = removeMember(orgId, member.userId);
    const { mutate: updateRole } = updateMemberRole(orgId, member.userId);

    const onRemove = () => {
        if (confirm("Are you sure?")) {
            remove(undefined, {
                onSuccess: () => toast.success("Member removed"),
                onError: () => toast.error("Failed to remove member")
            });
        }
    }

    const onRoleChange = (newRole: string) => {
        updateRole({ role: newRole }, {
            onSuccess: () => toast.success("Role updated"),
            onError: () => toast.error("Failed to update role")
        });
    }

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback>{member.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 gap-1">
                            <Shield className="h-3 w-3" />
                            <span className="capitalize">{member.role}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onRoleChange('admin')}>Admin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRoleChange('editor')}>Editor</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRoleChange('viewer')}>Viewer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
            <TableCell>
                {member.joinedAt ? format(new Date(member.joinedAt), "MMM d, yyyy") : "-"}
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive" onClick={onRemove}>
                            <Trash className="h-4 w-4 mr-2" />
                            Remove Member
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}
