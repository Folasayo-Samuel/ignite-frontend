"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    regenerateReferralCode,
    getReferralLink
} from "@/lib/services/growth-partner"
import { useGrowthPartner } from "@/api/growth-partner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
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
    Search,
    RefreshCw,
    Copy,
    Filter,
    Loader2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"

export default function ReferralsPage() {
    const { getReferrals } = useGrowthPartner()

    // Pagination & Filter States
    const searchParams = useSearchParams()
    const urlSearch = searchParams.get("search") || ""

    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState("all")
    const [search, setSearch] = useState(urlSearch)
    const [submittedSearch, setSubmittedSearch] = useState(urlSearch)

    // Update submittedSearch if URL search changes
    useEffect(() => {
        if (urlSearch !== submittedSearch) {
            setSearch(urlSearch)
            setSubmittedSearch(urlSearch)
        }
    }, [urlSearch])

    // Data Fetching
    const { data: referralsData, isLoading, isError, refetch } = getReferrals({
        page,
        limit: 10,
        status: statusFilter,
        search: submittedSearch
    })

    const referrals = referralsData?.data || []
    const total = referralsData?.total || 0

    // Other States
    const [referralLinkData, setReferralLinkData] = useState<{ code: string; link: string } | null>(null)
    const [isRegenerating, setIsRegenerating] = useState(false)
    const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)

    // Initial load for referral link only
    useEffect(() => {
        fetchLinkData()
    }, [])

    async function fetchLinkData() {
        try {
            const data = await getReferralLink()
            setReferralLinkData({ code: data.referralCode, link: data.referralLink })
        } catch (err) {
            console.error(err)
        }
    }

    async function handleRegenerateCode() {
        setIsRegenerating(true)
        try {
            const result = await regenerateReferralCode()
            setReferralLinkData({ code: result.referralCode, link: result.referralLink })
            toast.success("Referral code regenerated successfully!")
            setShowRegenerateDialog(false)
        } catch (err: any) {
            toast.error(err.message || "Failed to regenerate code")
        } finally {
            setIsRegenerating(false)
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        setPage(1)
        setSubmittedSearch(search)
    }

    // Reset pagination when filter changes
    function handleStatusChange(value: string) {
        setStatusFilter(value)
        setPage(1)
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    function getStatusBadge(status: string) {
        switch (status) {
            case 'subscribed':
                return <Badge className="bg-green-500 hover:bg-green-600">Subscribed</Badge>
            case 'signed_up':
                return <Badge className="bg-blue-500 hover:bg-blue-600">Signed Up</Badge>
            case 'clicked':
                return <Badge variant="secondary">Clicked</Badge>
            case 'churned':
                return <Badge variant="destructive">Churned</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Referrals</h1>
                    <p className="text-muted-foreground">
                        Track and manage your referred users
                    </p>
                </div>
                <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Regenerate Code
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Regenerate Referral Code?</DialogTitle>
                            <DialogDescription>
                                This will invalidate your old referral code immediately.
                                Any links using the old code will stop working.
                                You can only do this once every 30 days.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowRegenerateDialog(false)}>Cancel</Button>
                            <Button onClick={handleRegenerateCode} disabled={isRegenerating}>
                                {isRegenerating && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Regeneration
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Code Display */}
            {referralLinkData && (
                <div className="bg-card border rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <label className="text-sm font-medium mb-1 block">Your Referral Code</label>
                        <div className="flex gap-2">
                            <code className="flex-1 bg-muted px-3 py-2 rounded text-lg font-mono font-bold">
                                {referralLinkData.code}
                            </code>
                            <Button size="icon" variant="ghost" onClick={() => copyToClipboard(referralLinkData.code)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="text-sm font-medium mb-1 block">Referral Link</label>
                        <div className="flex gap-2">
                            <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                                {referralLinkData.link}
                            </code>
                            <Button size="icon" variant="ghost" onClick={() => copyToClipboard(referralLinkData.link)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button type="submit">Search</Button>
                </form>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="clicked">Clicked</SelectItem>
                            <SelectItem value="signed_up">Signed Up</SelectItem>
                            <SelectItem value="subscribed">Subscribed</SelectItem>
                            <SelectItem value="churned">Churned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Commission</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-red-500">
                                    Failed to load referrals. <Button variant="link" onClick={() => refetch()}>Try again</Button>
                                </TableCell>
                            </TableRow>
                        ) : referrals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No referrals found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            referrals.map((referral) => (
                                <TableRow key={referral.referralId}>
                                    <TableCell>
                                        {referral.referredUserId ? (
                                            <div className="flex flex-col">
                                                <span className="font-medium">{referral.referredUserId.name}</span>
                                                <span className="text-xs text-muted-foreground hidden sm:inline-block">
                                                    {referral.referredUserId.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">Anonymous (Visitor)</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(referral.createdAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {referral.commission?.amountEarned > 0
                                            ? `₦${referral.commission.amountEarned.toLocaleString()}`
                                            : '—'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {referrals.length} of {total} results
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || isLoading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={referrals.length < 10 || isLoading} // Ideally use (page * limit) >= total
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
