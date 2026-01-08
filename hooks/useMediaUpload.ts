
import { useState } from 'react';
import { api } from './apiFunction';
import { toast } from 'sonner';
import { BASE_URL } from '@/constants';

interface UseMediaUploadReturn {
    uploadFile: (file: File, folder?: string) => Promise<{ url: string; publicId: string } | null>;
    isUploading: boolean;
}

export function useMediaUpload(): UseMediaUploadReturn {
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = async (file: File, folder: string = 'ignite/chat'): Promise<{ url: string; publicId: string } | null> => {
        setIsUploading(true);
        try {
            // 1. Get Signature from Backend
            const resourceType = file.type.startsWith('image/') ? 'image' : 'raw'; // use 'raw' for PDFs/Docs if needed, but Cloudinary supports 'auto' too. 'raw' is safer for non-media.
            // Actually, keep simple: images vs raw
            const finalResourceType = file.type.startsWith('image/') ? 'image' : 'raw'; 

            const signResponse = await api<{
                signature: string;
                timestamp: number;
                cloudName: string;
                apiKey: string;
                folder: string;
                uploadUrl: string;
            }>({
                url: `${BASE_URL}/media/sign-upload`,
                method: 'POST',
                data: {
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    folder,
                    resourceType: finalResourceType
                }
            });

            if (!signResponse) throw new Error('Failed to sign upload');

            // 2. Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', signResponse.apiKey);
            formData.append('timestamp', String(signResponse.timestamp));
            formData.append('signature', signResponse.signature);
            formData.append('folder', signResponse.folder);
            
            // For signed uploads, resource_type is part of the URL, not form data
            const response = await fetch(signResponse.uploadUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || 'Upload failed');
            }

            const data = await response.json();
            return {
                url: data.secure_url,
                publicId: data.public_id
            };

        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Failed to upload file');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, isUploading };
}
