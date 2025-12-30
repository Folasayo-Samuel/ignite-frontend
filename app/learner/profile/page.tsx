"use client";
import { UserProfileCard } from "@/components/user-profile-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/shared/RoleGuard";

export default function StudentProfilePage() {
    const router = useRouter();

    return (
        <RoleGuard allowedRoles={["student"]}>
            <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Back button */}
                    <Button
                        variant="ghost"
                        className="mb-4 sm:mb-6 pl-0 hover:bg-transparent hover:text-primary transition-colors"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to Dashboard
                    </Button>

                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Profile</h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-2">
                            Manage your personal information and public profile settings.
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="max-w-3xl">
                        <UserProfileCard />
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
