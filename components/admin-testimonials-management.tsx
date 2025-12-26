"use client"

import { useState } from "react"
import { useAnalytics } from "@/api/analytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Trash2, Star, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function AdminTestimonialsManagement() {
    const { getTestimonials, createTestimonial } = useAnalytics()
    const { data: response, isLoading } = getTestimonials()
    const { mutate: addTestimonial, isPending: isAdding } = createTestimonial

    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        country: "",
        content: "",
        rating: "5",
        company: "",
        image: ""
    })

    // Handle Create
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addTestimonial(
            {
                ...formData,
                rating: Number(formData.rating),
            },
            {
                onSuccess: () => {
                    toast.success("Testimonial added successfully")
                    setIsOpen(false)
                    setFormData({ name: "", role: "", country: "", content: "", rating: "5", company: "", image: "" })
                },
                onError: () => {
                    toast.error("Failed to add testimonial")
                }
            }
        )
    }

    const testimonials = response?.data || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Success Stories</h2>
                    <p className="text-muted-foreground">Manage student testimonials and success stories.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Story
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Success Story</DialogTitle>
                            <DialogDescription>
                                Share a new student success story. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rating">Rating</Label>
                                    <Select
                                        value={formData.rating}
                                        onValueChange={(v) => setFormData({ ...formData, rating: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5 Stars</SelectItem>
                                            <SelectItem value="4">4 Stars</SelectItem>
                                            <SelectItem value="3">3 Stars</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company">Company (Optional)</Label>
                                <Input
                                    id="company"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Story</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isAdding}>
                                    {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Story
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <p>Loading stories...</p>
                ) : (
                    testimonials.map((item) => (
                        <Card key={item.id}>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                <Avatar>
                                    <AvatarImage src={item.image} alt={item.name} />
                                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <CardTitle className="text-base">{item.name}</CardTitle>
                                    <span className="text-xs text-muted-foreground">{item.role}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-1 mb-2">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    "{item.content}"
                                </p>
                                <div className="mt-4 flex justify-end">
                                    {/* Add Delete button later if needed */}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
