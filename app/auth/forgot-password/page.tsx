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
import ControlledInput from "@/components/inputFields/ControlledInput";
import useDynamicForm from "@/hooks/useDynamicForm";
import { CustomButton } from "@/components/clickable/CustomButton";
import { useAuth } from "@/api/auth";
import { toast } from "sonner";
import Image from "next/image";
import logo from "@/public/images/ignitelogo.png";

const fields: Field[] = [
    {
        name: "email",
        type: "text",
        errorMessage: "Email is required",
        isRequired: true,
    },
];

export default function ForgotPasswordPage() {
    const router = useRouter();

    const { control, handleSubmit } = useDynamicForm(fields, {});

    const { forgotPassword } = useAuth();
    const { isPending, mutateAsync } = forgotPassword;

    const onSubmit = async (data: any) => {
        try {
            await mutateAsync(data, {
                onSuccess: (response: any) => {
                    toast.success(response?.data?.message || "OTP sent successfully!");
                    router.push(`/auth/reset-password?email=${data.email}`);
                },
                onError: (error: any) => {
                    toast.error(error?.message || "Failed to send OTP");
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
                            <Image
                                src={logo}
                                alt="Fola-Ignite"
                                className="object-cover w-full h-full rounded-full"
                            />
                        </div>
                    </Link>
                    <div>
                        <CardTitle className="text-2xl">Forgot Password</CardTitle>
                        <CardDescription>
                            Enter your email to receive a password reset code
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

                        <CustomButton
                            type="submit"
                            label="Send OTP"
                            className="w-full rounded-[10px]"
                            disabled={isPending}
                            isLoading={isPending}
                        />
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Link
                        href="/auth/login"
                        className="text-sm text-center text-primary hover:underline"
                    >
                        Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
