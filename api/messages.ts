import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";
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
}

export interface SendMessageDto {
  body: string;
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

    const getStudentMessages = (mentorId: string, limit: number = 20, cursor?: string) =>
        useApiQuery<Message[]>(["student_messages", mentorId, cursor], {
            url: `/student/messages/${mentorId}`,
            method: "GET",
            params: { limit, cursor },
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

    const getMentorMessages = (studentId: string, limit: number = 20, cursor?: string) =>
        useApiQuery<Message[]>(["mentor_messages", studentId, cursor], {
            url: `/mentor/messages/${studentId}`,
            method: "GET",
            params: { limit, cursor },
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
