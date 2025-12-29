"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Users, Info, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useCohorts } from "@/api/cohorts"

const formSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    techTrack: z.string().min(1, "Please select a track"),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
})

export function CreatePeerCohortModal() {
    const [open, setOpen] = useState(false)
    const { createPeerCohort } = useCohorts()
    const { mutate: createGroup, isPending } = createPeerCohort

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            techTrack: "",
            startDate: new Date().toISOString().split('T')[0], // Today
        },
    })

    const techTrack = watch("techTrack");

    function onSubmit(values: z.infer<typeof formSchema>) {
        createGroup(values as any, {
            onSuccess: () => {
                toast.success("Study Group Created Successfully!")
                setOpen(false)
                reset()
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || "Failed to create group")
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Create Study Group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create a Study Group</DialogTitle>
                    <DialogDescription>
                        Lead a peer cohort. You can only create one group every 30 days.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted p-4 rounded-md border border-primary/20 flex gap-3 items-start">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="font-medium text-sm">Rate Limit Policy</h4>
                        <div className="text-sm text-muted-foreground">
                            To ensure high-quality groups, you are limited to creating 1 group per month.
                            Your group will be public and other learners can join.
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Group Name</Label>
                        <Input id="name" placeholder="e.g. React Deep Dive Jan 2025" {...register("name")} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Topic / Track</Label>
                        <Select onValueChange={(val) => setValue("techTrack", val)} defaultValue={techTrack}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a track" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="frontend">Frontend Development</SelectItem>
                                <SelectItem value="backend">Backend Development</SelectItem>
                                <SelectItem value="fullstack">Fullstack Development</SelectItem>
                                <SelectItem value="mobile">Mobile Development</SelectItem>
                                <SelectItem value="devops">DevOps</SelectItem>
                                <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                                <SelectItem value="product">Product Management</SelectItem>
                                <SelectItem value="ux-ui">UI/UX Design</SelectItem>
                                <SelectItem value="data">Data Science</SelectItem>
                                <SelectItem value="qa">Quality Assurance</SelectItem>
                                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                                <SelectItem value="cloud">Cloud Computing</SelectItem>
                                <SelectItem value="no-code">No-Code / Low-Code</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.techTrack && <p className="text-sm text-destructive">{errors.techTrack.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                            id="startDate"
                            type="date"
                            {...register("startDate")}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <p className="text-xs text-muted-foreground">Groups run for 30 days from the start date.</p>
                        {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="What will you focus on? e.g. Building a portfolio project together."
                            className="resize-none"
                            {...register("description")}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? "Creating..." : "Create Group"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
