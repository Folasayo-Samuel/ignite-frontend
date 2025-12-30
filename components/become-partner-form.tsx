"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Target, Globe, ArrowRight, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { useOrganizations } from "@/api/organizations"
import { useAuth } from "@/api/auth"
import Link from "next/link"

export function BecomePartnerForm() {
    const router = useRouter()
    const { currentUser } = useAuthStore()
    const { createOrganization } = useOrganizations()
    const { mutateAsync: saveOrg, isPending: isSaving } = createOrganization

    const { getAllCountries } = useAuth()
    const { data: countriesRes } = getAllCountries()
    const countries = countriesRes || []

    const [formData, setFormData] = useState({
        organizationName: "",
        contactName: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: "",
        country: "NG", // Default to Nigeria or empty
        orgType: "",
        interest: "",
        goals: "",
    })

    // Pre-fill form when user info is available
    useEffect(() => {
        if (currentUser) {
            // If already a partner, skip the application form and go to dashboard
            if (currentUser.role === 'partner') {
                router.replace("/partner/dashboard")
                return
            }

            setFormData(prev => ({
                ...prev,
                contactName: currentUser.name || prev.contactName,
                email: currentUser.email || prev.email,
            }))
        }
    }, [currentUser, router])

    const isFormValid =
        formData.organizationName.trim() !== "" &&
        formData.contactName.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.orgType !== "" &&
        formData.interest !== "" &&
        formData.goals.trim() !== ""

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!currentUser) {
            toast.error("Please sign in to continue with your partnership inquiry")
            router.push("/auth/signup?role=partner")
            return
        }

        if (!isFormValid) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            // Map frontend type to backend enum
            const backendType: "training_program" | "company" =
                formData.orgType === "tech-school" || formData.orgType === "university"
                    ? "training_program"
                    : "company";

            // Create organization based on inquiry data
            await saveOrg({
                name: formData.organizationName,
                description: `${formData.interest}. Goals: ${formData.goals}`,
                type: backendType,
                country: formData.country,
                contactEmail: formData.email,
                planTier: "launch",
            })

            toast.success("Partnership application submitted! Our team will reach out shortly.")

            // Role-aware redirect
            if (currentUser?.role === 'mentor') {
                router.push("/mentor/dashboard")
            } else if (currentUser?.role === 'partner') {
                router.push("/partner/dashboard")
            } else {
                router.push("/learner/dashboard")
            }
        } catch (error: any) {
            toast.error(error?.message || "Failed to submit inquiry")
        }
    }

    // GUEST LANDING UI
    if (!currentUser) {
        return (
            <div className="space-y-12 animate-in fade-in duration-700">
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-2 border-accent/10 hover:border-accent/30 transition-colors">
                        <CardHeader>
                            <Target className="h-10 w-10 text-accent mb-2" />
                            <CardTitle className="text-xl">Access Top Talent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Connect with highly motivated learners who have proven their skills through consistent daily growth.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-accent/10 hover:border-accent/30 transition-colors">
                        <CardHeader>
                            <Building2 className="h-10 w-10 text-accent mb-2" />
                            <CardTitle className="text-xl">Brand Visibility</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Showcase your organization to a pan-African community of emerging tech talent and industry leaders.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-accent/10 hover:border-accent/30 transition-colors">
                        <CardHeader>
                            <Globe className="h-10 w-10 text-accent mb-2" />
                            <CardTitle className="text-xl">Ecosystem Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Help build a sustainable tech ecosystem by sponsoring cohorts and mentoring the next generation.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-accent/5 border-none">
                    <CardContent className="py-10 text-center space-y-6">
                        <div className="max-w-md mx-auto space-y-2">
                            <h2 className="text-2xl font-bold font-heading">Ready to partner with us?</h2>
                            <p className="text-muted-foreground">
                                Create a partner account to start your journey. It only takes a few minutes to get started.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="px-10 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                                <Link href="/auth/signup?role=partner">Get Started as Partner</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="px-10" asChild>
                                <Link href="/auth/login?role=partner&redirect=/home/become-partner">Log in to Partner Dashboard</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Trusted by tech schools and organizations across 19+ African countries.
                    </p>
                </div>
            </div>
        )
    }

    // LOGGED IN FORM UI
    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {currentUser?.role !== 'partner' && (
                <Card className="border-accent/20 bg-accent/5">
                    <CardContent className="py-4 flex gap-3 items-center">
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-accent" />
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold">Applying as an Organization</p>
                            <p className="text-muted-foreground">
                                You are currently logged in as a <span className="capitalize font-medium">{currentUser?.role}</span>.
                                This application will link an organization to your existing account.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="border-2 border-accent/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-accent" />
                        Partnership Application
                    </CardTitle>
                    <CardDescription>Tell us about your organization and partnership goals</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="organizationName">Organization Name *</Label>
                                <Input
                                    id="organizationName"
                                    placeholder="e.g., Global Tech Academy"
                                    required
                                    value={formData.organizationName}
                                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactName">Contact Name *</Label>
                                <Input
                                    id="contactName"
                                    required
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Work Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="+234..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Select
                                    value={formData.country}
                                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                                >
                                    <SelectTrigger id="country">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((c: any) => (
                                            <SelectItem key={c.code || c.id} value={c.code || c.id}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="orgType">Organization Type *</Label>
                                <Select
                                    value={formData.orgType}
                                    onValueChange={(value) => setFormData({ ...formData, orgType: value })}
                                >
                                    <SelectTrigger id="orgType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tech-school">Tech School / Bootcamp</SelectItem>
                                        <SelectItem value="university">University</SelectItem>
                                        <SelectItem value="company">Tech Company</SelectItem>
                                        <SelectItem value="non-profit">Non-Profit / NGO</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interest">Primary Interest *</Label>
                            <Select
                                value={formData.interest}
                                onValueChange={(value) => setFormData({ ...formData, interest: value })}
                            >
                                <SelectTrigger id="interest">
                                    <SelectValue placeholder="What are you interested in?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="talent">Accessing student talent</SelectItem>
                                    <SelectItem value="sponsorship">Sponsoring learning cohorts</SelectItem>
                                    <SelectItem value="custom-tracks">Creating custom learning tracks</SelectItem>
                                    <SelectItem value="visibility">Brand visibility</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="goals">Partnership Goals & Scale *</Label>
                            <Textarea
                                id="goals"
                                required
                                placeholder="Tell us about what you want to achieve through this partnership..."
                                rows={4}
                                value={formData.goals}
                                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={!isFormValid || isSaving}>
                            {isSaving ? "Submitting..." : (
                                <>
                                    Submit Application
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
