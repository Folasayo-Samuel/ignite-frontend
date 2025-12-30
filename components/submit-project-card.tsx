import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"
import Link from "next/link"

export function SubmitProjectCard() {
  return (
    <Card className="border-2 border-accent bg-gradient-to-br from-accent/5 to-accent/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-accent" />
          Ready to Showcase?
        </CardTitle>
        <CardDescription>Submit your final project to the showcase gallery</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          Once you complete the 30-day challenge, submit your best project to be featured in our public showcase. Get
          feedback from the community and potential employers!
        </p>
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
          <Link href="/learner/submit-project">Submit Final Project</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
