"use client"

import { useState, useEffect } from "react"
import { Loader2, CreditCard, CheckCircle2, ShieldCheck } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSubscriptions } from "@/api/subscriptions"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { getPaymentConfig } from "@/api/subscriptions"

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cohortId: string;
    planName?: string;
    amount?: number;
}

export function CheckoutModal({ isOpen, onClose, cohortId, planName = "Learner Access", amount = 1000 }: CheckoutModalProps) {
    const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);
    const { subscribeToCohort } = useSubscriptions();
    const { mutate: subscribe, isPending } = subscribeToCohort;

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await getPaymentConfig();
                if (config && config.currency) {
                    setCurrency(config.currency);
                    toast.info(`Billing currency set to ${config.currency} based on your location.`);
                }
            } catch (error) {
                console.error("Failed to fetch payment config", error);
                // Default to NGN
            } finally {
                setIsLoadingConfig(false);
            }
        };

        if (isOpen) {
            fetchConfig();
        }
    }, [isOpen]);

    // USD rate (hardcoded for UI display mainly, ideally fetched from backend)
    const displayAmount = currency === 'NGN' ? amount : 5; // $5 default for USD

    const handlePayment = () => {
        if (!cohortId) {
            toast.error("No cohort selected for subscription.");
            return;
        }

        const callbackUrl = `${window.location.origin}/learner/dashboard`;
        subscribe({ cohortId, currency, callbackUrl } as any, {
            onSuccess: (response) => {
                if (response.success && response.paymentUrl) {
                    toast.success("Redirecting to payment gateway...");
                    window.location.href = response.paymentUrl;
                } else {
                    toast.error("Failed to initialize payment. Please try again.");
                }
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Payment initialization failed");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        Secure Checkout
                    </DialogTitle>
                    <DialogDescription>
                        Complete your subscription to access the cohort.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {isLoadingConfig ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-lg">{planName}</p>
                                    <p className="text-sm text-muted-foreground w-11/12">Full access to mentorship, projects, and certification.</p>
                                </div>
                                <Badge variant="secondary">One-time</Badge>
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="text-sm font-medium">Currency</span>
                                <span className="text-sm font-bold bg-muted px-2 py-1 rounded">
                                    {currency}
                                </span>
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="font-medium">Total due</span>
                                <span className="text-2xl font-bold">
                                    {currency === 'NGN' ? '₦' : '$'}{displayAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <CreditCard className="w-3 h-3" />
                        <span>Secured by Paystack</span>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-col gap-2">
                    <Button
                        className="w-full h-11 text-base font-semibold"
                        onClick={handlePayment}
                        disabled={isPending || !cohortId || isLoadingConfig}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Pay ${currency === 'NGN' ? '₦' : '$'}${displayAmount.toLocaleString()}`
                        )}
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
