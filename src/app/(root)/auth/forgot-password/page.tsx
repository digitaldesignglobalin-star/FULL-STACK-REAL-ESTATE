"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);



  const handleSubmit = async () => {
  if (!email) {
    toast.error("Enter your email");
    return;
  }

  if (timer > 0) return; // Prevent spam clicking

  try {
    setLoading(true);

    await axios.post("/api/auth/forgot-password", { email });

    toast.success(
      "If an account exists, a reset link has been sent."
    );

    setTimer(30); // 🔥 Start 30 sec cooldown

  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  if (timer === 0) return;

  const interval = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Forgot Password
          </CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
  onClick={handleSubmit}
  disabled={loading || timer > 0}
  className="w-full"
>
  {timer > 0
    ? `Resend in ${timer}s`
    : loading
    ? "Sending..."
    : "Send Reset Link"}
</Button>


          <div className="text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
