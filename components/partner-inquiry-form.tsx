"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"

export function PartnerInquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    alert("Thank you for your interest! We'll be in touch soon.")
  }

  return (
    <section id="partner-inquiry" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Become a Partner</CardTitle>
              <CardDescription className="text-base">
                Fill out the form below and our team will reach out to discuss partnership opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization Name *</Label>
                    <Input id="organization" placeholder="Your Tech School or Company" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Contact Name *</Label>
                    <Input id="contact-name" placeholder="John Doe" required />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="contact@organization.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+234 800 000 0000" />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select required>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="ghana">Ghana</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="south-africa">South Africa</SelectItem>
                        <SelectItem value="egypt">Egypt</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization-type">Organization Type *</Label>
                    <Select required>
                      <SelectTrigger id="organization-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech-school">Tech School / Bootcamp</SelectItem>
                        <SelectItem value="university">University</SelectItem>
                        <SelectItem value="company">Tech Company</SelectItem>
                        <SelectItem value="ngo">NGO / Non-Profit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest">What are you interested in? *</Label>
                  <Select required>
                    <SelectTrigger id="interest">
                      <SelectValue placeholder="Select your primary interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="talent">Accessing student talent</SelectItem>
                      <SelectItem value="sponsorship">Sponsoring learning cohorts</SelectItem>
                      <SelectItem value="brand">Brand visibility and marketing</SelectItem>
                      <SelectItem value="custom">Creating custom learning tracks</SelectItem>
                      <SelectItem value="all">All of the above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Tell us more about your goals *</Label>
                  <Textarea
                    id="message"
                    placeholder="Share your partnership goals, expected outcomes, or any questions you have..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Inquiry
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
