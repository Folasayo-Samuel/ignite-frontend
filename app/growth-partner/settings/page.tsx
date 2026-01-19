"use client"

import { useState, useEffect } from "react"
import {
    updateBankDetails,
    getDashboard
} from "@/lib/services/growth-partner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [bankDetails, setBankDetails] = useState({
        accountNumber: "",
        bankCode: "",
        bankName: "",
        isVerified: false
    })

    // Nigerian banks list
    const nigerianBanks = [
        { code: "044", name: "Access Bank" },
        { code: "023", name: "Citibank Nigeria" },
        { code: "050", name: "Ecobank Nigeria" },
        { code: "070", name: "Fidelity Bank" },
        { code: "011", name: "First Bank of Nigeria" },
        { code: "214", name: "First City Monument Bank" },
        { code: "058", name: "Guaranty Trust Bank" },
        { code: "030", name: "Heritage Bank" },
        { code: "301", name: "Jaiz Bank" },
        { code: "082", name: "Keystone Bank" },
        { code: "526", name: "Parallex Bank" },
        { code: "076", name: "Polaris Bank" },
        { code: "101", name: "Providus Bank" },
        { code: "221", name: "Stanbic IBTC Bank" },
        { code: "068", name: "Standard Chartered Bank" },
        { code: "232", name: "Sterling Bank" },
        { code: "100", name: "Suntrust Bank" },
        { code: "032", name: "Union Bank of Nigeria" },
        { code: "033", name: "United Bank for Africa" },
        { code: "215", name: "Unity Bank" },
        { code: "035", name: "Wema Bank" },
        { code: "057", name: "Zenith Bank" },
        { code: "999992", name: "OPay" },
        { code: "999991", name: "PalmPay" },
        { code: "999993", name: "Moniepoint" },
        { code: "999994", name: "Kuda Bank" },
    ]

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const dashboard = await getDashboard()
            if (dashboard.partner.bankDetails?.NGN) {
                const ngnDetails = dashboard.partner.bankDetails.NGN;
                setBankDetails({
                    accountNumber: ngnDetails.accountNumber?.replace(/\*/g, 'X') || "", // Show masked or placeholder
                    bankCode: ngnDetails.bankCode || "",
                    bankName: ngnDetails.bankName || "",
                    isVerified: ngnDetails.isVerified || false
                })
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSave() {
        if (bankDetails.accountNumber.replace(/X/g, '').length !== 10 && !bankDetails.accountNumber.includes('X')) {
            toast.error("Account number must be 10 digits")
            return
        }

        if (!bankDetails.bankCode) {
            toast.error("Please select a bank")
            return
        }

        setSaving(true)
        try {
            // If the account number contains 'X', it means user didn't change it (it's the masked one)
            // But here we enforce re-entering the full number if they want to update it.
            // So if it has 'X', we might block or ask for full number.
            // For UX: If user edits, 'X's are gone. If user submits with 'X', we assume no change? 
            // Actually API expects full number. So user MUST re-enter full number to update.
            if (bankDetails.accountNumber.includes('X')) {
                toast.error("Please re-enter your full account number to update details")
                setSaving(false)
                return
            }

            await updateBankDetails({
                accountNumber: bankDetails.accountNumber,
                bankCode: bankDetails.bankCode,
                bankName: bankDetails.bankName
            })
            toast.success("Bank details updated successfully")
            setBankDetails(prev => ({ ...prev, isVerified: true })) // Optimistic update
        } catch (err: any) {
            toast.error(err.message || "Failed to update bank details")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account preferences and banking information
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bank Account Details</CardTitle>
                    <CardDescription>
                        Where should we send your earnings? Please ensure these details are correct.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="bank">Bank Name</Label>
                        <select
                            id="bank"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={bankDetails.bankCode}
                            onChange={(e) => {
                                const bank = nigerianBanks.find(b => b.code === e.target.value)
                                setBankDetails({
                                    ...bankDetails,
                                    bankCode: e.target.value,
                                    bankName: bank?.name || "",
                                })
                            }}
                            disabled={loading}
                        >
                            <option value="">Select your bank</option>
                            {nigerianBanks.map((bank) => (
                                <option key={bank.code} value={bank.code}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="account">Account Number</Label>
                        <Input
                            id="account"
                            placeholder="0123456789"
                            value={bankDetails.accountNumber}
                            onChange={(e) => setBankDetails({
                                ...bankDetails,
                                accountNumber: e.target.value.replace(/\D/g, "")
                            })}
                            maxLength={10}
                            disabled={loading}
                        />
                        {bankDetails.isVerified && (
                            <p className="text-sm text-green-600 flex items-center mt-1">
                                <ShieldCheck className="h-4 w-4 mr-1" />
                                Verified Account
                            </p>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button onClick={handleSave} disabled={saving || loading}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                        Manage how we contact you about your earnings and referrals.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        Email notifications for new referrals and commissions are enabled by default.
                        <br />
                        (More settings coming soon)
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
