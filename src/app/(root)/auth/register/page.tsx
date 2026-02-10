"use client";

import { useState, FormEvent, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      name.trim().length >= 3 && isValidEmail(email) && password.length >= 6
    );
  }, [name, email, password]);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    setLoading(true);

    const toastId = toast.loading("Creating account...");

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      toast.success(res.data?.message || "Account created successfully!", {
        id: toastId,
      });

      setName("");
      setEmail("");
      setPassword("");

      console.log(res.data);

      // if (!res.ok) {
      //   alert(data.message || "Something went wrong");
      // } else {
      //   alert("Account created successfully!");
      // }
    } catch (error) {
      console.error(error);

      // alert("Server error");
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative flex items-center justify-center px-4">
      {/* Back Button - Extreme Top Left */}
      <div className="absolute top-3 left-3">
        <Link
          href="/"
          className="text-sm font-medium text-[#006AC2] hover:underline"
        >
          ← Back
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border-[1px] border-[#006AC2]">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-[#006AC2]">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Join our real estate platform today
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
          />

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#006AC2]"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google Button */}
        <button className="w-full border border-[#808080ad] py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Continue with Google
        </button>

        {/* Login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#006AC2] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
