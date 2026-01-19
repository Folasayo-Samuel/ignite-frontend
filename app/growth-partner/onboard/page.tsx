"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Copy,
    Share2,
    CreditCard,
    Loader2,
    PartyPopper,
    AlertCircle
} from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import {
    checkEligibility,
    registerAsGrowthPartner,
    updateBankDetails,
    getReferralLink
} from "@/lib/services/growth-partner"
import { toast } from "sonner"

type OnboardingStep = "eligibility" | "terms" | "generate-link" | "bank-details" | "success"

export default function GrowthPartnerOnboardingPage() {
    const router = useRouter()
    const { currentUser } = useAuthStore()

    const [currentStep, setCurrentStep] = useState<OnboardingStep>("eligibility")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Eligibility state
    const [isEligible, setIsEligible] = useState(false)
    const [isAlreadyPartner, setIsAlreadyPartner] = useState(false)

    // Terms state
    const [acceptedTerms, setAcceptedTerms] = useState(false)

    // Partner data
    const [partnerData, setPartnerData] = useState<{
        partnerId: string;
        referralCode: string;
        referralLink: string;
    } | null>(null)

    // Bank details state
    const [bankDetails, setBankDetails] = useState({
        accountNumber: "",
        bankCode: "",
        bankName: "",
    })
    const [bankDetailsLoading, setBankDetailsLoading] = useState(false)

    // Share text
    const [shareText, setShareText] = useState<{
        whatsapp: string;
        twitter: string;
    } | null>(null)

    // Hydration state to prevent redirect before store loads
    const [isHydrated, setIsHydrated] = useState(false)

    // Wait for store hydration before checking auth
    useEffect(() => {
        // Small delay to allow Zustand persist to hydrate from sessionStorage
        const timer = setTimeout(() => {
            setIsHydrated(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    // Check eligibility once hydrated
    useEffect(() => {
        if (!isHydrated) return  // Wait for hydration

        if (!currentUser) {
            router.push("/auth/login?redirect=/growth-partner/onboard")
            return
        }

        checkUserEligibility()
    }, [currentUser, isHydrated])

    async function checkUserEligibility() {
        try {
            setLoading(true)
            const result = await checkEligibility()

            if (result.isAlreadyPartner) {
                setIsAlreadyPartner(true)
                setCurrentStep("eligibility")
            } else if (result.eligible) {
                setIsEligible(true)
                setCurrentStep("terms")
            } else {
                setError(result.reason || "You are not eligible at this time")
            }
        } catch (err: any) {
            setError(err.message || "Failed to check eligibility")
        } finally {
            setLoading(false)
        }
    }

    async function handleRegister() {
        if (!acceptedTerms) {
            toast.error("Please accept the terms and conditions")
            return
        }

        try {
            setLoading(true)

            // Detect location for registration
            let country = 'NG'
            let currency: 'NGN' | 'USD' = 'NGN'

            try {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
                if (tz !== 'Africa/Lagos') {
                    country = 'US' // Default to US/International
                    currency = 'USD'
                }
            } catch (e) {
                console.warn('Failed to detect timezone, defaulting to NG/NGN')
            }

            const result = await registerAsGrowthPartner(true, country, currency)

            setPartnerData({
                partnerId: result.partner.partnerId,
                referralCode: result.partner.referralCode,
                referralLink: result.partner.referralLink,
            })

            // Get share text (optional)
            try {
                const linkData = await getReferralLink()
                setShareText({
                    whatsapp: linkData.shareText.whatsapp,
                    twitter: linkData.shareText.twitter,
                })
            } catch (error) {
                console.warn("Failed to fetch share text", error)
                // Continue anyway since we have the link
            }

            setCurrentStep("generate-link")
            toast.success("Welcome to the Growth Partnership Program!")
        } catch (err: any) {
            toast.error(err.message || "Failed to register")
        } finally {
            setLoading(false)
        }
    }

    async function handleSaveBankDetails() {
        if (bankDetails.accountNumber.length !== 10) {
            toast.error("Account number must be 10 digits")
            return
        }

        if (!bankDetails.bankCode) {
            toast.error("Please select a bank")
            return
        }

        try {
            setBankDetailsLoading(true)
            await updateBankDetails({
                accountNumber: bankDetails.accountNumber,
                bankCode: bankDetails.bankCode,
                bankName: bankDetails.bankName,
            })

            setCurrentStep("success")
            toast.success("Bank details saved successfully!")
        } catch (err: any) {
            toast.error(err.message || "Failed to save bank details")
        } finally {
            setBankDetailsLoading(false)
        }
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard!")
    }

    function shareOnWhatsApp() {
        const text = shareText?.whatsapp || partnerData?.referralLink
        window.open(`https://wa.me/?text=${encodeURIComponent(text || "")}`, "_blank")
    }

    function shareOnTwitter() {
        const text = shareText?.twitter || partnerData?.referralLink
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text || "")}`, "_blank")
    }

    // Nigerian banks list (simplified)
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

    if (loading && currentStep === "eligibility") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Checking eligibility...</p>
                </div>
            </div>
        )
    }

    if (isAlreadyPartner) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
                        <h2 className="text-2xl font-bold mb-2">You're Already a Partner!</h2>
                        <p className="text-muted-foreground mb-6">
                            You're already registered as a growth partner. Head to your dashboard to see your earnings.
                        </p>
                        <Button asChild className="w-full">
                            <Link href="/growth-partner/dashboard">Go to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
                        <h2 className="text-2xl font-bold mb-2">Unable to Continue</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/home/growth-partner">Back to Growth Partner</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Progress indicator */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        {["terms", "generate-link", "bank-details", "success"].map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${["terms", "generate-link", "bank-details", "success"].indexOf(currentStep) >= index
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {["terms", "generate-link", "bank-details", "success"].indexOf(currentStep) > index ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                {index < 3 && (
                                    <div
                                        className={`w-16 sm:w-24 h-1 mx-2 ${["terms", "generate-link", "bank-details", "success"].indexOf(currentStep) > index
                                            ? "bg-primary"
                                            : "bg-muted"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Terms</span>
                        <span>Your Link</span>
                        <span>Bank</span>
                        <span>Done</span>
                    </div>
                </div>

                {/* Step: Terms */}
                {currentStep === "terms" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Partnership Agreement</CardTitle>
                            <CardDescription>
                                Please review and accept our partnership terms to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-muted rounded-lg max-h-64 overflow-y-auto text-sm">
                                <h4 className="font-semibold mb-2">Growth Partnership Terms</h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li>• You will earn 20% commission on all subscription payments from users you refer.</li>
                                    <li>• Referrals are tracked for 30 days after a user clicks your link.</li>
                                    <li>• Minimum withdrawal amount is ₦5,000.</li>
                                    <li>• Commissions are credited to your account after successful payment verification.</li>
                                    <li>• You agree not to use misleading or spam tactics to recruit referrals.</li>
                                    <li>• FolaIgnite reserves the right to suspend accounts for policy violations.</li>
                                    <li>• Self-referrals are not permitted and will result in account suspension.</li>
                                    <li>• You must provide accurate bank details for withdrawals.</li>
                                </ul>
                            </div>

                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={acceptedTerms}
                                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I have read and agree to the Growth Partnership Terms and Conditions
                                </label>
                            </div>

                            <Button
                                onClick={handleRegister}
                                disabled={!acceptedTerms || loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Step: Generate Link */}
                {currentStep === "generate-link" && partnerData && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Your Partnership Link is Ready!</CardTitle>
                            <CardDescription>
                                Share this link with your network to start earning
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-muted rounded-lg">
                                <Label className="text-sm text-muted-foreground mb-2 block">Your Referral Code</Label>
                                <div className="flex items-center gap-2">
                                    <code className="text-2xl font-bold text-primary flex-1">
                                        {partnerData.referralCode}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(partnerData.referralCode)}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 bg-muted rounded-lg">
                                <Label className="text-sm text-muted-foreground mb-2 block">Your Partnership Link</Label>
                                <div className="flex items-center gap-2">
                                    <code className="text-sm bg-background px-3 py-2 rounded flex-1 overflow-x-auto">
                                        {partnerData.referralLink}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(partnerData.referralLink)}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm text-muted-foreground mb-3 block">Share Your Link</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" onClick={shareOnWhatsApp} className="w-full">
                                        <Share2 className="mr-2 h-4 w-4" />
                                        WhatsApp
                                    </Button>
                                    <Button variant="outline" onClick={shareOnTwitter} className="w-full">
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Twitter
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep("bank-details")}
                                    className="flex-1"
                                >
                                    Add Bank Details Later
                                </Button>
                                <Button
                                    onClick={() => setCurrentStep("bank-details")}
                                    className="flex-1"
                                >
                                    Add Bank Details
                                    <CreditCard className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step: Bank Details */}
                {currentStep === "bank-details" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Add Bank Details</CardTitle>
                            <CardDescription>
                                This is where we'll send your earnings when you request a withdrawal
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="bank">Bank</Label>
                                    <select
                                        id="bank"
                                        className="w-full mt-2 p-3 border rounded-lg bg-background"
                                        value={bankDetails.bankCode}
                                        onChange={(e) => {
                                            const bank = nigerianBanks.find(b => b.code === e.target.value)
                                            setBankDetails({
                                                ...bankDetails,
                                                bankCode: e.target.value,
                                                bankName: bank?.name || "",
                                            })
                                        }}
                                    >
                                        <option value="">Select your bank</option>
                                        {nigerianBanks.map((bank) => (
                                            <option key={bank.code} value={bank.code}>
                                                {bank.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="accountNumber">Account Number</Label>
                                    <Input
                                        id="accountNumber"
                                        type="text"
                                        placeholder="Enter 10-digit account number"
                                        maxLength={10}
                                        value={bankDetails.accountNumber}
                                        onChange={(e) => setBankDetails({
                                            ...bankDetails,
                                            accountNumber: e.target.value.replace(/\D/g, ""),
                                        })}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                                <p>
                                    Your bank details are securely encrypted. We'll verify your account
                                    before processing any withdrawals.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep("success")}
                                    className="flex-1"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Skip for Now
                                </Button>
                                <Button
                                    onClick={handleSaveBankDetails}
                                    disabled={bankDetailsLoading}
                                    className="flex-1"
                                >
                                    {bankDetailsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            Save & Continue
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step: Success */}
                {currentStep === "success" && (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
                                <PartyPopper className="h-10 w-10 text-green-600" />
                            </div>

                            <h2 className="text-2xl font-bold mb-2">
                                Welcome to the Partnership!
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                You're all set! Start sharing your link and watch your earnings grow.
                            </p>

                            <div className="space-y-3">
                                <Button asChild className="w-full">
                                    <Link href="/growth-partner/dashboard">
                                        Go to Your Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild className="w-full">
                                    <Link href="/home/growth-partner">
                                        Learn More About the Program
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
