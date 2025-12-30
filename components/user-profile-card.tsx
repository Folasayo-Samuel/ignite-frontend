"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X, MapPin, LinkIcon, Github, Linkedin, Twitter, Loader2, Camera, Mail, User } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useStudents } from "@/api/student";
import api from "@/hooks/axiosInstance";

// Max file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function UserProfileCard() {
  const { getMyDetails, updateStudentProfile } = useStudents();
  const { data: userResponse, isPending, refetch } = getMyDetails();
  const { mutateAsync: updateProfile, isPending: isSaving } = updateStudentProfile;
  const userData = userResponse?.data;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    avatar: "",
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
        avatar: (userData as any).avatar || "",
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
        avatar: profile.avatar,
        socials: {
          website: profile.website,
          github: profile.github,
          linkedin: profile.linkedin,
          twitter: profile.twitter
        }
      });
      toast.success("Profile saved successfully!")
      setIsEditing(false)
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save profile");
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Get signed upload URL from backend
      const signResponse = await api.post('/media/sign-upload', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        folder: 'avatars',
        resourceType: 'image',
        tags: ['avatar', 'profile']
      });

      const { uploadUrl, uploadPreset } = signResponse.data;

      // Upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await uploadResponse.json();

      if (result.secure_url) {
        setProfile(prev => ({ ...prev, avatar: result.secure_url }));

        // Auto-save the avatar
        await updateProfile({ avatar: result.secure_url });
        toast.success("Profile picture updated!");
        refetch();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle adding a skill
  const [newSkill, setNewSkill] = useState("");
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill("");
      setIsSkillModalOpen(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isPending) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border shadow-sm overflow-hidden">
        {/* Header with gradient background */}
        <div className="h-24 sm:h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-background relative" />

        <CardHeader className="relative pb-4">
          {/* Avatar positioned over the gradient */}
          <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6">
            <div className="relative group">
              <Avatar className="h-20 w-20 sm:h-28 sm:w-28 border-4 border-background shadow-lg">
                <AvatarImage
                  src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`}
                  alt={profile.name}
                />
                <AvatarFallback className="text-xl sm:text-2xl bg-primary/10 text-primary font-semibold">
                  {getInitials(profile.name || "U")}
                </AvatarFallback>
              </Avatar>

              {/* Upload overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer disabled:cursor-not-allowed"
              >
                {isUploadingImage ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Edit button */}
          <div className="flex justify-end pt-2 sm:pt-0">
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

          {/* Title section with space for avatar */}
          <div className="mt-8 sm:mt-12">
            <CardTitle className="text-xl sm:text-2xl">Profile</CardTitle>
            <CardDescription>Manage your public profile information</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-4 sm:px-6">
          {/* Basic Info Grid */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your full name"
                />
              ) : (
                <p className="text-foreground font-medium py-2">{profile.name || "Not set"}</p>
              )}
            </div>

            {/* Email - Read only */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <p className="text-foreground py-2 flex items-center gap-2">
                {profile.email || "Not available"}
                <Badge variant="secondary" className="text-xs">Verified</Badge>
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="City, Country"
                />
              ) : (
                <p className="text-muted-foreground py-2">
                  {profile.location || "Not set"}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                placeholder="Tell us about yourself..."
                className="resize-none"
              />
            ) : (
              <p className="text-foreground leading-relaxed py-2 text-sm sm:text-base">
                {profile.bio || "No bio yet. Click Edit to add one."}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Skills</Label>
            <div className="flex flex-wrap gap-2">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {skill}
                    {isEditing && (
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive ml-1"
                        onClick={() => removeSkill(skill)}
                      />
                    )}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills added yet.</p>
              )}
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => setIsSkillModalOpen(true)}
                >
                  + Add Skill
                </Button>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-sm font-medium">Social Links</Label>
            {isEditing ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="Website URL"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="GitHub username"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="LinkedIn username"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="Twitter handle"
                    value={profile.twitter}
                    onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {profile.website && (
                  <a
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors"
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
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors"
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
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors"
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
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </a>
                )}
                {!profile.website && !profile.github && !profile.linkedin && !profile.twitter && (
                  <p className="text-sm text-muted-foreground">No social links added. Click Edit to add some.</p>
                )}
              </div>
            )}
          </div>

          {/* Image upload hint */}
          <p className="text-xs text-muted-foreground text-center border-t pt-4">
            Hover over your profile picture to change it. Max file size: 2MB (JPEG, PNG, WebP, GIF)
          </p>
        </CardContent>
      </Card>

      <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Enter the name of the skill you want to add to your profile.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g. React, Python, Data Analysis"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSkillModalOpen(false)}>Cancel</Button>
            <Button onClick={addSkill} disabled={!newSkill.trim()}>Add Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
