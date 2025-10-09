import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CertificateGenerator } from "@/components/certificate-generator"

export default function CertificatePage() {
  // In a real app, this would come from user session/database
  const studentData = {
    studentName: "John Doe",
    cohortName: "Cohort 2024-Q1",
    completionDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    techTrack: "Frontend Development",
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
