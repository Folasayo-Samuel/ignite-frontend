import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useApiInfiniteQuery } from "@/hooks/useApiInfiniteQuery";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/hooks/apiFunction";
import { BASE_URL } from "@/constants";

export interface Message {
  _id: string;
  id?: string; 
  body: string;
  createdAt: string;
  senderUserId: string; 
  recipientUserId: string;
  threadId: string;
  attachments?: Array<{
      url: string;
      type: 'image' | 'file';
      name?: string;
      size?: number;
  }>;
}

export interface SendMessageDto {
  body: string;
  attachments?: Array<{
      url: string;
      type: 'image' | 'file';
      name?: string;
      size?: number;
  }>;
}

export interface MarkReadDto {
  upToId: string;
}

export const useMessages = () => {
    // Student Hooks
    // Using native useMutation to strip mentorId from body
    const sendStudentMessage = useMutation<Message, Error, SendMessageDto & { mentorId: string }>({
        mutationFn: (vars) => {
            const { mentorId, ...body } = vars;
            return api<Message>({
                url: `${BASE_URL || ""}/student/messages/${mentorId}`,
                method: "POST",
                data: body
            });
        }
    });

    const getStudentMessages = (mentorId: string, limit: number = 20) =>
        useApiInfiniteQuery<Message[]>(["student_messages", mentorId], {
            url: `/student/messages/${mentorId}`,
            method: "GET",
            params: { limit },
        });

    const markStudentMessageRead = useApiMutation<{ success: boolean; data: any }, MarkReadDto & { mentorId: string }>({
        url: (vars) => `/student/messages/${vars.mentorId}/read`,
        method: "POST",
    });

    // Mentor Hooks
    // Using native useMutation to strip studentId from body
    const sendMentorMessage = useMutation<Message, Error, SendMessageDto & { studentId: string }>({
        mutationFn: (vars) => {
            const { studentId, ...body } = vars;
            return api<Message>({
                url: `${BASE_URL || ""}/mentor/messages/${studentId}`,
                method: "POST",
                data: body
            });
        }
    });

    const getMentorMessages = (studentId: string, limit: number = 20) =>
        useApiInfiniteQuery<Message[]>(["mentor_messages", studentId], {
            url: `/mentor/messages/${studentId}`,
            method: "GET",
            params: { limit },
        });

    const markMentorMessageRead = useApiMutation<{ success: boolean; data: any }, MarkReadDto & { studentId: string }>({
        url: (vars) => `/mentor/messages/${vars.studentId}/read`,
        method: "POST",
    });

    return {
        sendStudentMessage,
        getStudentMessages,
        markStudentMessageRead,
        sendMentorMessage,
        getMentorMessages,
        markMentorMessageRead
    };
};
