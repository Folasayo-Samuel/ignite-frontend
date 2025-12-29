"use client";

import { useRef } from "react";
import { PlusCircle, ImageIcon, Video } from "lucide-react";
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
import useDynamicForm from "@/hooks/useDynamicForm";
import { Field } from "@/schemas/dynamicSchema";
import { useFileUpload } from "@/hooks/useFileUpload";
import CreatableSelectComponent from "../inputFields/CreatableSelect";
import { toast } from "sonner";

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
  const { control, handleSubmit } = useDynamicForm(fields, { tags: [] });

  const imageUpload = useFileUpload(4);
  const videoUpload = useFileUpload(2);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const { logMyActivities } = useStudents();
  const { mutate: logActivity, isPending } = logMyActivities;

  const handleImagesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    imageUpload.addFiles(Array.from(e.target.files));
  };

  const handleVideosSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    videoUpload.addFiles(Array.from(e.target.files));
  };

  const handleLogActivity = handleSubmit(async (values: any) => {
    try {
      // Filter and prepare tags
      const tags = Array.isArray(values.tags)
        ? values.tags.filter((t: string) => t && t.trim().length > 0)
        : values.tags ? [values.tags].filter((t: string) => t && t.trim().length > 0) : [];

      const payload = {
        content: values.content,
        type: "course" as const,
        tags,
        // Note: images and videos require a file upload service to convert File objects to URLs
        // For now we'll send empty arrays. TODO: Implement file upload integration
        images: [] as string[],
        videos: [] as string[],
      };

      logActivity(payload, {
        onSuccess: (res: any) => {
          console.log(res, "Activity logged successfully");
          imageUpload.clearFiles();
          videoUpload.clearFiles();
          toast.success("Activity logged successfully");
        },
        onError: (err: any) => {
          console.error(err, "Error logging activity");
          const errorMessage = err?.response?.data?.error || err?.message || "Failed to log activity";
          toast.error(errorMessage);
        },
      });
    } catch (err) {
      console.error(err);
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
            placeholder="What did you work on today?"
            isTextArea
            label="Today's Activity"
            variant="primary"
            rules={{ required: true }}
          />
          <CreatableSelectComponent
            name="tags"
            control={control}
            label="Tags"
            placeholder="e.g, backend, api"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
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
            label="Log Activity"
            isLoading={isPending}
            disabled={isPending}
            className="w-full"
          />
        </form>
      </CardContent>
    </Card>
  );
}
