"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter valid 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/auth/verify-otp", {
        email,
        otp: finalOtp,
      });

      toast.success("Account verified successfully!");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
   try {
    await axios.post("/api/auth/resend-otp", { email });

    toast.success("OTP resent successfully!");
    setTimer(30);
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Failed to resend OTP"
    );
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">

{/* Back Button - Extreme Top Left */}
      <div className="absolute top-3 left-3">
        <Link
          href="/auth/register"
          className="  inline-flex items-center gap-1
      px-3 py-1.5
      text-sm font-medium
      text-[#006AC2]
      rounded-md
      transition-all duration-200
      hover:bg-[#006AC2]/10
      active:scale-95
      active:bg-[#006AC2]/20"
        >
          ← Back
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border border-[#80808087]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-between gap-2 ">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-12 h-12 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border border-[#808080a1]"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 6}
            className="w-full"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </Button>

          {/* Resend Section */}
          <div className="text-center text-sm text-muted-foreground">
            {timer > 0 ? (
              <p>Resend OTP in {timer}s</p>
            ) : (
              <button
                onClick={handleResend}
                className="underline hover:text-primary"
              >
                Resend OTP
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
