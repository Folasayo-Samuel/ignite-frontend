import { PartnerBenefitsHero } from "@/components/partner-benefits-hero";
import { PartnerBenefitsGrid } from "@/components/partner-benefits-grid";
import { PartnerStats } from "@/components/partner-stats";
import { PartnerInquiryForm } from "@/components/partner-inquiry-form";

export default function PartnersPage() {
  return (
    <main>
      <PartnerBenefitsHero />
      <PartnerBenefitsGrid />
      <PartnerStats />
      <PartnerInquiryForm />
    </main>
  );
}
