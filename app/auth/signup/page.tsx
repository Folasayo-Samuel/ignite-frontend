"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/schemas/dynamicSchema";
import useDynamicForm from "@/hooks/useDynamicForm";
import ControlledInput from "@/components/inputFields/ControlledInput";
import { CustomButton } from "@/components/clickable/CustomButton";
import { useAuth } from "@/api/auth";
import { toast } from "sonner";
import { ControlledSelect } from "@/components/inputFields/ControlledSelect";
import { PasswordRequirements } from "@/components/inputFields/PasswordRequirements";
import { AuthUser } from "@/components/api/type";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import logo from "@/public/images/ignitelogo.png";
import { LoadingScreen } from "@/components/shared/LoadingScreen";

const fields: Field[] = [
  {
    name: "email",
    type: "text",
    errorMessage: "Email is required",
    isRequired: true,
  },
  {
    name: "name",
    type: "text",
    errorMessage: "Username is required",
    isRequired: true,
  },
  {
    name: "password",
    type: "text",
    errorMessage: "Password is required",
    isRequired: true,
  },
  {
    name: "confirmPassword",
    type: "text",
    errorMessage: "Password is required",
  },
  {
    name: "role",
    type: "text",
    errorMessage: "Role is required",
    isRequired: true,
  },
  {
    name: "country",
    type: "text",
    errorMessage: "Country is required",
    isRequired: true,
  },
];

const userType = [
  { value: "student", label: "Student / Learner" },
  // { value: "partner", label: "Partner / Organization" },
  { value: "mentor", label: "Mentor / Instructor" },
];

const techTracks = [
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "fullstack", label: "Fullstack Development" },
  { value: "design", label: "UI/UX Design" },
  { value: "data", label: "Data Science" },
  { value: "others", label: "Others" },
];

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "";

  // === Referral Code Capture ===
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Priority: 1. URL param, 2. Cookie
    const urlRef = searchParams.get("ref");
    if (urlRef) {
      setReferralCode(urlRef.toUpperCase());
      // Store in cookie for persistence if user navigates away
      document.cookie = `folaignite_ref=${urlRef.toUpperCase()}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    } else {
      // Check cookie
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'folaignite_ref' && value) {
          setReferralCode(value);
          break;
        }
      }
    }
  }, [searchParams]);
  // === End Referral Code Capture ===

  const { control, handleSubmit, watch, setError, clearErrors, setValue } =
    useDynamicForm<AuthUser>(fields, {
      role: initialRole
    } as any);

  const { registerUser, getAllCountries } = useAuth();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Sync role if it change in URL or for initial mount
  useEffect(() => {
    if (initialRole) {
      setValue("role", initialRole);
    }
  }, [initialRole, setValue]);

  useEffect(() => {
    if (confirmPassword) {
      if (confirmPassword !== password) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
      } else {
        clearErrors("confirmPassword");
      }
    }
  }, [confirmPassword, password, setError, clearErrors]);

  const { data } = getAllCountries();
  const countriesData = data;

  const countryOptions =
    countriesData?.map((country) => ({
      value: country.code,
      label: country.name,
    })) || [];

  const { isPending, mutateAsync } = registerUser;

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    const submissionData = { ...data };
    if (submissionData.role === 'student' && submissionData.techTrack === 'others' && submissionData.otherTrack) {
      submissionData.techTrack = submissionData.otherTrack;
    }

    // Include referral code if present
    if (referralCode) {
      submissionData.referralCode = referralCode;
    }

    try {
      await mutateAsync(submissionData, {
        onSuccess: (response: any) => {
          console.log("Signup success response:", response); // For E2E retest
          toast.success(response?.message);
          // Clear referral cookie on successful signup
          if (referralCode) {
            document.cookie = 'folaignite_ref=; path=/; max-age=0';
          }
          router.push(`/auth/otp-verification?email=${data.email}`);
        },
        onError: (error: any) => {
          toast.error(error?.message);
        },
      });
    } catch (error) {
      console.log("An error occurred: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-12">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-4 text-center">
          <Link href="/" className="flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Image
                src={logo}
                alt="Fola-Ignite"
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          </Link>
          <div>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Join the FolaIgnite learning community
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ControlledInput
              name="name"
              control={control}
              placeholder="Enter full name"
              type="text"
              label="Full Name"
              variant="primary"
              rules={{ required: true }}
            />
            <ControlledInput
              name="email"
              control={control}
              placeholder="you@example.com"
              type="text"
              label="Email Address"
              variant="primary"
              rules={{ required: true }}
            />
            <ControlledInput
              name="password"
              control={control}
              placeholder="••••••••"
              type="password"
              label="Password"
              variant="primary"
              rules={{
                required: { value: true, message: "Password is required" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/,
                  message: "Password must meet all requirements",
                },
              }}
            />
            <PasswordRequirements password={password} />
            <ControlledInput
              name="confirmPassword"
              control={control}
              type="password"
              label="Confirm New Password"
              variant="primary"
              rules={{ required: true }}
            />
            <ControlledSelect
              name="country"
              label="Country"
              options={countryOptions}
              control={control}
              variant="primary"
              // placeholder="__"
              searchable
            />
            <ControlledSelect
              name="role"
              label="I am a..."
              options={userType}
              control={control}
              variant="primary"
              placeholder="__"
            />
            {watch("role") === "student" && (
              <ControlledSelect
                name="techTrack"
                label="Choose your Tech Track"
                options={techTracks}
                control={control}
                variant="primary"
                placeholder="Select a track"
              />
            )}
            {watch("role") === "student" && watch("techTrack") === "others" && (
              <ControlledInput
                name="otherTrack"
                control={control}
                placeholder="e.g. Cybersecurity, Web3"
                type="text"
                label="Specify Tech Track"
                variant="primary"
                rules={{ required: true }}
              />
            )}
            <CustomButton
              type="submit"
              label="Create Account"
              className="w-full rounded-[10px]"
              disabled={isPending}
              isLoading={isPending}
            />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SignupForm />
    </Suspense>
  )
}
