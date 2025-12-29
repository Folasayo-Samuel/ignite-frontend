"use client"

import { useState, useEffect } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { OrganizationUserManagement } from "@/components/organization-user-management"
import { OrganizationSubscriptionManagement } from "@/components/payment/organization-subscription-management"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useOrganizations, Organization } from "@/api/organizations"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface OrganizationSettingsProps {
    orgId: string;
}

export function OrganizationSettings({ orgId }: OrganizationSettingsProps) {
    const { getOrganization, updateOrganization } = useOrganizations();
    const { data: orgResult, isLoading } = getOrganization(orgId);
    const { mutate: update, isPending: isUpdating } = updateOrganization(orgId);

    const org = (orgResult as any)?.data as Organization;

    const [formData, setFormData] = useState<Partial<Organization>>({});

    useEffect(() => {
        if (org) {
            setFormData({
                name: org.name,
                description: org.description,
                industry: org.industry,
                website: org.website,
                billingEmail: org.billingEmail
            });
        }
    }, [org]);

    const handleChange = (field: keyof Organization, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        update(formData, {
            onSuccess: () => toast.success("Organization settings updated"),
            onError: () => toast.error("Failed to update settings")
        });
    };

    if (isLoading) {
        return (
            <Card className="border-2">
                <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                <CardContent><Skeleton className="h-64 w-full" /></CardContent>
            </Card>
        )
    }

    if (!org) return <div>Organization not found</div>;

    return (
        <div className="space-y-6">
            <Card className="border-2">
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Update your organization's public profile and details.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Organization Name</Label>
                            <Input
                                id="name"
                                value={formData.name || ''}
                                onChange={e => handleChange('name', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={e => handleChange('description', e.target.value)}
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    value={formData.industry || ''}
                                    onChange={e => handleChange('industry', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={formData.website || ''}
                                    onChange={e => handleChange('website', e.target.value)}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="billing">Billing Email</Label>
                            <Input
                                id="billing"
                                type="email"
                                value={formData.billingEmail || ''}
                                onChange={e => handleChange('billingEmail', e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={isUpdating} className="ml-auto gap-2">
                            <Save className="h-4 w-4" />
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Plan Section could go here if needed */}
            <Card className="border-2 bg-muted/20">
                <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>You are currently on the {org.plan} plan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">To upgrade or change your plan, please contact sales.</p>
                </CardContent>
            </Card>
        </div>
    )
}
