"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAdminFinancials, RevenueStat, WithdrawalRecord, CommissionRecord, TransactionRecord } from "@/apis/admin-financials"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Download, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function AdminFinancialsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get("tab") || "revenue"

  const setTab = (tab: string) => {
    router.push(`/admin/financials?tab=${tab}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financials</h1>
          <p className="text-gray-500">Manage revenue, payouts, and partner commissions.</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {["revenue", "payouts", "commissions", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors
                ${
                  activeTab === tab
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab === "payouts" ? "Pending Payouts" : tab.replace("-", " ")}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "revenue" && <RevenueTab />}
        {activeTab === "payouts" && <PayoutsTab />}
        {activeTab === "commissions" && <CommissionsTab />}
        {activeTab === "transactions" && <TransactionsTab />}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  TAB 1: REVENUE                                                    */
/* ------------------------------------------------------------------ */
function RevenueTab() {
  const { getRevenueStats, exportCsv } = useAdminFinancials()
  const { data: stats, isLoading } = getRevenueStats()

  if (isLoading) return <LoadingSpinner />

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Month-by-Month Revenue</CardTitle>
          <CardDescription>Platform gross and net revenue over the last 12 months.</CardDescription>
        </div>
        <Button onClick={() => exportCsv("revenue")} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Enrollments</TableHead>
              <TableHead className="text-right">Gross Revenue</TableHead>
              <TableHead className="text-right">Platform Revenue</TableHead>
              <TableHead className="text-right">Mentor Payouts</TableHead>
              <TableHead className="text-right font-bold">Net Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!stats || stats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No revenue data found.
                </TableCell>
              </TableRow>
            ) : (
              stats.map((row: RevenueStat, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell className="text-right">{row.enrollments}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.grossRevenue / 100, "NGN")}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.platformRevenue / 100, "NGN")}</TableCell>
                  <TableCell className="text-right text-gray-400">{formatCurrency(row.mentorPayouts / 100, "NGN")}</TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    {formatCurrency(row.netRevenue / 100, "NGN")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  TAB 2: PAYOUTS (Withdrawals)                                      */
/* ------------------------------------------------------------------ */
function PayoutsTab() {
  const { getPendingWithdrawals, approveWithdrawal, rejectWithdrawal } = useAdminFinancials()
  const { data: payouts, isLoading } = getPendingWithdrawals()
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const handleApprove = async (id: string) => {
    if (!confirm("Approve this payout? This will deduct the amount from their pending balance.")) return
    try {
      await approveWithdrawal.mutateAsync(id)
      alert("Payout approved successfully!")
    } catch (e) {
      const err = e as { response?: { data?: { message: string } }, message: string };
      alert("Error: " + (err.response?.data?.message || err.message))
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectReason || rejectReason.length < 5) {
      alert("Please provide a valid reason for rejection (min 5 characters).")
      return
    }
    try {
      await rejectWithdrawal.mutateAsync({ id, reason: rejectReason })
      setRejectId(null)
      setRejectReason("")
      alert("Payout rejected.")
    } catch (e) {
      const err = e as { response?: { data?: { message: string } }, message: string };
      alert("Error: " + (err.response?.data?.message || err.message))
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Growth Partner Payouts</CardTitle>
        <CardDescription>Review and process requested withdrawals.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!payouts || payouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No pending payouts.
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((payout: WithdrawalRecord) => (
                <TableRow key={payout._id}>
                  <TableCell className="font-medium">
                    {payout.growthPartnerId?.userId?.name || "Unknown"}
                  </TableCell>
                  <TableCell>{payout.growthPartnerId?.userId?.email || "Unknown"}</TableCell>
                  <TableCell className="font-bold">
                    {payout.currency === "NGN" 
                      ? formatCurrency(payout.amount, "NGN") 
                      : `$${payout.amount.toLocaleString()}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="capitalize">{payout.withdrawalMethod?.type?.replace("_", " ")}</span>
                      {payout.withdrawalMethod?.type === "bank_transfer" && (
                        <span className="text-xs text-gray-500">
                          Account details verified via Paystack
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(payout.requestedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {rejectId === payout._id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <input
                          type="text"
                          placeholder="Reason..."
                          className="text-sm border px-2 py-1 rounded w-32"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <Button size="sm" variant="destructive" onClick={() => handleReject(payout._id)}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setRejectId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleApprove(payout._id)}
                          disabled={approveWithdrawal.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => setRejectId(payout._id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  TAB 3: COMMISSIONS                                                */
/* ------------------------------------------------------------------ */
function CommissionsTab() {
  const { getCommissions, clearEligibleCommissions } = useAdminFinancials()
  const { data: commissions, isLoading } = getCommissions()

  const handleClear = async () => {
    if (!confirm("Clear all eligible pending commissions older than 7 days?")) return
    try {
      const res = await clearEligibleCommissions.mutateAsync()
      alert(`Cleared ${res.count} commissions!`)
    } catch (e) {
      const err = e as { response?: { data?: { message: string } }, message: string };
      alert("Error: " + (err.response?.data?.message || err.message))
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Partner Commissions</CardTitle>
          <CardDescription>All commission records earned by growth partners.</CardDescription>
        </div>
        <Button onClick={handleClear} disabled={clearEligibleCommissions.isPending}>
          {clearEligibleCommissions.isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
          Clear Eligible (&gt;7 days)
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Learner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!commissions || commissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No commissions found.
                </TableCell>
              </TableRow>
            ) : (
              commissions.map((c: CommissionRecord) => (
                <TableRow key={c._id}>
                  <TableCell className="font-medium">
                    {c.growthPartnerId?.userId?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {c.commissionDetails?.learnerEmail || "N/A"}
                  </TableCell>
                  <TableCell className="capitalize">{c.type.replace("_", " ")}</TableCell>
                  <TableCell className="font-medium">
                    {c.currency === "NGN" ? formatCurrency(c.amount, "NGN") : `$${c.amount}`}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === "completed" ? "bg-green-100 text-green-700" :
                      c.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {c.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  TAB 4: ALL TRANSACTIONS                                           */
/* ------------------------------------------------------------------ */
function TransactionsTab() {
  const { getAllTransactions, exportCsv } = useAdminFinancials()
  const { data: txs, isLoading } = getAllTransactions()
  const [search, setSearch] = useState("")

  if (isLoading) return <LoadingSpinner />

  const filteredTxs = txs?.filter((tx: TransactionRecord) => 
    tx.reference?.toLowerCase().includes(search.toLowerCase()) ||
    tx.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    tx.userId?.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>All Platform Transactions</CardTitle>
          <CardDescription>Raw payment records from Paystack.</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search reference or user..."
            className="border px-3 py-1.5 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => exportCsv("transactions")} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Cohort/Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Ref</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!filteredTxs || filteredTxs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTxs.map((tx: TransactionRecord) => (
                <TableRow key={tx._id}>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(tx.createdAt).toLocaleDateString()}<br/>
                    <span className="text-xs">{new Date(tx.createdAt).toLocaleTimeString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{tx.userId?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{tx.userId?.email}</div>
                  </TableCell>
                  <TableCell>
                    {tx.metadata?.subscriptionType?.replace("_", " ")}
                    <div className="text-xs text-gray-500">{tx.metadata?.cohortId?.name}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(tx.amount / 100, tx.currency || "NGN")}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500 truncate max-w-[120px]">
                    {tx.reference}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      tx.status === "success" ? "bg-green-100 text-green-700" :
                      tx.status === "failed" ? "bg-red-100 text-red-700" :
                      tx.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {tx.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
    </div>
  )
}
