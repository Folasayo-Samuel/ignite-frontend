"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/api/auth";
import { CustomButton } from "@/components/clickable/CustomButton";
import { Spinner } from "@/components/shared/Spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CountIcon } from "@/public/svgs/SharedIcons";
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

const OTP = () => {
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(3 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const { verifyOTP, resendOTP } = useAuth();
  const { isPending: verifyPending, mutateAsync: verifyOtp } = verifyOTP;
  const { isPending: resendPending, mutateAsync: resendOtp } = resendOTP;

  const submit = async (otp: string) => {
    const payload = {
      code: otp,
      email: email || "",
    };

    try {
      await verifyOtp(payload, {
        onSuccess: (response: any) => {
          toast.success(response?.message || "Verification successful");
          router.push(`/auth/login`);
        },
        onError: (error: any) => {
          toast.error(error?.message);
          console.log(error, "errorodod");
        },
      });
    } catch (error) {
      console.log("An error occurred: ", error);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    if (value.length === 6) {
      submit(value);
    }
  };

  const handleResendOtp = async () => {
    const payload = {
      email: email || "bruno@yopmail.com",
    };

    try {
      await resendOtp(payload, {
        onSuccess: (response: any) => {
          toast.success(response?.message || "OTP sent your email");
          setTimeLeft(3 * 60);
        },
        onError: (error: any) => {
          toast.error(error?.data?.error);
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
            <CardTitle className="text-2xl">Verify your account</CardTitle>
            <CardDescription>
              Join the FolaIgnite learning community
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={() => submit(otpValue)}
            className="flex flex-col gap-5 mx-auto"
          >
            <InputOTP
              value={otpValue}
              onChange={handleOtpChange}
              maxLength={6}
              className="justify-center mx-auto"
            >
              <InputOTPGroup className="gap-4 rounded-[10px]">
                {[0, 1, 2].map((index) => (
                  <InputOTPSlot
                    key={index}
                    className="border border-[#E4E5EA] bg-white"
                    index={index}
                  />
                ))}
                <InputOTPSeparator />
                {[3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    className="border border-[#E4E5EA] bg-white"
                    index={index}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <div className=" flex items-center justify-between w-10/12 mx-auto">
              <div className="text-sm">
                Did’t get a code?{" "}
                <span
                  role="button"
                  aria-label="button for resending OTP"
                  className="text-paragrah font-medium cursor-pointer"
                  onClick={handleResendOtp}
                >
                  {resendPending ? <Spinner /> : "Resend It"}
                </span>
              </div>
              <div className="text-sm">
                {timeLeft > 0 ? (
                  <div className="flex items-center justify-center gap-1">
                    <CountIcon />
                    <span className="text-[#333333] font-bold  text-xs">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                ) : (
                  <span className="text-red-500 font-medium">Code expired</span>
                )}
              </div>
            </div>

            <CustomButton
              label="Verify"
              type="submit"
              disabled={timeLeft <= 0}
              isLoading={verifyPending}
              className="w-full font-medium "
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTP;
