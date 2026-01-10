"use client";

import { useRef, useState } from "react";
import { PlusCircle, ImageIcon, Video, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ControlledInput from "../inputFields/ControlledInput";
import { CustomButton } from "../clickable/CustomButton";
import { useStudents } from "@/api/student";
import { Field } from "@/schemas/dynamicSchema";
import { useFileUpload } from "@/hooks/useFileUpload";
import CreatableSelectComponent from "../inputFields/CreatableSelect";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useDynamicForm from "@/hooks/useDynamicForm";
import { useMedia } from "@/api/media";

const fields: Field[] = [
  {
    name: "content",
    type: "text",
    errorMessage: "Content is required",
    isRequired: true,
  },
  {
    name: "tags",
    type: "multiselect",
  },
];

export function LogActivityCard() {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useDynamicForm(fields, { tags: [] });
  const [isUploading, setIsUploading] = useState(false);

  const imageUpload = useFileUpload(4);
  const videoUpload = useFileUpload(2);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const { logMyActivities, getMyCohort } = useStudents();
  const { signUpload } = useMedia();
  const { data: cohortData } = getMyCohort();
  const isEnrolled = cohortData?.cohortId && cohortData?.status !== "none";
  const { mutate: logActivity, isPending } = logMyActivities;

  // Upload a single file to Cloudinary using signed upload
  const uploadFileToCloudinary = async (file: File, resourceType: "image" | "video"): Promise<string | null> => {
    try {
      // Get signed upload params from backend
      const signResult = await new Promise<any>((resolve, reject) => {
        signUpload.mutate(
          {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            folder: "ignite/activities",
            resourceType,
          },
          {
            onSuccess: (res) => resolve(res),
            onError: (err) => reject(err),
          }
        );
      });

      const params = signResult?.params || signResult;
      const uploadUrl = signResult?.uploadUrl || `https://api.cloudinary.com/v1_1/${signResult?.cloudName}/${resourceType}/upload`;

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signResult?.apiKey);
      formData.append("signature", signResult?.signature);
      formData.append("timestamp", String(signResult?.timestamp));
      formData.append("folder", signResult?.folder || "ignite/activities");
      if (params?.allowed_formats) formData.append("allowed_formats", params.allowed_formats);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const uploadData = await uploadResponse.json();
      return uploadData.secure_url || uploadData.url;
    } catch (error) {
      console.error("File upload error:", error);
      return null;
    }
  };

  const handleImagesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    imageUpload.addFiles(Array.from(e.target.files));
  };

  const handleVideosSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    videoUpload.addFiles(Array.from(e.target.files));
  };

  const handleLogActivity = handleSubmit(async (values: any) => {
    if (!isEnrolled) {
      toast.error("Please subscribe to a cohort to log activities");
      return;
    }

    try {
      setIsUploading(true);

      // Upload images to Cloudinary
      const imageUrls: string[] = [];
      for (const file of imageUpload.files) {
        const url = await uploadFileToCloudinary(file, "image");
        if (url) imageUrls.push(url);
      }

      // Upload videos to Cloudinary
      const videoUrls: string[] = [];
      for (const file of videoUpload.files) {
        const url = await uploadFileToCloudinary(file, "video");
        if (url) videoUrls.push(url);
      }

      setIsUploading(false);

      // Filter and prepare tags
      const tags = Array.isArray(values.tags)
        ? values.tags.filter((t: string) => t && t.trim().length > 0)
        : values.tags ? [values.tags].filter((t: string) => t && t.trim().length > 0) : [];

      const payload = {
        content: values.content,
        type: "course" as const,
        tags,
        images: imageUrls,
        videos: videoUrls,
      };

      logActivity(payload, {
        onSuccess: (res: any) => {
          console.log(res, "Activity logged successfully");
          reset(); // Reset form fields
          imageUpload.clearFiles();
          videoUpload.clearFiles();
          toast.success("Activity logged successfully");
          // Invalidate queries to show changes immediately
          queryClient.invalidateQueries({ queryKey: ["student_leaderboard"] });
          queryClient.invalidateQueries({ queryKey: ["my_progress"] });
          queryClient.invalidateQueries({ queryKey: ["gamification-stats"] });
        },
        onError: (err: any) => {
          console.error(err, "Error logging activity");
          const errorMessage = err?.response?.data?.error || err?.message || "Failed to log activity";
          toast.error(errorMessage);
        },
      });
    } catch (err) {
      setIsUploading(false);
      console.error(err);
      toast.error("Failed to upload media files");
    }
  });

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-primary" />
          Log Today's Activity
        </CardTitle>
        <CardDescription>Share what you learned today</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogActivity} className="space-y-4">
          <ControlledInput
            name="content"
            control={control}
            placeholder={!isEnrolled ? "Subscribe to log activity..." : "What did you work on today?"}
            isTextArea
            label="Today's Activity"
            variant="primary"
            rules={{ required: true }}
            disabled={!isEnrolled}
          />
          <CreatableSelectComponent
            name="tags"
            control={control}
            label="Tags"
            placeholder="e.g, backend, api"
            isDisabled={!isEnrolled}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={!isEnrolled}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Add Image
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => videoInputRef.current?.click()}
              disabled={!isEnrolled}
            >
              <Video className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </div>

          {/* Hidden Inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImagesSelected}
          />

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={handleVideosSelected}
          />

          {/* Image Previews */}
          {imageUpload.files.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {imageUpload.files.map((file, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover rounded-md"
                  />

                  <button
                    type="button"
                    onClick={() => imageUpload.removeFile(index)}
                    className="cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Video Previews */}
          {videoUpload.files.length > 0 && (
            <div className="flex flex-col gap-3 mt-3">
              {videoUpload.files.map((file, index) => (
                <div key={index} className="relative">
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full rounded-md"
                    controls
                  />

                  <button
                    type="button"
                    onClick={() => videoUpload.removeFile(index)}
                    className="cursor-pointer absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <CustomButton
            type="submit"
            label={isUploading ? "Uploading media..." : isEnrolled ? "Log Activity" : "Subscribe to Log Activity"}
            isLoading={isPending || isUploading}
            disabled={isPending || isUploading || !isEnrolled}
            className="w-full"
          />
        </form>
      </CardContent>
    </Card>
  );
}
