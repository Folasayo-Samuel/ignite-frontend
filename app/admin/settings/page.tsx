"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminCore } from "@/apis/admin-core"
import { useAdminSession } from "@/lib/admin-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, ShieldAlert } from "lucide-react"

export default function AdminSettingsPage() {
  const router = useRouter()
  const { isSuperAdmin, isLoading: isSessionLoading } = useAdminSession()

  const { getSettings, updateSettings } = useAdminCore()
  const { data: settings, isLoading: isSettingsLoading } = getSettings()

  const [formData, setFormData] = useState({
    platformFeeKobo: 500000,
    minWithdrawalKobo: 500000,
    referralWindowDays: 30,
    commissionClearDays: 7,
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        platformFeeKobo: settings.platformFeeKobo,
        minWithdrawalKobo: settings.minWithdrawalKobo,
        referralWindowDays: settings.referralWindowDays,
        commissionClearDays: settings.commissionClearDays,
      })
    }
  }, [settings])

  useEffect(() => {
    if (!isSessionLoading && !isSuperAdmin) {
      router.replace("/admin/dashboard")
    }
  }, [isSuperAdmin, isSessionLoading, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm("Are you sure you want to update global platform settings? This will immediately affect all new transactions.")) return
    
    try {
      await updateSettings.mutateAsync(formData)
      alert("Settings updated successfully.")
    } catch (e) {
      const err = e as { response?: { data?: { message: string } }, message: string };
      alert("Error: " + (err.response?.data?.message || err.message))
    }
  }

  if (isSessionLoading || !isSuperAdmin || isSettingsLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Settings</h1>
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-gray-500">Super Admin configuration for platform parameters.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Parameters</CardTitle>
          <CardDescription>Changes made here affect the entire platform and are logged.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <Label htmlFor="platformFee">Platform Base Fee (₦)</Label>
                <div className="text-xs text-gray-500 mb-1">Stored as kobo: {formData.platformFeeKobo}</div>
                <Input
                  id="platformFee"
                  type="number"
                  min="0"
                  value={formData.platformFeeKobo / 100}
                  onChange={(e) => setFormData({ ...formData, platformFeeKobo: parseInt(e.target.value) * 100 })}
                  className="max-w-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minWithdrawal">Minimum Withdrawal (₦)</Label>
                <div className="text-xs text-gray-500 mb-1">Stored as kobo: {formData.minWithdrawalKobo}</div>
                <Input
                  id="minWithdrawal"
                  type="number"
                  min="0"
                  value={formData.minWithdrawalKobo / 100}
                  onChange={(e) => setFormData({ ...formData, minWithdrawalKobo: parseInt(e.target.value) * 100 })}
                  className="max-w-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralWindow">Referral Window (Days)</Label>
                <div className="text-xs text-gray-500 mb-1">Cookie lifespan for affiliate tracking</div>
                <Input
                  id="referralWindow"
                  type="number"
                  min="1"
                  value={formData.referralWindowDays}
                  onChange={(e) => setFormData({ ...formData, referralWindowDays: parseInt(e.target.value) })}
                  className="max-w-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionClear">Commission Clear Window (Days)</Label>
                <div className="text-xs text-gray-500 mb-1">Wait time before partner commissions can be withdrawn</div>
                <Input
                  id="commissionClear"
                  type="number"
                  min="0"
                  value={formData.commissionClearDays}
                  onChange={(e) => setFormData({ ...formData, commissionClearDays: parseInt(e.target.value) })}
                  className="max-w-xs"
                />
              </div>

            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button type="submit" disabled={updateSettings.isPending} className="bg-orange-500 hover:bg-orange-600 text-white">
                {updateSettings.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
