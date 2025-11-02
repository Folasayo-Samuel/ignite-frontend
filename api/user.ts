import { AuthResponse, ID } from "@/components/api/type";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useApiQuery } from "@/hooks/useApiQuery";

export interface CurrentUserData {
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
  hasStudentProfile: boolean;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  confirmPassword: string;
  password: string;
  confirm_pass: string;
  createdAt: string;
  id: ID;
  country: string;
  isActive: boolean;
  data: CurrentUserData;
  referer_bonus_paid: string;
  profilePhoto: {
    url: string;
  };
 
}

export const useUser = () => {
  const getCurrentUser = () =>
    useApiQuery<CurrentUser>(["currentUser"], {
      url: `/auth/me`,
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
    getCurrentUser,
    createArtisanProfile,
    createClientProfile,
    updateClientProfile
  };
};
