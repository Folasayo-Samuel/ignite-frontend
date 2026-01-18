"use client"

import { useState, useEffect } from "react"
import { getTransactions } from "@/lib/services/growth-partner"
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
import { toast } from "sonner"
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react"

export default function TransactionsPage() {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState<any[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [typeFilter, setTypeFilter] = useState("all")

    useEffect(() => {
        fetchTransactions()
    }, [page, typeFilter])

    async function fetchTransactions() {
        setLoading(true)
        try {
            const params: any = { page, limit: 15 }
            if (typeFilter !== 'all') params.type = typeFilter

            const result = await getTransactions(params)
            setTransactions(result.data)
            setTotal(result.total)
        } catch (err) {
            toast.error("Failed to load transactions")
        } finally {
            setLoading(false)
        }
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

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Transactions" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="earned">Commissions Earned</SelectItem>
                        <SelectItem value="withdrawn">Withdrawals</SelectItem>
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
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
                                            {txn.type === 'earned' ? (
                                                <div className="p-1 rounded-full bg-green-100 text-green-600">
                                                    <ArrowDownLeft className="h-4 w-4" />
                                                </div>
                                            ) : (
                                                <div className="p-1 rounded-full bg-red-100 text-red-600">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </div>
                                            )}
                                            <span className="capitalize font-medium">{txn.type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{txn.description}</TableCell>
                                    <TableCell>{getStatusBadge(txn.status)}</TableCell>
                                    <TableCell className={`text-right font-bold ${txn.type === 'earned' ? 'text-green-600' : 'text-zinc-900 dark:text-zinc-100'
                                        }`}>
                                        {txn.type === 'earned' ? '+' : '-'}
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
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={transactions.length < 15}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
