"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyPhonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") || "";

  const [otp, setOtp] = useState<string[]>(["","","","","",""]);

  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(()=>{
  if(!mobile){
    toast.error("Invalid session");
    router.push("/auth/register");
  }
},[mobile,router]);



  // handle OTP input
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };



  // submit OTP
  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/verify-phone", {
        mobile,
        otp: code,
      });

      toast.success("Account created successfully");

      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }

    // setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[420px] shadow-xl rounded-2xl border border-[#80808087]">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold text-center">Verify Your Mobile</h1>

          <p className="text-gray-500 text-center mt-2">
            Enter the 6-digit code sent to
          </p>

          <p className="text-center font-semibold mt-1">{mobile}</p>

          {/* OTP boxes */}
          <div className="flex justify-center gap-3 mt-6">
            {otp.map((digit, i) => (
              <Input
                inputMode="numeric"
                onPaste={(e) => {
                  const paste = e.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);
                  if (paste.length === 6) {
                    setOtp(paste.split(""));
                  }
                }}
                key={i}
                id={`otp-${i}`}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-12 h-12 text-center text-lg border border-[#808080a1]"
              />
            ))}
          </div>

          <Button
            className="w-full mt-6"
            // disabled={loading}
            disabled={loading || otp.join("").length !== 6}
            onClick={handleVerify}
          >
            {loading ? "Verifying..." : "Verify Account"}
          </Button>

          {/* resend */}
          <p className="text-center text-sm text-gray-500 mt-4">
            {timeLeft > 0 ? (
              <>Resend OTP in {timeLeft}s</>
            ) : (
              <button
                className="text-blue-600 font-medium"
                onClick={async () => {
                  try {
                    await axios.post("/api/auth/mobile-resend-otp", { mobile });
                    toast.success("OTP resent");
                    setTimeLeft(30);
                  } catch {
                    toast.error("Failed to resend OTP");
                  }
                }}
              >
                Resend OTP
              </button>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
