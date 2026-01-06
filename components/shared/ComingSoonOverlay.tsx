"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Construction, Sparkles } from "lucide-react"

export function ComingSoonOverlay({
    title = "Coming Soon",
    description = "We are crafting a world-class experience for our partners. This dashboard is currently under active development."
}: {
    title?: string,
    description?: string
}) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <Card className="max-w-md w-full border-2 border-primary/20 shadow-2xl p-8 text-center space-y-4 animate-in fade-in zoom-in duration-300 bg-background/95">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Construction className="h-6 w-6 text-primary" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                            <Sparkles className="h-3 w-3 mr-1" /> Beta
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="pt-4 flex justify-center gap-2 text-xs text-muted-foreground">
                    <span>Module in progress</span>
                    <span>•</span>
                    <span>Releasing soon</span>
                </div>
            </Card>
        </div>
    )
}
