"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Users, Eye, EyeOff, Loader2 } from "lucide-react";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = isValidEmail(email) && password.length >= 6;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please enter a valid email and password (min 6 characters)");
      return;
    }

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Logging in as employee...");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || "Invalid email or password", { id: toastId });
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role;

      if (role !== "employee") {
        toast.error("Access denied. Employee credentials required.", { id: toastId });
        await signIn("credentials", { email: "", password: "", redirect: true, callbackUrl: "/employee/login" });
        return;
      }

      toast.success("Welcome back, Employee!", { id: toastId });
      router.push("/employee");

    } catch (error) {
      console.error("Employee login error:", error);
      toast.error("Something went wrong during login", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (session?.user?.role === "employee") {
    router.push("/employee");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <Link
        href="/dashboard"
        className="absolute top-6 left-6 text-sm font-medium text-slate-400 hover:text-emerald-500 transition-colors"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4">
            <Users className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Employee <span className="text-emerald-500">Portal</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Login to access the employee dashboard
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                Employee Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@example.com"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-600"
              />
            </div>

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
                  className="w-full px-4 py-3 pr-12 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
                ${
                  !isFormValid || loading
                    ? "bg-slate-700 cursor-not-allowed text-slate-400"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Logging in...
                </>
              ) : (
                <>
                  <Users size={20} />
                  Login as Employee
                </>
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="px-3 text-sm text-slate-500">EMPLOYEE ACCESS</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <p className="text-center text-sm text-slate-400">
            Are you an admin?{" "}
            <Link
              href="/admin/login"
              className="text-emerald-500 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Restricted access. Only authorized employees allowed.
        </p>
      </div>
    </div>
  );
}
