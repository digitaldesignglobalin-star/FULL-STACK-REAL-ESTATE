"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Heart, Phone, Search, ChevronLeft, ChevronRight, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";

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

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [locality, setLocality] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bhk, setBhk] = useState("");
  const [minArea, setMinArea] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery<ApiResponse>({
    queryKey: ["properties", "all", search, locality, minPrice, maxPrice, bhk, minArea, type, page],
    queryFn: async () => {
      const res = await axios.get("/api/auth/property/get", {
        params: {
          search,
          locality,
          minPrice,
          maxPrice,
          bhk,
          minArea,
          type,
          page,
          limit: ITEMS_PER_PAGE,
        },
      });
      return res.data;
    },
  });

  const properties = data?.properties || [];
  const pagination = data?.pagination;

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistClick = (e: React.MouseEvent, property: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(property._id)) {
      removeFromWishlist(property._id);
    } else {
      addToWishlist(property);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `${(price / 100000).toFixed(1)}L`;
    return price.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      placeholder="Search by city, locality"
                      className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Locality</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => { setLocality(e.target.value); setPage(1); }}
                    placeholder="Enter locality"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Budget</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                      placeholder="Min"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                      placeholder="Max"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">BHK</label>
                  <select
                    value={bhk}
                    onChange={(e) => { setBhk(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">Select BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Property Type</label>
                  <select
                    value={type}
                    onChange={(e) => { setType(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Builder Floor">Builder Floor</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>

                <button
                  onClick={() => { setSearch(""); setType(""); setBhk(""); setMinPrice(""); setMaxPrice(""); setMinArea(""); setPage(1); }}
                  className="w-full py-2 text-sm text-slate-600 hover:text-red-500 transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">All Properties</h1>
              <span className="text-slate-500 text-sm">
                {pagination?.total || 0} properties found
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">No properties found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {properties.map((property) => (
                    <Link
                      key={property._id}
                      href={`/dashboard/property_details/${property._id}`}
                      className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group"
                    >
                      <div className="relative h-48 bg-gray-100">
                        <img
                          src={property.images?.[0] || "/noimage.png"}
                          alt={property.type}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <button
                          onClick={(e) => handleWishlistClick(e, property)}
                          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition cursor-pointer"
                        >
                          <Heart
                            size={18}
                            className={isInWishlist(property._id) ? "fill-red-500 text-red-500" : "text-slate-600"}
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl font-black text-blue-600">
                            ₹{formatPrice(property.price)}
                          </span>
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                            {property.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 truncate">
                          {property.type} {property.bhk ? `${property.bhk} BHK` : ""}
                        </h3>
                        <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                          <MapPin size={14} />
                          {property.locality}, {property.city}
                        </p>
                        {property.area && (
                          <p className="text-slate-500 text-sm mt-2">
                            {property.area} {property.areaUnit || "sq.ft."}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={pagination.page === 1}
                      className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-slate-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
