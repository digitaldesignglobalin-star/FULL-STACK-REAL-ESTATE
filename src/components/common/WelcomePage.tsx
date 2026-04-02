import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  MapPin,
  Sparkles,
  ShieldCheck,
  UserPlus,
  LogIn,
} from "lucide-react";
import Link from "next/link";

export default function RealEstateWelcome() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#005CA8] selection:text-white overflow-x-hidden">
      {/* Dynamic Background Gradient Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-[#005CA8]/5 blur-[120px]" />
        <div className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[#005CA8]/10 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full border border-b-slate-300">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-[#005CA8] rounded-xl shadow-lg shadow-[#005CA8]/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            ESTATE<span className="text-[#005CA8]">PORTAL</span>
          </span>
        </div>

        {/* Auth Actions Only */}
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-[#005CA8] font-bold gap-2 cursor-pointer border border-slate-600 rounded-xl px-6 py-5 shadow-lg shadow-slate-600/20"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-[#005CA8] hover:bg-[#004a87] text-white rounded-xl px-6 py-5 shadow-lg shadow-[#005CA8]/20 font-bold gap-2 cursor-pointer">
              <UserPlus className="w-4 h-4" />
              Join Now
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 mb-8">
              <Sparkles className="w-4 h-4 text-[#005CA8]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#005CA8]">
                Private Client Access
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005CA8] to-blue-400">
                Next Chapter.
              </span>
            </h1>

            <p className="text-xl text-slate-500 mb-10 max-w-md leading-relaxed font-medium">
              Welcome to your professional real estate dashboard. Access
              exclusive listings, market analytics, and premium portfolio
              management in one secure location.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-[#005CA8] hover:bg-[#004a87] text-white h-16 px-10 rounded-2xl text-lg font-bold group shadow-2xl shadow-[#005CA8]/30 cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {/* <div className="flex items-center px-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#005CA8] mr-2" />
                <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                  Bank-Level Security
                </span>
              </div> */}
            </div>

            {/* Platform Stats */}
            <div className="mt-16 pt-10 border-t border-slate-400 flex items-center gap-12">
              <div className="border border-slate-600 rounded-2xl px-4 py-6 ">
                <p className="text-2xl font-black text-slate-900">4.9/5</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  User Rating
                </p>
              </div>
              <div className="w-[1px] h-10 bg-slate-800" />
              <div className="border border-slate-600 rounded-2xl px-4 py-6 ">
                <p className="text-2xl font-black text-slate-900">24/7</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Expert Support
                </p>
              </div>
            </div>
          </div>

          {/* Visual Presentation */}
          <div className="relative group order-1 lg:order-2">
            {/* Soft Glow Background */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-[#005CA8] to-cyan-300 opacity-10 blur-[80px] rounded-full" />

            <div className="relative rounded-[3rem] overflow-hidden border-[1px] border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,92,168,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                alt="Modern Corporate Building"
                className="w-full h-[550px] object-cover scale-100 group-hover:scale-105 transition-transform duration-1000"
              />

              {/* Floating Dashboard Element */}
              <div className="absolute top-10 right-10 z-20 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-2xl flex items-center gap-4 animate-bounce-slow">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <ArrowRight className="text-white w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                    Market Value
                  </p>
                  <p className="text-slate-900 font-black">+12.5% YoY</p>
                </div>
              </div>

              {/* Property Tag */}
              <div className="absolute bottom-10 left-10 z-20 flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="text-[#005CA8] w-6 h-6" />
                </div>
                <div className="text-white">
                  <p className="font-bold text-lg leading-none">Global HQ</p>
                  <p className="text-white/80 text-xs">
                    Financial District, NY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
          <p className="text-xs font-medium uppercase tracking-[0.2em]">
            © 2026 ESTATECORE PRO — Premium Client Terminal
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-[#005CA8] transition-colors cursor-pointer">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#005CA8] transition-colors cursor-pointer">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
