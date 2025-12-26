import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface Message {
  id: string; 
  body: string;
  createdAt: string;
  senderId?: string; 
  recipientId?: string;
}

export interface SendMessageDto {
  body: string;
}

export interface MarkReadDto {
  upToId: string;
}

export const useMessages = () => {
    // Student Hooks
    const sendStudentMessage = (mentorId: string) => 
        useApiMutation<{ success: boolean; data: Message }, SendMessageDto>({
            url: `/student/messages/${mentorId}`,
            method: "POST",
        });

    const getStudentMessages = (mentorId: string, limit: number = 20, cursor?: string) => 
        useApiQuery<{ success: boolean; data: Message[] }>(["student_messages", mentorId, cursor], {
            url: `/student/messages/${mentorId}`,
            method: "GET",
            params: { limit, cursor },
        });

    const markStudentMessageRead = (mentorId: string) =>
        useApiMutation<{ success: boolean; data: any }, MarkReadDto>({
            url: `/student/messages/${mentorId}/read`,
            method: "POST",
        });

    // Mentor Hooks
    const sendMentorMessage = (studentId: string) => 
        useApiMutation<{ success: boolean; data: Message }, SendMessageDto>({
            url: `/mentor/messages/${studentId}`,
            method: "POST",
        });

    const getMentorMessages = (studentId: string, limit: number = 20, cursor?: string) => 
        useApiQuery<{ success: boolean; data: Message[] }>(["mentor_messages", studentId, cursor], {
            url: `/mentor/messages/${studentId}`,
            method: "GET",
            params: { limit, cursor },
        });

    const markMentorMessageRead = (studentId: string) =>
        useApiMutation<{ success: boolean; data: any }, MarkReadDto>({
            url: `/mentor/messages/${studentId}/read`,
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
