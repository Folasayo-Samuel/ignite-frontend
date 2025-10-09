"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Amara Okafor",
    role: "Full-Stack Developer",
    country: "Nigeria",
    image: "/african-woman-developer.jpg",
    content:
      "The 30-day challenge transformed my coding skills. I went from beginner to building my first full-stack app!",
    rating: 5,
  },
  {
    name: "Kwame Mensah",
    role: "Frontend Engineer",
    country: "Ghana",
    image: "/african-man-developer.jpg",
    content: "Daily accountability and the supportive community kept me motivated. Best learning experience ever.",
    rating: 5,
  },
  {
    name: "Zara Hassan",
    role: "UI/UX Designer",
    country: "Kenya",
    image: "/african-woman-designer.jpg",
    content: "I built 3 projects in 30 days and landed my dream job. FolaIgnite changed my life!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Hear from learners who transformed their careers through daily commitment
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="mb-6 text-foreground leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
