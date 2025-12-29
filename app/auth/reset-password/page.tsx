"use client";
import React, { useState } from "react";
import { useAuth } from "@/api/auth";
import { CustomButton } from "@/components/clickable/CustomButton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import Image from "next/image";
import logo from "@/public/images/ignitelogo.png";
import useDynamicForm from "@/hooks/useDynamicForm";
import { Field } from "@/schemas/dynamicSchema";
import ControlledInput from "@/components/inputFields/ControlledInput";

const fields: Field[] = [
    {
        name: "newPassword",
        type: "text",
        errorMessage: "Password is required",
        isRequired: true,
    },
    {
        name: "confirmNewPassword",
        type: "text",
        errorMessage: "Confirm Password is required",
        isRequired: true,
    },
];

const ResetPasswordPage = () => {
    const params = useSearchParams();
    const email = params.get("email");
    const router = useRouter();
    const [otpValue, setOtpValue] = useState("");

    const { verifyResetPasswordOTP } = useAuth();
    const { isPending, mutateAsync } = verifyResetPasswordOTP;

    const { control, handleSubmit, watch } = useDynamicForm(fields, {});

    const onSubmit = async (data: any) => {
        if (!email) {
            toast.error("Email is missing. Please try again.");
            return;
        }
        if (otpValue.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }
        if (data.newPassword !== data.confirmNewPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        const payload = {
            email,
            code: otpValue,
            newPassword: data.newPassword,
            confirmNewPassword: data.confirmNewPassword
        };

        try {
            await mutateAsync(payload, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Password reset successful!");
                    router.push(`/auth/login`);
                },
                onError: (error: any) => {
                    toast.error(error?.message || "Failed to reset password");
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
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>
                            Enter the OTP sent to {email} and your new password.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6 mx-auto">
                        <div className="flex justify-center">
                            <InputOTP
                                value={otpValue}
                                onChange={setOtpValue}
                                maxLength={6}
                            >
                                <InputOTPGroup className="gap-2 sm:gap-4 rounded-[10px]">
                                    {[0, 1, 2].map((index) => (
                                        <InputOTPSlot
                                            key={index}
                                            className="border border-[#E4E5EA] bg-white h-12 w-10 sm:h-14 sm:w-12"
                                            index={index}
                                        />
                                    ))}
                                    <InputOTPSeparator />
                                    {[3, 4, 5].map((index) => (
                                        <InputOTPSlot
                                            key={index}
                                            className="border border-[#E4E5EA] bg-white h-12 w-10 sm:h-14 sm:w-12"
                                            index={index}
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <ControlledInput
                                name="newPassword"
                                control={control}
                                placeholder="New Password"
                                type="password"
                                label="New Password"
                                variant="primary"
                                rules={{ required: true, minLength: { value: 8, message: "Password must be at least 8 characters" } }}
                            />
                            <ControlledInput
                                name="confirmNewPassword"
                                control={control}
                                placeholder="Confirm Password"
                                type="password"
                                label="Confirm Password"
                                variant="primary"
                                rules={{ required: true }}
                            />

                            <CustomButton
                                label="Reset Password"
                                type="submit"
                                disabled={isPending}
                                isLoading={isPending}
                                className="w-full font-medium"
                            />
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;
