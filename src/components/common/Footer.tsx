"use client";

import React from 'react';
// Keep Lucide for general UI icons
import { 
  Mail, Phone, MapPin, Building2
} from 'lucide-react';
// Import Brand icons from React Icons (Font Awesome)
import { 
  FaFacebookF, 
//   FaTwitter, 
  FaInstagram, 
  FaLinkedinIn 
} from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* --- MAIN FOOTER CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 ">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-5 space-y-6 sm:space-y-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Building2 size={28} />
              </div>
              <span className="text-3xl font-black tracking-tighter italic">ESTATE.</span>
            </div>
            
            <p className="text-sm sm:text-base leading-relaxed text-slate-400 max-w-md mx-auto md:mx-0">
              The premier destination for luxury and commercial real estate. We combine 
              cutting-edge technology with local expertise to help you find the 
              perfect property across India's top metropolitan cities.
            </p>

            {/* Social Icons using React Icons (Fa) */}
            <div className="flex justify-center md:justify-start gap-6">
              <a href="#" className="text-slate-500 hover:text-blue-500 transition-colors duration-300">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-gray-400 transition-colors duration-300">
                <FaXTwitter  size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-pink-500 transition-colors duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-blue-700 transition-colors duration-300">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-3 text-center md:text-left">
            <h4 className="text-white font-bold mb-6 sm:mb-8 text-sm uppercase tracking-[0.2em]">Explore</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['Buy Properties', 'Rent Properties', 'Luxury Villas', 'Commercial Spaces', 'New Launches'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="md:col-span-4 text-center md:text-left">
            <h4 className="text-white font-bold mb-6 sm:mb-8 text-sm uppercase tracking-[0.2em]">Get in Touch</h4>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4">
                <MapPin size={20} className="text-blue-500 shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-bold">Headquarters</p>
                  <p className="text-slate-400">Crystal Tower, Whitefield Road, Bangalore</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4">
                <Phone size={20} className="text-blue-500 shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-bold">Phone Support</p>
                  <p className="text-slate-400">+91 (800) 456-7890</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4">
                <Mail size={20} className="text-blue-500 shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-bold">Email Us</p>
                  <p className="text-slate-400">concierge@estate.com</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- CENTERED BOTTOM LEGAL BAR --- */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col items-center justify-center text-center gap-6">
            
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              © {currentYear} ESTATE REALTY PRIVATE LIMITED.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
              <a href="#" className="hover:text-blue-500 transition-colors">Terms of Usage</a>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
              <a href="#" className="hover:text-blue-500 transition-colors">Cookie Policy</a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}