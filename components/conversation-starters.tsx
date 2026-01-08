"use client"

import { Button } from "@/components/ui/button"
import { Lightbulb, Target, HelpCircle, BookOpen, Rocket } from "lucide-react"

interface ConversationStartersProps {
  onSelect: (message: string) => void
  partnerName: string
}

const STARTER_PROMPTS = [
  {
    icon: HelpCircle,
    text: "I'm struggling with understanding this concept...",
    category: "help"
  },
  {
    icon: Target,
    text: "Can you help me set learning goals for this week?",
    category: "goals"
  },
  {
    icon: BookOpen,
    text: "What resources would you recommend for improving my skills?",
    category: "resources"
  },
  {
    icon: Rocket,
    text: "I just completed a milestone and wanted to share!",
    category: "achievement"
  },
  {
    icon: Lightbulb,
    text: "I have an idea I'd like your feedback on...",
    category: "feedback"
  }
]

export function ConversationStarters({ onSelect, partnerName }: ConversationStartersProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 text-center">
      <div className="space-y-2">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Lightbulb className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Start a conversation with {partnerName}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Not sure what to say? Here are some conversation starters to help you connect with your mentor.
        </p>
      </div>
      
      <div className="grid gap-2 w-full max-w-md">
        {STARTER_PROMPTS.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start text-left h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary/30 transition-all group"
            onClick={() => onSelect(prompt.text)}
          >
            <prompt.icon className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            <span className="text-sm">{prompt.text}</span>
          </Button>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Or type your own message below
      </p>
    </div>
  )
}
