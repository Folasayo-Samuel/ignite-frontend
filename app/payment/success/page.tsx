"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useSubscriptions } from "@/api/subscriptions"
import { toast } from "sonner"

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    const { verifyPayment } = useSubscriptions()
    const { mutate: verify, isPending } = verifyPayment

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [message, setMessage] = useState("Verifying your payment...")

    useEffect(() => {
        if (!reference) {
            setStatus('error')
            setMessage("Invalid payment reference found.")
            return
        }

        verify({ reference }, {
            onSuccess: (data) => {
                if (data.success) {
                    setStatus('success')
                    setMessage("Payment successful! Your subscription is now active.")
                    toast.success("Subscription activated successfully")
                } else {
                    setStatus('error')
                    setMessage("Payment verification failed. Please contact support.")
                    toast.error("Verification failed")
                }
            },
            onError: (error: any) => {
                setStatus('error')
                setMessage(error?.response?.data?.message || "Failed to verify payment")
                toast.error("Payment verification failed")
            }
        })
    }, [reference])

    return (
        <div className="container flex items-center justify-center min-h-[60vh] py-20">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        {status === 'verifying' && (
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {status === 'verifying' && "Verifying Payment"}
                        {status === 'success' && "Payment Successful"}
                        {status === 'error' && "Verification Failed"}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground break-all">
                        Reference: {reference || 'N/A'}
                    </div>

                    <div className="pt-4">
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={() => router.push(status === 'success' ? '/partner/dashboard' : '/home/partners')}
                        >
                            {status === 'success' ? 'Go to Dashboard' : 'Return to Pricing'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
