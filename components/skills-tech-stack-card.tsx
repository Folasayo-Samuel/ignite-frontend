import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const skills = [
  { name: "React", count: 156, category: "Frontend" },
  { name: "Node.js", count: 134, category: "Backend" },
  { name: "TypeScript", count: 128, category: "Language" },
  { name: "Python", count: 98, category: "Language" },
  { name: "Next.js", count: 87, category: "Framework" },
  { name: "Tailwind CSS", count: 145, category: "Styling" },
  { name: "PostgreSQL", count: 76, category: "Database" },
  { name: "MongoDB", count: 65, category: "Database" },
  { name: "Docker", count: 54, category: "DevOps" },
  { name: "AWS", count: 43, category: "Cloud" },
]

export function SkillsTechStackCard() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Skills & Tech Stack</CardTitle>
        <CardDescription>Technologies learned by your cohorts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
              {skill.name}
              <span className="ml-2 text-xs text-muted-foreground">({skill.count})</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
