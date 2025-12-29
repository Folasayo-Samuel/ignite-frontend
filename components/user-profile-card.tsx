"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X, MapPin, LinkIcon, Github, Linkedin, Twitter, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useStudents } from "@/api/student";

export function UserProfileCard() {
  const { getMyDetails, updateStudentProfile } = useStudents();
  const { data: userResponse, isPending } = getMyDetails();
  const { mutateAsync: updateProfile, isPending: isSaving } = updateStudentProfile;
  const userData = userResponse?.data;

  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    skills: [] as string[],
  })

  // Sync data when loaded
  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        location: userData.location || "",
        bio: userData.bio || "",
        skills: userData.skills || [],
        website: userData.socials?.website || "",
        github: userData.socials?.github || "",
        linkedin: userData.socials?.linkedin || "",
        twitter: userData.socials?.twitter || "",
      });
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      await updateProfile({
        name: profile.name,
        location: profile.location,
        bio: profile.bio,
        skills: profile.skills,
        socials: {
          website: profile.website,
          github: profile.github,
          linkedin: profile.linkedin,
          twitter: profile.twitter
        }
      });
      toast.success("Profile saved successfully!")
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save profile");
    }
  }

  // Handle adding a skill
  const addSkill = () => {
    const skill = prompt("Enter skill name:");
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  if (isPending) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your public profile information</CardDescription>
          </div>
          {!isEditing ? (
            <Button size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-2" disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userData?.profilePicture || "/placeholder.svg?height=96&width=96"} alt={profile.name} />
            <AvatarFallback className="text-2xl">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            ) : (
              <p className="text-foreground font-medium">{profile.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className={isEditing ? "bg-muted" : "border-none shadow-none p-0 h-auto"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            {isEditing ? (
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            ) : (
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {profile.location || "Not set"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-foreground leading-relaxed">{profile.bio || "No bio yet."}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  {isEditing && (
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeSkill(skill)}
                    />
                  )}
                </Badge>
              ))}
              {isEditing && (
                <Button variant="outline" size="sm" className="h-6 text-xs bg-transparent" onClick={addSkill}>
                  + Add Skill
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Label>Social Links</Label>
            <div className="space-y-2">
              {isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Website"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="GitHub username"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="LinkedIn username"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Twitter handle"
                      value={profile.twitter}
                      onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {profile.twitter && (
                    <a
                      href={`https://twitter.com/${profile.twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </a>
                  )}
                  {!profile.website && !profile.github && !profile.linkedin && !profile.twitter && (
                    <p className="text-sm text-muted-foreground">No social links added.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
