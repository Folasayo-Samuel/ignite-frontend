import { AuthResponse, ID } from "@/components/api/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface CurrentStudentData {
  _id: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  profilePicture: string;
  location: string;
  city: string;
  phoneNumber: string;

}

export interface CurrentUser {
  access_token?: any;
  name: string;
  role: string;
  location: string;
  phoneNumber: string;
  confirmPassword: string;
  password: string;
  confirm_pass: string;
  createdAt: string;
  id: ID;
  artisanId: ID;
  isActive: boolean;
  data: CurrentStudentData;
  referer_bonus_paid: string;
  profilePhoto: {
    url: string;
  };
 
}

export const useStudents = () => {
  const getStudentAchievement = (id:string) =>
    useApiQuery<CurrentUser>(["my_acheivement"], {
      url: `/students/${id}/achievements`,
      method: "GET",
    });

  const createArtisanProfile = useApiMutation<AuthResponse, FormData>({
    url: "/artisans",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const createClientProfile = useApiMutation<AuthResponse, FormData>({
    url: "/clients",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

    const updateClientProfile = useApiMutation<AuthResponse, FormData>({
    url: `/clients`,
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    getStudentAchievement,
    // createArtisanProfile,
    // createClientProfile,
    // updateClientProfile
  };
};
