"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Heart, Phone, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function PropertyStatusPage() {
  const params = useParams();
  const router = useRouter();
  const status = params.status as string;

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const load = async () => {
      try {
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
          },
        });

        setProperties(res.data);

        // const filtered = res.data.filter((p: any) => p.status === status);

        // setProperties(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [
    status,
    search,
    locality,
    minPrice,
    maxPrice,
    bhk,
    customBhk,
    minArea,
    type,
    postedBy,
  ]);

  // const filteredProperties = properties.filter((p) => {
  //   const price = Number(p.price);
  //   let area = Number(p.area);

  //   if (areaUnit === "sqm") area = area * 10.7639;

  //   if (search) {
  //     const q = search.toLowerCase();
  //     if (
  //       !p.city?.toLowerCase().includes(q) &&
  //       !p.locality?.toLowerCase().includes(q) &&
  //       !p.type?.toLowerCase().includes(q)
  //     )
  //       return false;
  //   }

  //   if (locality && !p.locality?.toLowerCase().includes(locality.toLowerCase()))
  //     return false;

  //   if (minPrice && price < Number(minPrice)) return false;
  //   if (maxPrice && price > Number(maxPrice)) return false;

  //   if (bhk) {
  //     if (bhk === "4+" && Number(p.bhk) < 4) return false;
  //     if (bhk !== "4+" && Number(p.bhk) !== Number(bhk)) return false;
  //   }

  //   if (minArea && area < Number(minArea)) return false;

  //   if (type && p.type !== type) return false;
  //   if (postedBy && p.postedBy !== postedBy) return false;

  //   return true;
  // });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading properties...
      </div>
    );
  }

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
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl px-4 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* FILTER SIDEBAR */}
          <div
            className="lg:w-72 w-full bg-white rounded-xl p-6 shadow-sm 
            lg:h-[calc(100vh-140px)] lg:sticky lg:top-28 overflow-y-auto"
          >
            <h2 className="font-bold text-lg mb-5">Search Filters</h2>

            {/* SEARCH */}
            <div className="mb-6 relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                placeholder="Search property..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border w-full p-2 pl-9 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2] "
              />
            </div>

            {/* LOCALITY */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Locality</p>
              <input
                placeholder="Enter locality"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
              />
            </div>

            {/* BUDGET */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Budget</p>

              <input
                placeholder="Min Price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border w-full p-2 mb-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
              />

              <input
                placeholder="Max Price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2] "
              />
            </div>

            {/* BHK */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">BHK</p>

              <div className="flex gap-2 flex-wrap">
                {["1", "2", "3", "Other"].map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setBhk(b);
                      if (b !== "Other") setCustomBhk(""); // reset custom input
                    }}
                    className={`border border-gray-400 px-3 py-1 rounded-lg text-sm cursor-pointer${
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
                  onChange={(e) => setCustomBhk(e.target.value)}
                  className="border w-full p-2 mt-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2]"
                />
              )}
            </div>

            {/* AREA */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Area</p>

              <div className="flex gap-2">
                <input
                  placeholder="Min Area"
                  value={minArea}
                  onChange={(e) => setMinArea(e.target.value)}
                  className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2] "
                />

                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value)}
                  className="border p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2] cursor-pointer"
                >
                  <option value="sqft">sq.ft</option>
                  <option value="sqm">sq.m</option>
                </select>
              </div>
            </div>

            {/* CONSTRUCTION STATUS */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Construction Status</p>

              <select
                value={status}
                onChange={(e) =>
                  router.push(`/dashboard/properties/${e.target.value}`)
                }
                className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2] cursor-pointer"
              >
                <option value="new">New Projects</option>
                <option value="launched">Newly Launched</option>
                <option value="ready">Ready to Move</option>
                <option value="under-construction">Under Construction</option>
              </select>
            </div>

            {/* PROPERTY TYPE */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Property Type</p>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
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

            {/* POSTED BY */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Posted By</p>

              <select
                value={postedBy}
                onChange={(e) => setPostedBy(e.target.value)}
                className="border w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006AC2] cursor-pointer"
              >
                <option value="">All</option>
                <option>Owner</option>
                <option>Builder</option>
                <option>Agent</option>
              </select>
            </div>

            {/* RESET BUTTON */}
            <button
              onClick={handleReset}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition border border-gray-400 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          {/* PROPERTY LIST */}
          <div className="flex-1 flex flex-col gap-6 min-h-[400px]">
            {properties.length === 0 ? (
              <div className="flex items-center justify-center h-[400px] text-gray-500 text-lg font-medium">
                No properties match your filters.
              </div>
            ) : (
              properties.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl shadow-sm flex flex-col md:flex-row gap-6 p-4 hover:shadow-md transition"
                >
                  <div className="md:w-[280px] w-full h-[200px] md:h-[180px] rounded-lg overflow-hidden relative">
                    <img
                      src={p.images?.[0] ?? "/noimage.png"}
                      className="w-full h-full object-cover"
                    />

                    <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
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
                            ₹{p.price}
                          </p>
                          <p className="text-xs text-gray-500 ">
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
                          <p className="font-semibold text-gray-800">
                            {p.bhk} BHK
                          </p>
                          <p className="text-xs text-gray-500">{p.status}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
                      <p className="text-sm text-gray-600">
                        Posted by {p.postedBy || "Owner"}
                      </p>

                      <div className="flex gap-3">
                        <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-semibold cursor-pointer">
                          View Number
                        </button>

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 cursor-pointer">
                          <Phone size={16} />
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
