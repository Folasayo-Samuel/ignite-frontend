import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

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
    const sendStudentMessage = useApiMutation<Message, SendMessageDto & { mentorId: string }>({
        url: (vars) => `/student/messages/${vars.mentorId}`,
        method: "POST",
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
    const sendMentorMessage = useApiMutation<Message, SendMessageDto & { studentId: string }>({
        url: (vars) => `/mentor/messages/${vars.studentId}`,
        method: "POST",
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
