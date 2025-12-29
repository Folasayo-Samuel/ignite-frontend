import { OrganizationPricing } from "@/components/organization-pricing";
import { PartnerBenefitsHero } from "@/components/partner-benefits-hero";
import { PartnerBenefitsGrid } from "@/components/partner-benefits-grid";
import { PartnerStats } from "@/components/partner-stats";
import { PartnerInquiryForm } from "@/components/partner-inquiry-form";

export default function PartnersPage() {
  return (
    <main>
      <PartnerBenefitsHero />
      <PartnerBenefitsGrid />
      <OrganizationPricing />
      <PartnerStats />
      <PartnerInquiryForm />
    </main>
  );
}
