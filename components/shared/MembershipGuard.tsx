"use client"

import React from "react"
import Link from "next/link"
import { useStudents } from "@/api/student"
import { Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MembershipGuardProps {
    children: React.ReactNode
}

export function MembershipGuard({ children }: MembershipGuardProps) {
    const { getMyCohort } = useStudents()
    const { data: cohort, isLoading } = getMyCohort()

    const hasValidCohort = cohort?.cohortId && cohort?.status !== "none"

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!hasValidCohort) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
                <div className="max-w-md space-y-6">
                    <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                        <Lock className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">Premium Feature Locked</h1>
                    <p className="text-muted-foreground text-lg">
                        Mentorship is a premium feature available exclusively to learners enrolled in an active cohort.
                    </p>
                    <div className="pt-4">
                        <Button asChild className="w-full sm:w-auto px-8">
                            <Link href="/learner/dashboard">Find a Cohort on Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
