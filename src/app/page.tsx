"use client";

import React, { useState, useRef, RefObject } from 'react';
import { 
  Search, MapPin, ChevronDown, User as UserIcon, 
  Heart, Phone, X, Menu, Bell, ShieldCheck, 
  Building2, ArrowRight, ChevronLeft, ChevronRight,
  Info, Headphones, FileText, Settings, SlidersHorizontal,
  Check
} from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

// --- Types for TypeScript ---
interface PropertyCardProps {
  item: number;
}

interface SectionProps {
  title: string;
  subtitle: string;
  scrollRef: RefObject<HTMLDivElement | null>;
  items: number[];
}

export default function ProfessionalHome() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- Filter States for Reset Logic ---
  const [activePropertyType, setActivePropertyType] = useState<string>('Residential');
  const [purpose, setPurpose] = useState<string>('Buy');
  const [status, setStatus] = useState<string>('Ready to Move');
  const [resType, setResType] = useState<string>('Apartment');
  const [rooms, setRooms] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleReset = () => {
    setActivePropertyType('Residential');
    setPurpose('Buy');
    setStatus('Ready to Move');
    setResType('Apartment');
    setRooms('');
    setMinPrice('');
    setMaxPrice('');
    // Stays open as requested
  };

  // --- Type-Safe Scroll Logic ---
  const scroll = (ref: RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const newProjectsRef = useRef<HTMLDivElement>(null);
  const newlyLaunchedRef = useRef<HTMLDivElement>(null);
  const underConstructionRef = useRef<HTMLDivElement>(null);
  const readyToMoveRef = useRef<HTMLDivElement>(null);

  // --- Property Card Component ---
  const PropertyCard: React.FC<PropertyCardProps> = ({ item }) => (
    <div className="min-w-[280px] sm:min-w-[300px] md:min-w-[320px] bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group mb-2">
      <div className="relative h-40 sm:h-44 bg-gray-100">
        <img 
          src={item % 2 === 0 ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600" : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt="Property" 
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-blue-700">
          VERIFIED BUILDER
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="mb-1">
          <span className="text-lg sm:text-xl font-black text-slate-900">₹1.2 Cr - 2.5 Cr</span>
        </div>
        <h3 className="font-bold text-sm sm:text-md text-slate-800 truncate">Premium Skyline Residency {item}</h3>
        <p className="text-slate-500 text-[10px] sm:text-xs flex items-center gap-1 mb-3 sm:mb-4 italic">
          <MapPin size={12} /> Whitefield, Bangalore
        </p>
        <div className="flex gap-2">
          <button onClick={() => setIsLoginModalOpen(true)} className="flex-1 flex items-center justify-center gap-1 sm:gap-2 border-2 border-[#005ca8] text-[#005ca8] py-2 rounded-lg font-bold hover:bg-[#005ca8] hover:text-white transition text-[11px] sm:text-sm cursor-pointer">
            <Phone size={14} /> Contact
          </button>
          <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-bold hover:bg-slate-200 transition text-[11px] sm:text-sm cursor-pointer">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  const PropertySection: React.FC<SectionProps> = ({ title, subtitle, scrollRef, items }) => (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative group">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-6 gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline cursor-pointer">
          View All <ArrowRight size={16} />
        </button>
      </div>
      <div className="relative">
        <button onClick={() => scroll(scrollRef, 'left')} className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full border opacity-0 group-hover:opacity-100 transition hidden lg:block cursor-pointer">
          <ChevronLeft size={24} />
        </button>
        <div ref={scrollRef} className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {items.map((i) => <PropertyCard key={i} item={i} />)}
        </div>
        <button onClick={() => scroll(scrollRef, 'right')} className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full border opacity-0 group-hover:opacity-100 transition hidden lg:block cursor-pointer">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">


              {/* --- 1. NAVBAR --- */}

      {/* <nav className="fixed top-0 w-full h-20 bg-[#1a1a1a] text-white z-[100] px-4 md:px-8 flex items-center justify-between">

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

          <button className="hidden sm:flex items-center gap-2 bg-white text-[#1a1a1a] px-4 py-1.5 rounded-md font-bold text-sm hover:bg-gray-100 transition">

            Post property <span className="bg-green-600 text-white text-[10px] px-1 rounded ml-1">FREE</span>

          </button>

          <div className="h-6 w-[1px] bg-gray-700 mx-2 hidden md:block" />

          <button onClick={() => setIsLoginModalOpen(true)} className="w-9 h-9 bg-green-200 text-green-800 rounded-full flex items-center justify-center font-bold text-xs">AB</button>

          <Menu className="text-white cursor-pointer md:ml-2" onClick={() => setIsMenuOpen(true)} />

        </div>

      </nav> */}

      {/* --- SIDEBAR MENU --- */}

      {/* <div className={`fixed inset-0 z-[150] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>

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

              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium"><Info size={18} /> About 99acres Clone</div>

              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium"><Headphones size={18} /> Help & Support</div>

              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium"><FileText size={18} /> Terms & Privacy Policy</div>

              <div className="flex items-center gap-3 text-slate-700 hover:text-blue-600 cursor-pointer font-medium"><Settings size={18} /> Account Settings</div>

            </div>

          </div>

        </div>

      </div> */}

      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[500px] sm:h-[650px] w-full flex items-center justify-center px-4 overflow-visible z-50 pt-20">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000" className="w-full h-full object-cover brightness-[0.4]" alt="Real Estate" />
        </div>
        
        <div className="relative z-[60] max-w-5xl w-full text-center text-white">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 drop-shadow-lg px-2">Find the right property in the right place.</h1>
          
          <div className="bg-white p-2 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl mx-auto relative overflow-visible">
            <div className="flex flex-col md:flex-row gap-1 sm:gap-2">
              <div className="flex-[2] flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100 text-slate-800">
                <MapPin className="text-blue-600 mr-2 shrink-0" size={20} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter city, locality or project" 
                  className="w-full outline-none text-slate-800 font-medium placeholder:text-slate-400 text-sm sm:text-base" 
                />
              </div>
              
              <div className="flex-1 flex items-center px-4 py-3 cursor-pointer hover:bg-slate-50 rounded-lg text-slate-800 transition" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <SlidersHorizontal className="text-blue-600 mr-2 shrink-0" size={18} />
                <span className="font-bold text-xs sm:text-sm">Advance Filters</span>
                <ChevronDown className={`ml-auto transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} size={16} />
              </div>

              <button className="bg-[#005ca8] text-white px-6 md:px-10 py-3 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-[#004b8a] shadow-lg text-sm sm:text-base">
                <Search size={20} /> Search
              </button>
            </div>

            {/* --- ADVANCED FILTER PANEL --- */}
            {isFilterOpen && (
              <div className="absolute top-[102%] left-0 w-full bg-white rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 sm:p-8 text-left border border-slate-200 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 sm:gap-y-8">
                  
                  <div className="sm:col-span-2">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">1. Property Category</label>
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      {['Residential', 'Commercial', 'Land', 'Industrial'].map(t => (
                        <button key={t} onClick={() => { setActivePropertyType(t); setResType(''); setRooms(''); }} className={`px-4 sm:px-6 py-2.5 border rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer shadow-sm ${activePropertyType === t ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-600 bg-white border-slate-400 hover:bg-slate-50 hover:border-slate-400'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Property Purpose</label>
                    <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2.5 outline-none text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm">
                      <option>Buy</option><option>Rent</option><option>Lease</option>
                      {activePropertyType === 'Residential' && <option>PG / Co-living</option>}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2.5 outline-none text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm">
                      {activePropertyType === 'Land' ? <><option>Available</option><option>Sold Out</option></> : <><option>Ready to Move</option><option>Under Construction</option><option>New Launch</option></>}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Type</label>
                    <select value={resType} onChange={(e) => setResType(e.target.value)} className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2.5 outline-none text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm">
                      {activePropertyType === 'Residential' && <><option>Apartment</option><option>Villa / Bungalow</option><option>Penthouse</option></>}
                      {activePropertyType === 'Land' && <><option>Residential Plot</option><option>Commercial Plot</option></>}
                      {activePropertyType === 'Commercial' && <><option>Office Space</option><option>Retail Shop</option></>}
                      {activePropertyType === 'Industrial' && <><option>Warehouse</option><option>Factory</option></>}
                    </select>
                  </div>

                  {activePropertyType !== 'Land' && (
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Rooms (BHK)</label>
                      <div className="flex gap-1.5 sm:gap-2">
                        {['1', '2', '3', '4+'].map(r => (
                          <button key={r} onClick={() => setRooms(r)} className={`flex-1 h-10 border rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center cursor-pointer shadow-sm ${rooms === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-400 text-slate-600 hover:border-blue-600'}`}>{r}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={activePropertyType === 'Land' ? "sm:col-span-2" : "sm:col-span-1"}>
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Budgets (₹)</label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 text-slate-800 shadow-sm" />
                      <span className="text-slate-400 font-bold">-</span>
                      <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-full bg-white border border-slate-400 rounded-lg px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 text-slate-800 shadow-sm" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-3 pt-4 sm:pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button onClick={handleReset} className="text-xs sm:text-sm font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 transition cursor-pointer">
                    <X size={14}/> Reset Options
                  </button>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setIsFilterOpen(false)} className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-50 transition cursor-pointer border border-slate-400">Cancel</button>
                    <button onClick={() => setIsFilterOpen(false)} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                      Apply Changes <Check size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- CONTENT CATEGORIES (Always Visible) --- */}
      <div className="py-4 sm:py-8 bg-white relative z-10">
        <PropertySection title="New Projects for You" subtitle="Curated listings for your dream home" scrollRef={newProjectsRef} items={[1, 2, 3, 4, 5, 6]} />
        <PropertySection title="Newly Launched Properties" subtitle="Freshly added projects" scrollRef={newlyLaunchedRef} items={[7, 8, 9, 10, 11, 12]} />
        <PropertySection title="Ready to Move" subtitle="Move into your new home today" scrollRef={readyToMoveRef} items={[13, 14, 15, 16, 17, 18]} />
        <PropertySection title="Under Construction" subtitle="Great investment opportunities" scrollRef={underConstructionRef} items={[19, 20, 21, 22, 23, 24]} />
      </div>

      {/* --- LOGIN MODAL --- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)}>
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Access Portal</h2>
              <X className="cursor-pointer text-slate-400" onClick={() => setIsLoginModalOpen(false)} />
            </div>
            <div className="space-y-3">
              <button className="w-full bg-[#005ca8] text-white py-3 sm:py-4 rounded-xl font-bold cursor-pointer text-sm sm:text-base">Login as Existing User</button>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {['Builder', 'Broker', 'User', 'Admin'].map(r => <button key={r} className="p-2 sm:p-3 border rounded-xl font-bold text-[10px] sm:text-xs hover:bg-slate-50 cursor-pointer">{r}</button>)}
              </div>
            </div>
          </div>
        </div>
      )}

<Footer/>

    </div>
  );
}