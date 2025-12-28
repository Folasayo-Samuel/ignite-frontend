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
import { MoreHorizontal, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useSubscriptions } from "@/api/subscriptions"
import { format } from "date-fns"

export function AdminSubscriptionList() {
    const { getAdminAllSubscriptions } = useSubscriptions()
    const [page, setPage] = useState(1)
    const limit = 20
    const skip = (page - 1) * limit

    const { data: result, isLoading } = getAdminAllSubscriptions(undefined, limit, skip)
    const subscriptions = result?.data || []
    const total = result?.count || 0
    const totalPages = Math.ceil(total / limit)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'default' // Primary/Black usually
            case 'pending': return 'secondary'
            case 'expired': return 'destructive'
            case 'cancelled': return 'outline'
            default: return 'secondary'
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Cohort</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No subscriptions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            subscriptions.map((sub: any) => (
                                <TableRow key={sub._id}>
                                    <TableCell>
                                        <div className="font-medium">{sub.userId?.name || 'Unknown User'}</div>
                                        <div className="text-xs text-muted-foreground">{sub.userId?.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{sub.cohortId?.name}</div>
                                        <div className="text-xs text-muted-foreground">{sub.cohortId?.code}</div>
                                    </TableCell>
                                    <TableCell>
                                        {sub.currency === 'USD' ? '$' : '₦'}
                                        {(sub.amount / (sub.currency === 'USD' ? 100 : 100)).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(sub.status) as any}>
                                            {sub.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs">
                                            <div>Start: {sub.startDate ? format(new Date(sub.startDate), 'MMM d, yyyy') : '-'}</div>
                                            <div>End: {sub.endDate ? format(new Date(sub.endDate), 'MMM d, yyyy') : '-'}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(sub._id)}>
                                                    Copy ID
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
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
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages || 1}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    )
}
