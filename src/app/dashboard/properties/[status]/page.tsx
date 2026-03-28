"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Heart, Phone, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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

const ITEMS_PER_PAGE = 10;

export default function PropertyStatusPage() {
  const params = useParams();
  const router = useRouter();
  const status = params.status as string;

  const [search, setSearch] = useState("");
  const [locality, setLocality] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bhk, setBhk] = useState("");
  const [minArea, setMinArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("sqft");
  const [type, setType] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [customBhk, setCustomBhk] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery<ApiResponse>({
    queryKey: ["properties", status, search, locality, minPrice, maxPrice, bhk, customBhk, minArea, type, postedBy, page],
    queryFn: async () => {
      const res = await axios.get("/api/auth/property/get", {
        params: {
          status,
          search,
          locality,
          minPrice,
          maxPrice,
          bhk:
            bhk === "Other" && customBhk
              ? customBhk
              : bhk !== "Other"
                ? bhk
                : undefined,
          minArea,
          type,
          postedBy,
          page,
          limit: ITEMS_PER_PAGE,
        },
      });
      return res.data;
    },
  });

  const properties = data?.properties || [];
  const pagination = data?.pagination;

  const handleReset = () => {
    setSearch("");
    setLocality("");
    setMinPrice("");
    setMaxPrice("");
    setBhk("");
    setCustomBhk("");
    setMinArea("");
    setAreaUnit("sqft");
    setType("");
    setPostedBy("");
    setPage(1);
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const renderPageNumbers = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const { page: currentPage, totalPages } = pagination;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((p, idx) =>
      p === "..." ? (
        <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400">...</span>
      ) : (
        <button
          key={p}
          onClick={() => setPage(p as number)}
          className={`min-w-[40px] h-10 px-3 rounded-lg font-semibold transition cursor-pointer ${
            currentPage === p
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          {p}
        </button>
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl px-4 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div
            className="lg:w-72 w-full bg-white rounded-xl p-6 shadow-sm 
            lg:h-[calc(100vh-140px)] lg:sticky lg:top-28 overflow-y-auto"
          >
            <h2 className="font-bold text-lg mb-5">Search Filters</h2>

            <div className="mb-6 relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                placeholder="Search property..."
                value={search}
                onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
                className="border w-full p-2 pl-9 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Locality</p>
              <input
                placeholder="Enter locality"
                value={locality}
                onChange={(e) => handleFilterChange(setLocality)(e.target.value)}
                className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Budget</p>
              <input
                placeholder="Min Price"
                type="number"
                value={minPrice}
                onChange={(e) => handleFilterChange(setMinPrice)(e.target.value)}
                className="border w-full p-2 mb-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
              />
              <input
                placeholder="Max Price"
                type="number"
                value={maxPrice}
                onChange={(e) => handleFilterChange(setMaxPrice)(e.target.value)}
                className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">BHK</p>
              <div className="flex gap-2 flex-wrap">
                {["1", "2", "3", "Other"].map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      handleFilterChange(setBhk)(b);
                      if (b !== "Other") setCustomBhk("");
                    }}
                    className={`border border-gray-400 px-3 py-1 rounded-lg text-sm cursor-pointer ${
                      bhk === b ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              {bhk === "Other" && (
                <input
                  type="number"
                  placeholder="Enter BHK (e.g. 4, 5...)"
                  value={customBhk}
                  onChange={(e) => handleFilterChange(setCustomBhk)(e.target.value)}
                  className="border w-full p-2 mt-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
                />
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Area</p>
              <div className="flex gap-2">
                <input
                  placeholder="Min Area"
                  value={minArea}
                  onChange={(e) => handleFilterChange(setMinArea)(e.target.value)}
                  className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
                />
                <select
                  value={areaUnit}
                  onChange={(e) => handleFilterChange(setAreaUnit)(e.target.value)}
                  className="border p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2] cursor-pointer"
                >
                  <option value="sqft">sq.ft</option>
                  <option value="sqm">sq.m</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Construction Status</p>
              <select
                value={status}
                onChange={(e) => router.push(`/dashboard/properties/${e.target.value}`)}
                className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2] cursor-pointer"
              >
                <option value="new">New Projects</option>
                <option value="launched">Newly Launched</option>
                <option value="ready">Ready to Move</option>
                <option value="under-construction">Under Construction</option>
              </select>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Property Type</p>
              <select
                value={type}
                onChange={(e) => handleFilterChange(setType)(e.target.value)}
                className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2] cursor-pointer"
              >
                <option value="">All</option>
                <option>Flat / Apartment</option>
                <option>Independent House / Villa</option>
                <option>Independent Builder Floor</option>
                <option>Plot / Land</option>
                <option>1RK / Studio Apartment</option>
                <option>Serviced Apartment</option>
                <option>FarmHouse</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Posted By</p>
              <select
                value={postedBy}
                onChange={(e) => handleFilterChange(setPostedBy)(e.target.value)}
                className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2] cursor-pointer"
              >
                <option value="">All</option>
                <option>Owner</option>
                <option>Builder</option>
                <option>Agent</option>
              </select>
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition border border-gray-400 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-6 min-h-[400px]">
            {pagination && (
              <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                  <span className="font-semibold">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{" "}
                  of <span className="font-semibold">{pagination.total}</span> properties
                </p>
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
              </div>
            )}

            {properties.length === 0 ? (
              <div className="flex items-center justify-center h-[400px] text-gray-500 text-lg font-medium">
                No properties match your filters.
              </div>
            ) : (
              <>
                <div className={`transition-opacity ${isFetching ? "opacity-50" : "opacity-100"}`}>
                  {properties.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white rounded-xl shadow-sm flex flex-col md:flex-row gap-6 p-4 hover:shadow-md transition mb-4"
                    >
                      <div className="md:w-[280px] w-full h-[200px] md:h-[180px] rounded-lg overflow-hidden relative">
                        <img
                          src={p.images?.[0] ?? "/noimage.png"}
                          className="w-full h-full object-cover"
                          alt="Property"
                        />
                        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100 transition">
                          <Heart size={16} />
                        </button>
                      </div>

                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {p.bhk} {p.type} in {p.locality}, {p.city}
                          </h2>

                          <div className="flex gap-8 mt-3 items-center flex-wrap">
                            <div>
                              <p className="text-xl font-bold text-black">
                                ₹{p.price?.toLocaleString("en-IN")}
                              </p>
                              <p className="text-xs text-gray-500">
                                ₹{p.pricePerSqft?.toLocaleString("en-IN")} /sqft
                              </p>
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {p.area} {p.areaUnit || "sqft"}
                              </p>
                              <p className="text-xs text-gray-500">Built-up Area</p>
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">{p.bhk} BHK</p>
                              <p className="text-xs text-gray-500">{p.status}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
                          <p className="text-sm text-gray-600">
                            Posted by {p.postedBy || "Owner"}
                          </p>

                          <div className="flex gap-3">
                            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-blue-50 transition">
                              View Number
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 cursor-pointer hover:bg-blue-700 transition">
                              <Phone size={16} />
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 pb-6">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pagination.page === 1 || isFetching}
                      className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>

                    {renderPageNumbers()}

                    <button
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={pagination.page === pagination.totalPages || isFetching}
                      className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      Next
                      <ChevronRight size={18} />
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
