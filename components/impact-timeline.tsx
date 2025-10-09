import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const milestones = [
  {
    date: "January 2025",
    title: "5,000 Learners Milestone",
    description: "Reached 5,000 active learners across 15 African countries",
  },
  {
    date: "December 2024",
    title: "50 Partner Organizations",
    description: "Welcomed our 50th partner organization to the platform",
  },
  {
    date: "October 2024",
    title: "10,000 Projects Completed",
    description: "Students collectively completed over 10,000 learning projects",
  },
  {
    date: "August 2024",
    title: "Expanded to 15 Countries",
    description: "Platform now available in 15 African countries",
  },
  {
    date: "June 2024",
    title: "Platform Launch",
    description: "FolaIgnite officially launched with first cohort of 500 learners",
  },
]

export function ImpactTimeline() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Growth Timeline</CardTitle>
        <CardDescription>Key milestones in our journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative pl-8 pb-6 last:pb-0">
              {/* Timeline line */}
              {index < milestones.length - 1 && <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-border" />}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-primary border-4 border-background" />

              <div>
                <p className="text-sm font-medium text-accent mb-1">{milestone.date}</p>
                <p className="font-semibold text-foreground mb-1">{milestone.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
