"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Search,
    FileText,
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    User,
    Building,
    BookOpen,
    CreditCard,
    Settings
} from "lucide-react"
import { useAuditLogs, AuditLog, AuditLogFilters } from "@/api/audit-logs"
import { format } from "date-fns"

const entityTypeIcons: Record<string, React.ReactNode> = {
    user: <User className="h-4 w-4" />,
    organization: <Building className="h-4 w-4" />,
    cohort: <BookOpen className="h-4 w-4" />,
    subscription: <CreditCard className="h-4 w-4" />,
    default: <Settings className="h-4 w-4" />,
}

const actionColors: Record<string, string> = {
    create: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    update: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    delete: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    login: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    logout: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
}

interface AuditLogsTableProps {
    entityType?: string
    entityId?: string
    userId?: string
    title?: string
    description?: string
}

export function AuditLogsTable({
    entityType: initialEntityType,
    entityId: initialEntityId,
    userId: initialUserId,
    title = "Audit Logs",
    description = "Track all system activities and changes"
}: AuditLogsTableProps) {
    const [filters, setFilters] = useState<AuditLogFilters>({
        entityType: initialEntityType,
        entityId: initialEntityId,
        userId: initialUserId,
        page: 1,
        limit: 20,
    })
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

    const { getAuditLogs } = useAuditLogs()
    const { data: result, isLoading } = getAuditLogs(filters)
    const logs = (result as any)?.data || []
    const pagination = (result as any)?.pagination

    const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === "all" ? undefined : value,
            page: 1, // Reset to first page on filter change
        }))
    }

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }))
    }

    const filteredLogs = logs.filter((log: AuditLog) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            log.action?.toLowerCase().includes(query) ||
            log.entityType?.toLowerCase().includes(query) ||
            log.userName?.toLowerCase().includes(query) ||
            log.userEmail?.toLowerCase().includes(query)
        )
    })

    const getActionColor = (action: string) => {
        const key = action?.toLowerCase() || "default"
        return actionColors[key] || actionColors.default
    }

    const getEntityIcon = (type: string) => {
        return entityTypeIcons[type?.toLowerCase()] || entityTypeIcons.default
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                        <Skeleton className="h-64 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {title}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Filters Row */}
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search actions, entities, users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Entity Type Filter */}
                            <Select
                                value={filters.entityType || "all"}
                                onValueChange={(value) => handleFilterChange("entityType", value)}
                            >
                                <SelectTrigger className="w-full md:w-40">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Entity type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="organization">Organization</SelectItem>
                                    <SelectItem value="cohort">Cohort</SelectItem>
                                    <SelectItem value="subscription">Subscription</SelectItem>
                                    <SelectItem value="session">Session</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Action Filter */}
                            <Select
                                value={filters.action || "all"}
                                onValueChange={(value) => handleFilterChange("action", value)}
                            >
                                <SelectTrigger className="w-full md:w-36">
                                    <SelectValue placeholder="Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Actions</SelectItem>
                                    <SelectItem value="create">Create</SelectItem>
                                    <SelectItem value="update">Update</SelectItem>
                                    <SelectItem value="delete">Delete</SelectItem>
                                    <SelectItem value="login">Login</SelectItem>
                                    <SelectItem value="logout">Logout</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Table */}
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="whitespace-nowrap py-4">Timestamp</TableHead>
                                        <TableHead className="whitespace-nowrap">Action</TableHead>
                                        <TableHead className="whitespace-nowrap">Entity</TableHead>
                                        <TableHead className="whitespace-nowrap">User Context</TableHead>
                                        <TableHead className="text-right whitespace-nowrap">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLogs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center">
                                                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                                <p className="text-muted-foreground">No audit logs found</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredLogs.map((log: AuditLog) => (
                                            <TableRow key={log._id} className="group">
                                                <TableCell className="font-mono text-xs">
                                                    {log.createdAt
                                                        ? format(new Date(log.createdAt), "MMM d, HH:mm:ss")
                                                        : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getActionColor(log.action)}>
                                                        {log.action}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getEntityIcon(log.entityType)}
                                                        <span className="capitalize">{log.entityType}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px]">
                                                        <p className="font-medium text-sm truncate">
                                                            {log.userName || "System"}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {log.userEmail || "-"}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setSelectedLog(log)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page <= 1}
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page >= pagination.totalPages}
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedLog && getEntityIcon(selectedLog.entityType)}
                            Audit Log Details
                        </DialogTitle>
                        <DialogDescription>
                            {selectedLog?.action} on {selectedLog?.entityType}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <ScrollArea className="max-h-[60vh]">
                            <div className="space-y-4 pr-4">
                                {/* Meta Info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Action</p>
                                        <Badge className={getActionColor(selectedLog.action)}>
                                            {selectedLog.action}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Timestamp</p>
                                        <p className="font-medium">
                                            {selectedLog.createdAt
                                                ? format(new Date(selectedLog.createdAt), "PPpp")
                                                : "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">User</p>
                                        <p className="font-medium">{selectedLog.userName || "System"}</p>
                                        <p className="text-xs text-muted-foreground">{selectedLog.userEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Entity ID</p>
                                        <p className="font-mono text-xs break-all">{selectedLog.entityId}</p>
                                    </div>
                                </div>

                                {/* IP & User Agent */}
                                {(selectedLog.ipAddress || selectedLog.userAgent) && (
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-muted-foreground mb-2">Request Info</p>
                                        <div className="text-xs space-y-1 bg-muted p-3 rounded-md">
                                            {selectedLog.ipAddress && (
                                                <p><span className="text-muted-foreground">IP:</span> {selectedLog.ipAddress}</p>
                                            )}
                                            {selectedLog.userAgent && (
                                                <p className="truncate"><span className="text-muted-foreground">UA:</span> {selectedLog.userAgent}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* State Changes */}
                                {(selectedLog.previousState || selectedLog.newState) && (
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-muted-foreground mb-2">State Changes</p>
                                        <div className="grid gap-2">
                                            {selectedLog.previousState && (
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Previous State:</p>
                                                    <pre className="text-xs bg-red-50 dark:bg-red-950 p-3 rounded-md overflow-x-auto">
                                                        {JSON.stringify(selectedLog.previousState, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                            {selectedLog.newState && (
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">New State:</p>
                                                    <pre className="text-xs bg-green-50 dark:bg-green-950 p-3 rounded-md overflow-x-auto">
                                                        {JSON.stringify(selectedLog.newState, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Additional Details */}
                                {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-muted-foreground mb-2">Additional Details</p>
                                        <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                                            {JSON.stringify(selectedLog.details, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
