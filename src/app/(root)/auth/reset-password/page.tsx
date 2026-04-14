"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Invalid or expired reset link.</p>
      </div>
    );
  }

  const isFormValid =
    password.trim().length >= 6 &&
    confirmPassword.trim().length >= 6 &&
    password.trim() === confirmPassword.trim();

  const handleReset = async () => {
    if (!isFormValid) {
      toast.error("Passwords must match and be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/auth/reset-password", {
        email,
        token,
        newPassword: password.trim(),
      });

      toast.success("Password updated successfully!");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-xl border-[1px] border-[#8080807a]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter and confirm your new password</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="border-[0.5px] border-[#80808088]"
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="border-[0.5px] border-[#80808088]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          {confirmPassword && password.trim() !== confirmPassword.trim() && (
            <p className="text-sm text-red-500">Passwords do not match</p>
          )}

          <Button
            onClick={handleReset}
            disabled={!isFormValid || loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
