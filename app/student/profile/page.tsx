"use client";
import { UserProfileCard } from "@/components/user-profile-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentProfilePage() {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:bg-transparent"
                onClick={() => router.back()}
            >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your personal information and public profile settings.
                    </p>
                </div>

                <div className="max-w-4xl">
                    <UserProfileCard />
                </div>
            </div>
        </div>
    );
}
