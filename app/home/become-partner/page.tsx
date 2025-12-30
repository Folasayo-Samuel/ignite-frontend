import { BecomePartnerForm } from "@/components/become-partner-form";

export default function BecomePartnerPage() {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold font-heading text-balance">Become a Learning Partner</h1>
                    <p className="text-xl text-muted-foreground text-balance">
                        Fuel the future of tech in Africa while accessing elite talent and growing your organization.
                    </p>
                </div>
                <BecomePartnerForm />
            </div>
        </main>
    );
}
