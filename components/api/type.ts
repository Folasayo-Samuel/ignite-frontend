import { AxiosRequestConfig } from "axios";

export type ID = string | number;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiError {
  response?: any;
  message?: string;
  status?: number;
  data?: any;
}
export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface ApiOptions extends Omit<AxiosRequestConfig, "url" | "method"> {
  url: string;
  method: HttpMethod;
  skipAuthRedirect?: boolean;
  skipAuthRefresh?: boolean;
  suppressErrorToast?: boolean;
}
export interface AuthUser {
  id: ID;
  userId: ID;
  createdAt?: string;
  isActive: boolean;
  name: string;
  avatar: string;
  phoneNumber: string;
  dateOfBirth: string;
  specialization: string;
  residentialAddress: string;
  gender: string;
  email: string;
  profilePicture: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
  role: string;
  isArtisan: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  isClient: boolean;
  artisanId: ID;
  organizationId?: string;
}

export type Userdata = {
  id: ID;
  name: string;
  email: string;
  mobile: string;
  manager: string;
};

export interface User {
  id: ID;
  name: string;
  email: string;
  mobile: string;
  manager: string;
  data: Userdata[];
}
