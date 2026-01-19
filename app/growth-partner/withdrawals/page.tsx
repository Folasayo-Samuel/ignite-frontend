import { useState } from "react"
import { useGrowthPartner } from "@/api/growth-partner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Wallet,
    Clock,
    CheckCircle2,
    Loader2
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

export default function WithdrawalsPage() {
    const { getDashboard, getWithdrawals, requestWithdrawal } = useGrowthPartner()

    // Pagination
    const [page, setPage] = useState(1)

    // Data Fetching
    const { data: dashboardData, isLoading: isDashboardLoading } = getDashboard()
    const { data: withdrawalsData, isLoading: isWithdrawalsLoading, refetch: refetchWithdrawals } = getWithdrawals({
        page,
        limit: 20
    })

    const { mutateAsync: requestWithdrawalMutation, isPending: isSubmitting } = requestWithdrawal

    // Derived State
    const withdrawals = withdrawalsData?.data || []
    const total = withdrawalsData?.total || 0
    const partner = dashboardData?.partner
    const balance = partner?.metrics?.pendingEarnings || 0
    const withdrawnTotal = partner?.metrics?.withdrawnEarnings || 0
    const bankDetails = partner?.bankDetails?.NGN

    // UI States
    const [requestAmount, setRequestAmount] = useState("")
    const [showDialog, setShowDialog] = useState(false)

    const loading = isDashboardLoading || isWithdrawalsLoading

    async function handleWithdraw() {
        const amount = Number(requestAmount)

        if (!amount || amount < 5000) {
            toast.error("Minimum withdrawal amount is ₦5,000")
            return
        }

        if (amount > balance) {
            toast.error("Insufficient balance")
            return
        }

        if (!bankDetails || !bankDetails.isVerified) {
            toast.error("Please add verified bank details in Settings first")
            return
        }

        try {
            await requestWithdrawalMutation({ amount })
            toast.success("Withdrawal requested successfully!")
            setShowDialog(false)
            setRequestAmount("")
            refetchWithdrawals() // Refresh list
        } catch (err: any) {
            toast.error(err.message || "Failed to request withdrawal")
        }
    }

    function getStatusBadge(status: string) {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
            case 'processing':
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Processing</Badge>
            case 'failed':
            case 'rejected':
                return <Badge variant="destructive">Failed</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Withdrawals</h1>
                    <p className="text-muted-foreground">
                        Manage your earnings and request payouts
                    </p>
                </div>

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <Button disabled={balance < 5000}>
                            <Wallet className="mr-2 h-4 w-4" />
                            Request Payout
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request Withdrawal</DialogTitle>
                            <DialogDescription>
                                Withdraw your earnings to your verified bank account.
                                Minimum withdrawal is ₦5,000.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                    Amount
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={requestAmount}
                                        onChange={(e) => setRequestAmount(e.target.value)}
                                        placeholder="Enter amount (e.g., 5000)"
                                        className="col-span-3"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Available Balance: ₦{balance.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {bankDetails && (
                                <div className="bg-muted p-3 rounded text-sm">
                                    <p className="font-medium text-muted-foreground mb-1">Receiving Bank:</p>
                                    <p>{bankDetails.bankName}</p>
                                    <p className="font-mono">{bankDetails.accountNumber}</p>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="submit" onClick={handleWithdraw} disabled={isSubmitting}>
                                {isSubmitting && <Wallet className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Withdrawal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Available to Withdraw
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{balance.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Withdrawn
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₦{withdrawnTotal.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Processing
                        </CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {/* Note: This is only for the current page, purely cosmetic/estimation */}
                            ₦{withdrawals
                                .filter(w => w.status === 'processing' || w.status === 'pending')
                                .reduce((acc, curr) => acc + curr.amount, 0)
                                .toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Withdrawal History</CardTitle>
                    <CardDescription>
                        Recent payout requests and their status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Bank</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Processed On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : withdrawals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No withdrawal history found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                withdrawals.map((withdrawal) => (
                                    <TableRow key={withdrawal.withdrawalId}>
                                        <TableCell>
                                            {format(new Date(withdrawal.requestedAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ₦{withdrawal.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs">
                                                <span>{withdrawal.bankDetails?.bankName || bankDetails?.bankName}</span>
                                                <span className="text-muted-foreground">
                                                    {withdrawal.bankDetails?.accountNumber || bankDetails?.accountNumber}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {withdrawal.processedAt
                                                ? format(new Date(withdrawal.processedAt), 'MMM d, yyyy')
                                                : '—'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
