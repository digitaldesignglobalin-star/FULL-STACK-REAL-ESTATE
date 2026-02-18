"use client";

import { useState } from "react";
import { Menu, X, Info, Headphones, FileText, Settings } from "lucide-react";

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full h-20 bg-[#1a1a1a] text-white z-[100] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="text-2xl font-bold tracking-tighter cursor-pointer">
            99acres<span className="text-blue-400 font-black">.clone</span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-gray-300">
            <span className="hover:text-white cursor-pointer transition">For Buyers</span>
            <span className="hover:text-white cursor-pointer transition">For Tenants</span>
            <span className="hover:text-white cursor-pointer transition">For Owners</span>
            <span className="hover:text-white cursor-pointer transition">For Dealers / Builders</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 bg-white text-[#1a1a1a] px-4 py-1.5 rounded-md font-bold text-sm hover:bg-gray-100 transition cursor-pointer">
            Post property <span className="bg-green-600 text-white text-[10px] px-1 rounded ml-1">FREE</span>
          </button>

          <div className="h-6 w-[1px] bg-gray-700 mx-2 hidden md:block" />

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-9 h-9 bg-green-200 text-green-800 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            AB
          </button>

          <Menu className="text-white cursor-pointer md:ml-2" onClick={() => setIsMenuOpen(true)} />
        </div>
      </nav>

      {/* --- SIDEBAR MENU --- */}
      <div className={`fixed inset-0 z-[150] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />

        <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 flex flex-col h-full">

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <X className="cursor-pointer text-slate-500" onClick={() => setIsMenuOpen(false)} />
            </div>

            <div className="flex flex-col gap-4 lg:hidden pb-6 border-b mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navigation</p>
              <span className="text-slate-800 font-semibold hover:text-blue-600 cursor-pointer">For Buyers</span>
              <span className="text-slate-800 font-semibold hover:text-blue-600 cursor-pointer">For Tenants</span>
              <span className="text-slate-800 font-semibold hover:text-blue-600 cursor-pointer">For Owners</span>
              <span className="text-slate-800 font-semibold hover:text-blue-600 cursor-pointer">For Dealers / Builders</span>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">General Info</p>
              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium"><Info size={18}/> About 99acres Clone</div>
              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium"><Headphones size={18}/> Help & Support</div>
              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium"><FileText size={18}/> Terms & Privacy Policy</div>
              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium"><Settings size={18}/> Account Settings</div>
            </div>

          </div>
        </div>
      </div>

      {/* --- LOGIN MODAL --- */}
            {isLoginModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)}>
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-8" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Access Portal</h2>
                    <X className="cursor-pointer text-slate-400" onClick={() => setIsLoginModalOpen(false)} />
                  </div>
                  <div className="space-y-3">
                    <button className="w-full bg-[#005ca8] text-white py-4 rounded-xl font-bold">Login as Existing User</button>
                    <div className="grid grid-cols-2 gap-3">
                      {['Builder', 'Broker', 'User', 'Admin'].map(r => <button key={r} className="p-3 border rounded-xl font-bold text-xs hover:bg-slate-50">{r}</button>)}
                    </div>
                  </div>
                </div>
              </div>
            )}
    </>
  );
}
