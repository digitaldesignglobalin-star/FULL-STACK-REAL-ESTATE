"use client";

import React, { useState } from 'react';
import { 
  Search, MapPin, ChevronDown, User as UserIcon, 
  Heart, Phone, X, Menu, Bell, ShieldCheck, 
  Building2, ArrowRight 
} from 'lucide-react';

export default function ProfessionalHome() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* --- 1. THE 99ACRES STYLE NAVBAR --- */}
      <nav className="fixed top-0 w-full h-18 bg-[#1a1a1a] text-white z-[100] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tighter cursor-pointer">
            99acres<span className="text-blue-400 font-black">.clone</span>
          </div>

          {/* Navigation Links (Matched to your image) */}
          <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-gray-300">
            <span className="hover:text-white cursor-pointer transition">For Buyers</span>
            <span className="hover:text-white cursor-pointer transition">For Tenants</span>
            <span className="hover:text-white cursor-pointer transition">For Owners</span>
            <span className="hover:text-white cursor-pointer transition">For Dealers / Builders</span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 bg-white text-[#1a1a1a] px-4 py-1.5 rounded-md font-bold text-sm hover:bg-gray-100 transition">
            Post property <span className="bg-green-600 text-white text-[10px] px-1 rounded ml-1">FREE</span>
          </button>
          
          <div className="h-6 w-[1px] bg-gray-700 mx-2 hidden md:block" />

          {/* User Profile / Login */}
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="w-9 h-9 bg-green-200 text-green-800 rounded-full flex items-center justify-center font-bold text-xs hover:ring-2 ring-white/20 transition"
          >
            AB
          </button>
          <ChevronDown size={14} className="text-gray-400 cursor-pointer hidden sm:block" />
          
          <Menu 
            className="text-white cursor-pointer md:ml-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
          />
        </div>
      </nav>

      {/* --- 2. HERO SEARCH SECTION --- */}
      <section className="relative h-[550px] w-full flex items-center justify-center px-4 overflow-hidden">
        {/* Background Overlay Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover brightness-[0.4]" 
            alt="Real Estate" 
          />
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 drop-shadow-lg">
            Find the right property in the right place.
          </h1>

          {/* Search Bar UI */}
          <div className="bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div className="flex-[2] flex items-center px-4 py-3 border-r border-gray-100">
              <MapPin className="text-blue-600 mr-2 shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Enter city, locality or project" 
                className="w-full outline-none text-slate-800 font-medium"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-100">
              <Building2 className="text-blue-600 mr-2" size={18} />
              <select className="w-full bg-transparent outline-none text-slate-500 font-semibold appearance-none">
                <option>Residential</option>
                <option>Commercial</option>
              </select>
            </div>
            <button className="bg-[#005ca8] hover:bg-[#004a87] text-white px-10 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
              <Search size={20} /> Search
            </button>
          </div>
        </div>
      </section>

      {/* --- 3. FEATURED LISTINGS (The Explore Part) --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">New Projects for You</h2>
            <p className="text-slate-500">Curated listings for your dream home</p>
          </div>
          <button className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-56 bg-gray-100">
                <img 
                  src={`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt="Property" 
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-blue-700">
                  VERIFIED BUILDER
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800">Premium Skyline Residency</h3>
                  <span className="text-xl font-black text-slate-900">₹1.2 Cr</span>
                </div>
                <p className="text-slate-500 text-sm flex items-center gap-1 mb-6 italic">
                  <MapPin size={14} /> Whitefield, Bangalore
                </p>
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-[#005ca8] text-[#005ca8] py-2.5 rounded-lg font-bold hover:bg-[#005ca8] hover:text-white transition"
                >
                  <Phone size={16} /> Contact Broker
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 4. LOGIN / PORTAL CHOICE MODAL --- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Access Portal</h2>
                <X className="cursor-pointer text-slate-400" onClick={() => setIsLoginModalOpen(false)} />
              </div>
              
              <p className="text-slate-500 mb-8 font-medium italic">Login to view contact details, manage listings, or approve properties.</p>
              
              <div className="space-y-3">
                <button className="w-full bg-[#005ca8] text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg">
                  Login as Existing User
                </button>
                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] flex-1 bg-slate-100" />
                  <span className="text-xs font-bold text-slate-300">OR REGISTER AS</span>
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </div>
                
                {/* Role-Based Buttons based on your plan */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 border rounded-xl font-bold text-xs hover:bg-slate-50">Builder</button>
                  <button className="p-3 border rounded-xl font-bold text-xs hover:bg-slate-50">Broker</button>
                  <button className="p-3 border rounded-xl font-bold text-xs hover:bg-slate-50">User / Buyer</button>
                  <button className="p-3 border rounded-xl font-bold text-xs hover:bg-slate-50 bg-slate-50">Admin / Staff</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}