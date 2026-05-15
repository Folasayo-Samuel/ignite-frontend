"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronLeft, ChevronRight, Loader2, User, Building } from "lucide-react"
import { useAdmin } from "@/apis/admin"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"

interface AdminSubscriptionListProps {
    type?: 'individual' | 'organization';
    status?: string;
}

export function AdminSubscriptionList({ type = 'individual', status }: AdminSubscriptionListProps) {
    const { getIndividualSubscriptions, getOrganizationSubscriptions } = useAdmin()
    const [page, setPage] = useState(1)
    const limit = 10

    const queryHook = type === 'individual' ? getIndividualSubscriptions : getOrganizationSubscriptions
    const { data: result, isLoading } = queryHook({ page, limit, status })

    const subscriptions = result?.data || []
    const total = result?.total || 0
    const totalPages = result?.totalPages || 1

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'default'
            case 'pending': return 'secondary'
            case 'expired': return 'destructive'
            case 'cancelled': return 'outline'
            default: return 'secondary'
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading {type} subscriptions...</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[250px]">Entity</TableHead>
                            <TableHead>{type === 'individual' ? 'Cohort' : 'Tier'}</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">
                                    No {status && status !== 'all' ? status : ''} {type} subscriptions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            subscriptions.map((sub: any) => (
                                <TableRow key={sub._id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                                                {type === 'individual' ? <User className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">{sub.userId?.name || 'Unknown User'}</div>
                                                <div className="text-[11px] text-muted-foreground">{sub.userId?.email}</div>
                                                {type === 'organization' && sub.organizationId?.name && (
                                                    <div className="text-[10px] text-orange-600 font-medium">Org: {sub.organizationId.name}</div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {type === 'individual' ? (
                                            <div>
                                                <div className="font-medium text-xs">{sub.cohortId?.name || 'N/A'}</div>
                                                <div className="text-[10px] text-muted-foreground">{sub.cohortId?.code || ''}</div>
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="capitalize text-[10px] h-5">
                                                {sub.tier || 'N/A'}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-sm">
                                            {formatCurrency((sub.amount || 0) / 100, sub.currency || 'NGN')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(sub.status) as any} className="capitalize px-1.5 py-0 h-5 text-[10px]">
                                            {sub.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-[10px] space-y-0.5 text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <span className="w-8">Start:</span>
                                                <span className="text-foreground">{sub.startDate ? format(new Date(sub.startDate), 'MMM d, yy') : '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="w-8">End:</span>
                                                <span className="text-foreground">{sub.endDate ? format(new Date(sub.endDate), 'MMM d, yy') : '-'}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel className="text-xs">Management</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs" onClick={() => navigator.clipboard.writeText(sub._id)}>
                                                    Copy ID
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs">View History</DropdownMenuItem>
                                                {sub.status === 'active' && (
                                                    <DropdownMenuItem className="text-xs text-destructive">
                                                        Terminate Access
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-xs text-muted-foreground">
                        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <div className="text-[11px] font-medium min-w-[60px] text-center">
                            Page {page} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
