"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    TrendingUp,
    Users,
    Wallet,
    Share2,
    CheckCircle2,
    ArrowRight,
    Calculator,
    StarIcon,
    Shield,
    Zap
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/authStore"

export default function GrowthPartnerLandingPage() {
    const { currentUser } = useAuthStore()
    const [referrals, setReferrals] = useState(5)
    const [isNigeria, setIsNigeria] = useState(true)
    const subscriptionPrice = isNigeria ? 5000 : 5
    const commissionRate = 0.20

    useEffect(() => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
            setIsNigeria(tz === 'Africa/Lagos')
        } catch {
            setIsNigeria(false)
        }
    }, [])

    const monthlyEarnings = Math.floor(referrals * subscriptionPrice * commissionRate)
    const yearlyEarnings = monthlyEarnings * 12
    const currency = isNigeria ? "₦" : "$"

    const steps = [
        {
            step: 1,
            title: "Join the Program",
            description: "Register as a growth partner in seconds. No fees, no commitments.",
            icon: <CheckCircle2 className="h-6 w-6" />,
        },
        {
            step: 2,
            title: "Share Your Link",
            description: "Get your unique partnership link and share it with your network.",
            icon: <Share2 className="h-6 w-6" />,
        },
        {
            step: 3,
            title: "Earn Commissions",
            description: "Earn 20% commission for the first month, then 10% for the 2nd and 3rd months of every subscription.",
            icon: <Wallet className="h-6 w-6" />,
        },
    ]

    const benefits = [
        {
            title: "Tiered Commission",
            description: "Earn 20% in the first month, plus 10% each for months 2 and 3 when your referrals stay subscribed.",
            icon: <TrendingUp className="h-8 w-8" />,
        },
        {
            title: "Professional Growth",
            description: "Join a community of partners who are passionate about education and technology.",
            icon: <StarIcon className="h-8 w-8" />,
        },
        {
            title: "Transparent Earnings",
            description: "Real-time dashboard showing your referrals, conversions, and earnings.",
            icon: <Shield className="h-8 w-8" />,
        },
        {
            title: "Fast Payouts",
            description: "Withdraw your earnings directly to your bank account with just a few clicks.",
            icon: <Zap className="h-8 w-8" />,
        },
    ]

    const faqs = [
        {
            question: "How much can I earn?",
            answer: `You earn 20% commission on the first month's subscription, and 10% for the second and third months. For a ${currency}${subscriptionPrice.toLocaleString()} subscription, you earn ${currency}${Math.floor(subscriptionPrice * 0.2).toLocaleString()} in Month 1, plus ${currency}${Math.floor(subscriptionPrice * 0.1).toLocaleString()} in Months 2 & 3.`,
        },
        {
            question: "When do I get paid?",
            answer: "You can request a withdrawal anytime your balance exceeds the minimum threshold. Payouts are processed directly to your bank account.",
        },
        {
            question: "Is there a limit to how much I can earn?",
            answer: "No! There's no cap on your earnings. The more learners you refer, the more you earn.",
        },
        {
            question: "How long does my referral link remain active?",
            answer: "When someone clicks your link, they're attributed to you for 30 days. If they subscribe within that period, you earn the commission.",
        },
        {
            question: "Can I be both a learner and a partner?",
            answer: "Absolutely! Many of our best partners are also learners who love the platform and want to share it with others.",
        },
        {
            question: "Who can become a Growth Partner?",
            answer: "Anyone! Whether you're a student, working professional, content creator, mentor, or just someone passionate about tech education — you can join. There are no prerequisites or fees.",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 sm:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <Users className="h-4 w-4" />
                            Growth Partnership Program
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                            Grow With Us, <span className="text-primary">Earn Together</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
                            Join our Growth Partnership Program and earn 20% commission for every learner
                            you help embark on their tech journey. Build meaningful income while contributing
                            to education.
                        </p>

                        <p className="text-md font-medium text-primary mb-8">
                            🎉 Anyone can join — learners, mentors, or tech enthusiasts. No experience required!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="rounded-full text-lg px-8" asChild>
                                <Link href={currentUser ? "/growth-partner/onboard" : "/auth/signup?intent=growth-partner"}>
                                    Start Your Partnership Journey
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full text-lg px-8" asChild>
                                <Link href="#calculator">
                                    Calculate Your Earnings
                                    <Calculator className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 sm:py-24 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Becoming a growth partner is simple. Follow these three steps to start earning.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {steps.map((step, index) => (
                            <div key={step.step} className="relative">
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
                                )}
                                <Card className="relative bg-background border-2 hover:border-primary/50 transition-colors">
                                    <CardHeader className="text-center">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
                                            {step.icon}
                                        </div>
                                        <CardTitle className="text-xl">Step {step.step}</CardTitle>
                                        <CardDescription className="text-base font-medium text-foreground">
                                            {step.title}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Earnings Calculator */}
            <section id="calculator" className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Earnings Calculator</h2>
                            <p className="text-lg text-muted-foreground">
                                See how much you could earn based on your referrals
                            </p>
                        </div>

                        <Card className="border-2 border-primary/20">
                            <CardContent className="p-8">
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <Label htmlFor="referrals" className="text-lg font-medium">
                                            Monthly Referrals Who Subscribe
                                        </Label>
                                        <div className="mt-4 space-y-4">
                                            <Input
                                                id="referrals"
                                                type="range"
                                                min="1"
                                                max="50"
                                                value={referrals}
                                                onChange={(e) => setReferrals(Number(e.target.value))}
                                                className="cursor-pointer"
                                            />
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>1</span>
                                                <span className="text-2xl font-bold text-primary">{referrals}</span>
                                                <span>50</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-2">Calculation (Month 1):</p>
                                            <p className="font-mono text-sm">
                                                {referrals} referrals × {currency}{subscriptionPrice.toLocaleString()} × 20% = {currency}{monthlyEarnings.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                + 10% for next 2 months per active user
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-6 bg-primary/10 rounded-xl text-center">
                                            <p className="text-sm text-muted-foreground mb-1">Monthly Earnings</p>
                                            <p className="text-4xl font-bold text-primary">
                                                {currency}{monthlyEarnings.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="p-6 bg-orange-50 dark:bg-orange-950/30 rounded-xl text-center">
                                            <p className="text-sm text-muted-foreground mb-1">Yearly Potential</p>
                                            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                                {currency}{yearlyEarnings.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center">
                                            *Based on tiered commission: 20% (Month 1) + 10% (Months 2 & 3) per learner
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 sm:py-24 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Why Partner With Us?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            This isn't just a referral program—it's a genuine partnership where we grow together.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {benefits.map((benefit) => (
                            <Card key={benefit.title} className="bg-background hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <Card key={index} className="bg-background">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                                        <p className="text-muted-foreground">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Ready to Start Earning?
                    </h2>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                        Join hundreds of growth partners who are building meaningful income
                        while helping others learn tech skills.
                    </p>
                    <Button size="lg" variant="secondary" className="rounded-full text-lg px-8" asChild>
                        <Link href={currentUser ? "/growth-partner/onboard" : "/auth/signup?intent=growth-partner"}>
                            Become a Growth Partner
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    )
}
