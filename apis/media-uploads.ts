import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ID } from "@/components/apis/type";
import { useState } from "react";

export interface MediaUpload {
  _id: ID;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: ID;
  createdAt: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    thumbnail?: string;
  };
}

export interface UploadSignature {
  uploadUrl: string;
  fileId: string;
  expiresAt: string;
  maxSize: number;
  allowedTypes: string[];
}

export const useMedia = () => {
  // Get upload signature for direct S3/upload service upload
  const getUploadSignature = useApiMutation<
    { success: boolean; data: UploadSignature },
    {
      filename: string;
      mimeType: string;
      fileSize: number;
      fileType: "image" | "video" | "document" | "audio";
    }
  >({
    url: "/media/sign-upload",
    method: "POST",
  });

  // Complete upload after file is uploaded to storage service
  const completeUpload = useApiMutation<
    { success: boolean; data: MediaUpload },
    {
      fileId: string;
      filename: string;
      mimeType: string;
      size: number;
      metadata?: any;
    }
  >({
    url: "/media/complete-upload",
    method: "POST",
  });

  // Get user's media files
  const getUserMedia = (type?: string, page = 1, limit = 20) =>
    useApiQuery<{ success: boolean; data: MediaUpload[]; pagination: any }>(
      ["user-media", type, page, limit],
      {
        url: `/media/user${type ? `?type=${type}` : ""}&page=${page}&limit=${limit}`,
        method: "GET",
      },
    );

  // Get specific media file
  const getMedia = (id: string) =>
    useApiQuery<{ success: boolean; data: MediaUpload }>(["media", id], {
      url: `/media/${id}`,
      method: "GET",
    });

  // Delete media file
  const deleteMedia = (id: string) =>
    useApiMutation<{ success: boolean }, void>({
      url: `/media/${id}`,
      method: "DELETE",
    });

  // Upload helper function
  const uploadFile = async (
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<MediaUpload> => {
    try {
      // Step 1: Get upload signature
      const { mutateAsync } = getUploadSignature;
      const signatureResult = await mutateAsync({
        filename: file.name,
        mimeType: file.type,
        fileSize: file.size,
        fileType: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("audio/")
              ? "audio"
              : "document",
      });

      if (!signatureResult.success) {
        throw new Error("Failed to get upload signature");
      }

      const signature = signatureResult.data;

      // Step 2: Upload file to storage service
      const formData = new FormData();
      // Add file and any required fields for the upload service
      formData.append("file", file);

      const uploadResponse = await fetch(signature.uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      // Step 3: Complete upload on our backend
      const { mutateAsync: completeUploadAsync } = completeUpload;
      const result = await completeUploadAsync({
        fileId: signature.fileId,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      });

      if (!result.success) {
        throw new Error("Failed to complete upload");
      }

      return result.data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  return {
    getUploadSignature,
    completeUpload,
    getUserMedia,
    getMedia,
    deleteMedia,
    uploadFile,
  };
};

// Custom hook for file uploads with progress tracking
export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadFile } = useMedia();

  const upload = async (
    file: File,
    options?: {
      onProgress?: (progress: number) => void;
    },
  ): Promise<MediaUpload | null> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const result = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
        options?.onProgress?.(progress);
      });

      setUploadProgress(100);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
  };

  return {
    upload,
    uploadProgress,
    isUploading,
    error,
    reset,
  };
};
