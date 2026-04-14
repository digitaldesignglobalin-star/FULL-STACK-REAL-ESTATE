"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Building2, User, Loader2 } from "lucide-react";
import axios from "axios";

export default function RolePhonePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [role, setRole] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select a role");
      return;
    }

    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/auth/mobile-send-otp", {
        mobile: phone,
        email: session?.user?.email,
        name: session?.user?.name,
        role,
      });

      if (res.data.success) {
        toast.success("OTP sent to your phone!");
        router.push(`/auth/verify-phone?mobile=${phone}&role=${role}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Please login first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <Link href="/auth/login" className="text-sm font-medium text-[#006AC2] hover:underline">
          ← Back to Login
        </Link>
      </div>

      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-[#006AC2]">
        <h1 className="text-2xl font-bold text-center text-[#006AC2] mb-2">
          Complete Your Profile
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Welcome {session.user.name}! Please select your role and verify your phone number.
        </p>

        {session.user.image && (
          <div className="flex justify-center mb-6">
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-20 h-20 rounded-full"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition ${
                  role === "user"
                    ? "border-[#006AC2] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User className={role === "user" ? "text-[#006AC2]" : "text-gray-400"} size={24} />
                <span className={`text-sm font-medium ${role === "user" ? "text-[#006AC2]" : "text-gray-600"}`}>
                  User
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("builder")}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition ${
                  role === "builder"
                    ? "border-[#006AC2] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Building2 className={role === "builder" ? "text-[#006AC2]" : "text-gray-400"} size={24} />
                <span className={`text-sm font-medium ${role === "builder" ? "text-[#006AC2]" : "text-gray-600"}`}>
                  Builder
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("dealer")}
                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition ${
                  role === "dealer"
                    ? "border-[#006AC2] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Building2 className={role === "dealer" ? "text-[#006AC2]" : "text-gray-400"} size={24} />
                <span className={`text-sm font-medium ${role === "dealer" ? "text-[#006AC2]" : "text-gray-600"}`}>
                  Dealer
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                +91
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter 10-digit phone number"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">We&apos;ll send an OTP to verify your number</p>
          </div>

          <button
            type="submit"
            disabled={!role || !isValidPhone(phone) || loading}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              !role || !isValidPhone(phone) || loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#006AC2] text-white hover:opacity-90"
            }`}
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
