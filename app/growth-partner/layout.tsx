import { GrowthPartnerSidebar } from "@/components/growth-partner/sidebar"
import { GrowthPartnerHeader } from "@/components/growth-partner/header"

export default function GrowthPartnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-900">
                <GrowthPartnerSidebar />
            </div>
            <div className="md:pl-72 flex flex-col h-full">
                <GrowthPartnerHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-900/50">
                    {children}
                </main>
            </div>
        </div>
    )
}
