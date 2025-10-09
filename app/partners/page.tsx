import { Navigation } from "@/components/navigation"
import { PartnerBenefitsHero } from "@/components/partner-benefits-hero"
import { PartnerBenefitsGrid } from "@/components/partner-benefits-grid"
import { PartnerStats } from "@/components/partner-stats"
import { PartnerInquiryForm } from "@/components/partner-inquiry-form"
import { Footer } from "@/components/footer"

export default function PartnersPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <PartnerBenefitsHero />
        <PartnerBenefitsGrid />
        <PartnerStats />
        <PartnerInquiryForm />
      </main>
      <Footer />
    </div>
  )
}
