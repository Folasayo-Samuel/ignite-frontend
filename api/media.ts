import { useApiMutation } from "@/hooks/useApiMutation";

export interface SignUploadRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  folder: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  tags?: string[];
}

export interface SignUploadResponse {
  success: boolean;
  data: {
    url: string;
    signature: string;
    apiKey: string;
    timestamp: number;
    folder: string;
    public_id: string;
    // other cloudinary params
  };
}

export const useMedia = () => {
  const signUpload = useApiMutation<SignUploadResponse, SignUploadRequest>({
    url: "/media/sign-upload",
    method: "POST",
  });

  return {
    signUpload,
  };
};
