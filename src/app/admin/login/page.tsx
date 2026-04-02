"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Email validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Form validation - email must be valid and password must be at least 6 chars
  const isFormValid = isValidEmail(email) && password.length >= 6;

  // Handle login form submission
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation checks
    if (!isFormValid) {
      toast.error("Please enter a valid email and password (min 6 characters)");
      return;
    }

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Logging in as admin...");

    try {
      // Sign in using NextAuth credentials provider (same as auth.ts)
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // Check for authentication errors
      if (res?.error) {
        toast.error(res.error || "Invalid email or password", { id: toastId });
        return;
      }

      // Get session to check user role
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role;

      // Verify that the user has admin role
      if (role !== "admin") {
        toast.error("Access denied. Admin credentials required.", { id: toastId });
        // Sign out if not admin
        await signIn("credentials", { email: "", password: "", redirect: true, callbackUrl: "/admin/login" });
        return;
      }

      toast.success("Welcome back, Admin!", { id: toastId });
      
      // Redirect to admin panel after successful login
      router.push("/admin");

    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Something went wrong during login", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in as admin
  if (session?.user?.role === "admin") {
    router.push("/admin");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      {/* Back to Home Link */}
      <Link
        href="/dashboard"
        className="absolute top-6 left-6 text-sm font-medium text-slate-400 hover:text-blue-500 transition-colors"
      >
        ← Back to Home
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Admin <span className="text-blue-500">Portal</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Login to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
                ${
                  !isFormValid || loading
                    ? "bg-slate-700 cursor-not-allowed text-slate-400"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Logging in...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Login as Admin
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="px-3 text-sm text-slate-500">SECURE ACCESS</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* User Login Link */}
          <p className="text-center text-sm text-slate-400">
            Are you a regular user?{" "}
            <Link
              href="/auth/login"
              className="text-blue-500 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Restricted access. Only authorized administrators allowed.
        </p>
      </div>
    </div>
  );
}
