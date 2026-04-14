"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Heart, Phone, Search, ChevronLeft, ChevronRight, Loader2, MapPin } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import LocationSearch from "@/components/common/LocationSearch";

interface Property {
  _id: string;
  images?: string[];
  bhk: number;
  type: string;
  locality: string;
  city: string;
  price: number;
  pricePerSqft?: number;
  area?: number;
  areaUnit?: string;
  status: string;
  postedBy?: string;
  bed?: string;
  bath?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  properties: Property[];
  pagination: PaginationInfo;
}

const ITEMS_PER_PAGE = 12;

export default function PropertiesByStatusPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = params.status as string;
  const purposeParam = searchParams.get("purpose");

  const [search, setSearch] = useState("");
  const [locality, setLocality] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bhk, setBhk] = useState("");
  const [minArea, setMinArea] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [propertiesData, setPropertiesData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [purposeFilter, setPurposeFilter] = useState<string>("rent");

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      
      let url = "/api/auth/property/get?";
      
      if (statusParam === "for-rent") {
        url += "status=for-rent";
        if (purposeFilter === "rent") {
          url += "&purpose=rent";
        } else if (purposeFilter === "pg") {
          url += "&purpose=pg";
        }
      } else if (statusParam === "featured") {
        url += "featured=true";
      } else if (statusParam) {
        url += `status=${statusParam}`;
      }
      
      if (search) url += `&search=${search}`;
      if (locality) url += `&locality=${locality}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (bhk) url += `&bhk=${bhk}`;
      if (minArea) url += `&minArea=${minArea}`;
      if (type) url += `&type=${type}`;
      url += `&page=${page}&limit=${ITEMS_PER_PAGE}`;
      
      try {
        const res = await axios.get(url, { 
          headers: { 'Cache-Control': 'no-cache' } 
        });
        setPropertiesData(res.data);
      } catch (err) {
        console.error("Failed to fetch properties", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProperties();
  }, [statusParam, search, locality, minPrice, maxPrice, bhk, minArea, type, page, purposeFilter]);

  const properties = propertiesData?.properties || [];
  const pagination = propertiesData?.pagination;

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistClick = (e: React.MouseEvent, property: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(property._id)) {
      removeFromWishlist(property._id);
    } else {
      addToWishlist({
        _id: property._id,
        type: property.type,
        locality: property.locality,
        city: property.city,
        price: property.price,
        bhk: property.bhk,
        images: property.images,
        status: property.status,
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
    return price.toLocaleString();
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case "new": return "New Projects";
      case "launched": return "Just Launched";
      case "ready": return "Ready to Move";
      case "under-construction": return "Under Construction";
      case "featured": return "Featured Properties";
      case "rent":
      case "for-rent": return "Properties for Rent / PG";
      default: return "Properties";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/dashboard" className="hover:text-blue-600 cursor-pointer">Home</Link>
            <ChevronRight size={16} />
            <span className="text-gray-800">Properties</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{getStatusTitle(statusParam)}</h1>
          <p className="text-slate-500 mb-4">Browse through {pagination?.total || 0} properties</p>
          
          {statusParam === "for-rent" && (
            <div className="flex gap-2">
              <button
                onClick={() => setPurposeFilter("rent")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  purposeFilter === "rent" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white border border-slate-300 text-slate-700 hover:border-blue-500"
                }`}
              >
                For Rent
              </button>
              <button
                onClick={() => setPurposeFilter("pg")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  purposeFilter === "pg" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white border border-slate-300 text-slate-700 hover:border-blue-500"
                }`}
              >
                PG / Co-living
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 bg-white rounded-xl p-5 shadow-sm h-fit">
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Search</label>
                <LocationSearch
                  value={search}
                  onChange={setSearch}
                  onSelect={() => setPage(1)}
                  placeholder="Search city, locality..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Property Type</label>
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm cursor-pointer"
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Plot">Plot</option>
                  <option value="Flat">Flat</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">BHK</label>
                <div className="flex gap-1">
                  {["1", "2", "3", "4", "5"].map((b) => (
                    <button
                      key={b}
                      onClick={() => { setBhk(bhk === b ? "" : b); setPage(1); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                        bhk === b ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-300 hover:border-blue-500"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Budget (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    placeholder="Min"
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    placeholder="Max"
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Min Area (sq.ft)</label>
                <input
                  type="number"
                  value={minArea}
                  onChange={(e) => { setMinArea(e.target.value); setPage(1); }}
                  placeholder="Min area"
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <button
                onClick={() => { setSearch(""); setType(""); setBhk(""); setMinPrice(""); setMaxPrice(""); setMinArea(""); setPage(1); }}
                className="w-full py-2 text-sm font-bold text-slate-500 hover:text-red-500 border border-slate-300 rounded-lg cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-slate-500 text-lg">No properties found</p>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {properties.map((property) => (
                    <Link href={`/dashboard/property_details/${property._id}`} key={property._id}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                        <div className="relative h-48 bg-gray-100">
                          <img
                            src={property.images?.[0] || "/noimage.png"}
                            alt={property.type}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                            {property.status === "ready" ? "Ready to Move" : property.status}
                          </div>
                          <button 
                            onClick={(e) => handleWishlistClick(e, property)}
                            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white cursor-pointer"
                          >
                            <Heart 
                              size={16} 
                              className={isInWishlist(property._id) ? "fill-red-500 text-red-500" : "text-slate-600"} 
                            />
                          </button>
                        </div>
                        <div className="p-4">
                          <p className="text-xl font-black text-blue-600">₹{formatPrice(property.price)}</p>
                          <h3 className="font-bold text-slate-800 mt-1">{property.type} {property.bhk ? `• ${property.bhk} BHK` : ""}</h3>
                          <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                            <MapPin size={14} /> {property.locality}, {property.city}
                          </p>
                          <div className="flex gap-3 mt-3 text-xs text-slate-500">
                            <span>{property.area} sq.ft.</span>
                            {property.bed && <span>{property.bed} Bed</span>}
                            {property.bath && <span>{property.bath} Bath</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold cursor-pointer ${
                          page === p ? "bg-blue-600 text-white" : "border border-slate-300 hover:border-blue-500"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
