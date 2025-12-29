"use client";

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CertificateGenerator } from "@/components/certificate-generator"
import { useAuthContext } from "@/components/auth/auth-provider"
import { useStudents } from "@/api/student"

export default function CertificatePage() {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const { getMyCohort } = useStudents();
  const { data: cohortResult, isLoading: isCohortLoading } = getMyCohort();
  const cohort = (cohortResult as any)?.data;

  // Assuming logic: If status is 'completed' or end date is passed, show certificate
  // For MVP validation, we can be lenient or strict. 
  // Let's assume active enrollment implies they are working towards it, 
  // but for "Congratulations" page, maybe we check if they have a certificate record or just show the current one for preview.

  // Real implementation:
  // const { getMyCertificates } = useStudents();
  // const { data: certs } = getMyCertificates();
  // const latestCert = certs?.[0];

  // Fallback for demo: Use current cohort + user details
  const studentData = {
    studentName: user?.name || "Student Name",
    cohortName: cohort?.name || "FolaIgnite Cohort",
    completionDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    techTrack: (cohort as any)?.techTrack || "Software Engineering",
  }

  if (isAuthLoading || isCohortLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground">Loading certificate...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
            <p className="text-muted-foreground">You need to be logged in to view your certificates.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Congratulations!</h1>
            <p className="text-lg text-muted-foreground">
              You've completed the 30-day learning challenge. Download your certificate and share your achievement!
            </p>
          </div>

          <CertificateGenerator {...studentData} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
