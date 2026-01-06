"use client"

import { OrganizationPricing } from "@/components/organization-pricing";
import { PartnerBenefitsHero } from "@/components/partner-benefits-hero";
import { PartnerBenefitsGrid } from "@/components/partner-benefits-grid";
import { PartnerStats } from "@/components/partner-stats";
import { BecomePartnerForm } from "@/components/become-partner-form";

export default function PartnersPage() {
  return (
    <main>
      <PartnerBenefitsHero />
      <PartnerBenefitsGrid />
      <OrganizationPricing />
      <PartnerStats />
      {/* <div id="partner-inquiry" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <BecomePartnerForm />
          </div>
        </div>
      </div> */}
    </main>
  );
}
