"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const session = useSession();
  console.log(session);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = isValidEmail(email) && password.length >= 6;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Logging in...");

    try {
      // const res = await signIn("credentials", {
      //   email,
      //   password,
      //   redirect: false,
      // });

      // router.push("/dashboard")

      // if (res?.error) {
      //   toast.error("Invalid email or password", { id: toastId });
      // } else {
      //   toast.success("Welcome back!", { id: toastId });
      // }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password", { id: toastId });
        return;
      }

      toast.success("Welcome back!", { id: toastId });

      /* ⭐ VERY IMPORTANT PART */
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      const role = session?.user?.role;

      if (role === "admin") router.push("/admin");
      else if (role === "employee") router.push("/employee");
      else router.push("/dashboard");


    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await signIn("google",{callbackUrl:"/after-login"})
    } catch {
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative flex items-center justify-center px-4">
      {/* Back Button - Extreme Top Left */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="text-sm font-medium text-[#006AC2] hover:underline"
        >
          ← Back
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-[#006AC2]">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-[#006AC2]">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Login to continue to your account
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AC2]  border border-[#80808073]"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AC2]  border border-[#80808073]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#006AC2]"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#006AC2] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-lg font-semibold transition 
  ${
    !isFormValid || loading
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-[#006AC2] text-white hover:opacity-90"
  }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google Button */}
        <button
          className="w-full border border-[#808080ad] py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition cursor-pointer"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
          />
          {/* Continue with Google */}
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        {/* Register Redirect */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-[#006AC2] font-medium hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
