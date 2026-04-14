"use client";

import { useState } from "react";
import { Menu, X, Info, Headphones, FileText, Settings, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full h-20 bg-[#1a1a1a] text-white z-[100] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="text-2xl font-bold tracking-tighter cursor-pointer">
            SILVER<span className="text-blue-400 font-black">BRICKS</span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-gray-300">
            <Link href="/dashboard" className="hover:text-white cursor-pointer transition">
              For Buyers
            </Link>
            <Link href="/dashboard/property/for-rent" className="hover:text-white cursor-pointer transition">
              For Tenants
            </Link>
            <Link href="/dashboard/seller" className="hover:text-white cursor-pointer transition">
              For Sellers
            </Link>
            <Link href="/dashboard/builder" className="hover:text-white cursor-pointer transition">
              For Builders
            </Link>
            <Link href="/dashboard/dealer" className="hover:text-white cursor-pointer transition">
              For Dealers
            </Link>
          </div>
        </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/post-property"
              className="hidden sm:flex items-center gap-2 bg-white text-[#1a1a1a] px-4 py-1.5 rounded-md font-bold text-sm hover:bg-gray-100 transition cursor-pointer"
            >
              Post property{" "}
              <span className="bg-green-600 text-white text-[10px] px-1 rounded ml-1">
                FREE
              </span>
            </Link>

          <div className="h-6 w-[1px] bg-gray-700 mx-2 hidden md:block" />

          <button
            className="w-9 h-9 bg-green-200 text-green-800 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            AB
          </button>

          <Menu
            className="text-white cursor-pointer md:ml-2"
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      </nav>

      {/* --- SIDEBAR MENU --- */}
      <div
        className={`fixed inset-0 z-[150] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <X
                className="cursor-pointer text-slate-500"
                onClick={() => setIsMenuOpen(false)}
              />
            </div>

            <div className="flex flex-col gap-4 lg:hidden pb-6 border-b mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Navigation
              </p>
              <Link 
                href="/dashboard/wishlist"
                className="flex items-center gap-3 text-slate-800 font-semibold hover:text-blue-600 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={18} className="text-red-500" /> Wishlist
              </Link>
              <Link 
                href="/dashboard"
                className="text-slate-800 font-semibold hover:text-blue-600 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                For Buyers
              </Link>
              <Link 
                href="/dashboard/property/for-rent"
                className="text-slate-800 font-semibold hover:text-blue-600 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                For Tenants
              </Link>
              <Link 
                href="/dashboard/seller"
                className="text-slate-800 font-semibold hover:text-blue-600 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                For Sellers
              </Link>
              <Link 
                href="/dashboard/builder"
                className="text-slate-800 font-semibold hover:text-blue-600 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                For Builders
              </Link>
              <Link 
                href="/dashboard/dealer"
                className="text-slate-800 font-semibold hover:text-blue-600 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                For Dealers
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                General Info
              </p>
              <Link 
                href="/dashboard/wishlist"
                className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={18} className="text-red-500" /> Wishlist
              </Link>
              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium">
                <Info size={18} /> About 99acres Clone
              </div>
              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium">
                <Headphones size={18} /> Help & Support
              </div>
              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium">
                <FileText size={18} /> Terms & Privacy Policy
              </div>
              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium">
                <Settings size={18} /> Account Settings
              </div>
            </div>

            <div className="mt-auto pt-6 border-t">
              <button
                onClick={() => signOut({ callbackUrl: "/welcome" })}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-500/10 text-red-600 hover:bg-red-500/50 transition-colors cursor-pointer border border-red-700/50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- LOGIN MODAL --- */}
    </>
  );
}
