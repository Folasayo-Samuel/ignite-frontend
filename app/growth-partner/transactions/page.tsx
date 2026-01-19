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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { format } from "date-fns"
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react"

export default function TransactionsPage() {
    const { getTransactions } = useGrowthPartner()
    const [page, setPage] = useState(1)
    const [typeFilter, setTypeFilter] = useState("all")

    const { data: transactionsData, isLoading, isError, refetch } = getTransactions({
        page,
        limit: 15,
        type: typeFilter
    })

    const transactions = transactionsData?.data || []
    const total = transactionsData?.total || 0

    function handleTypeChange(value: string) {
        setTypeFilter(value)
        setPage(1)
    }

    function getStatusBadge(status: string) {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
            case 'processing':
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-muted-foreground">
                        History of your earnings and withdrawals
                    </p>
                </div>

                <Select value={typeFilter} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Transactions" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="commission_earned">Commissions Earned</SelectItem>
                        <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-md bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-red-500">
                                    Failed to load transactions. <Button variant="link" onClick={() => refetch()}>Try again</Button>
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((txn) => (
                                <TableRow key={txn.transactionId}>
                                    <TableCell className="text-muted-foreground">
                                        {format(new Date(txn.createdAt), 'MMM d, yyyy h:mm a')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {txn.type === 'commission_earned' ? (
                                                <div className="p-1 rounded-full bg-green-100 text-green-600">
                                                    <ArrowDownLeft className="h-4 w-4" />
                                                </div>
                                            ) : (
                                                <div className="p-1 rounded-full bg-red-100 text-red-600">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </div>
                                            )}
                                            <span className="capitalize font-medium">{txn.type.replace('_', ' ')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{txn.description}</TableCell>
                                    <TableCell>{getStatusBadge(txn.status)}</TableCell>
                                    <TableCell className={`text-right font-bold ${txn.type === 'commission_earned' ? 'text-green-600' : 'text-zinc-900 dark:text-zinc-100'
                                        }`}>
                                        {txn.type === 'commission_earned' ? '+' : '-'}
                                        ₦{txn.amount.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {transactions.length} of {total} results
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
                        disabled={transactions.length < 15 || isLoading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
