"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flame } from "lucide-react";
import { Field } from "@/schemas/dynamicSchema";
import ControlledInput from "@/components/inputFields/ControlledInput";
import useDynamicForm from "@/hooks/useDynamicForm";
import { CustomButton } from "@/components/clickable/CustomButton";
import { useAuth } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const fields: Field[] = [
  {
    name: "email",
    type: "text",
    errorMessage: "Email is required",
    isRequired: true,
  },

  {
    name: "password",
    type: "text",
    errorMessage: "Password is required",
    isRequired: true,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [openVerify, setOpenVerify] = useState(false);

  const { control, handleSubmit, formState } = useDynamicForm(fields, {});
  const { setCurrentUser, currentUser } = useAuthStore();

  const { loginUser } = useAuth();

  const { isPending, mutateAsync } = loginUser;

  const redirectByRole = (role: string) => {
    if (role === "admin") {
      router.replace("/admin");
    } else if (role === "student") {
      router.replace("/student/dashboard");
    } else if (role === "mentor") {
      router.replace("/mentors");
    } else if (role === "partner") {
      router.replace("/partner");
    } else {
      console.log("Role not recognized. Please contact support.");
      router.replace("/auth/login");
    }
  };

  useEffect(() => {
    if (currentUser && !redirect) {
      redirectByRole(currentUser?.role);
    }
  }, [currentUser, redirect]);

  const onSubmit = async (data: any) => {
    try {
      await mutateAsync(data, {
        onSuccess: (response: any) => {
          console.log(response, "res_");

          const user = response?.data?.user;

          if (user) {
            setCurrentUser(user);
            toast.success(response?.data?.message || "Login successful!");

            if (redirect) {
              router.push(redirect); 
            } else {
              redirectByRole(user.role);
            }
          } else {
            toast.error("Invalid login response.");
          }
        },
        onError: (error: any) => {
          console.log(error, "error_logging");
          toast.error(error?.message || "Login failed");
          if (
            error?.status === 400 ||
            error?.data?.message ===
              "Please verify your email with the OTP before signing in."
          ) {
            const role = error?.data?.user?.role;
            // if (role) setUnverifiedRole(role);
            setOpenVerify(true);
          }
        },
      });
    } catch (error) {
      console.log("An error occurred: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-4 text-center">
          <Link href="/" className="flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Flame className="h-7 w-7 text-primary-foreground" />
            </div>
          </Link>
          <div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your FolaIgnite account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ControlledInput
              name="email"
              control={control}
              placeholder="Enter Email"
              type="text"
              label="Email Address"
              variant="primary"
              rules={{ required: true }}
            />
            <div className="flex flex-col gap-2">
              <ControlledInput
                name="password"
                control={control}
                placeholder="••••••••"
                type="password"
                label="Password"
                variant="primary"
                rules={{ required: true }}
              />
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline text-right "
              >
                Forgot password?
              </Link>
            </div>

            <CustomButton
              type="submit"
              label="Sign In"
              className="w-full rounded-[10px]"
              disabled={isPending}
              isLoading={isPending}
            />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
