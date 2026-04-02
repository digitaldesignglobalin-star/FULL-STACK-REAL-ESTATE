"use client";

import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";
import { Heart, MapPin, Trash2, Loader2, ChevronRight } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const formatPrice = (price: number) => {
    if (!price) return "Price on Request";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Properties in Wishlist</h2>
            <p className="text-slate-500 mb-6">Start adding properties to your wishlist by clicking the heart icon</p>
            <Link 
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition cursor-pointer"
            >
              Browse Properties
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/dashboard" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={16} />
          <span className="text-slate-800 font-medium">Wishlist</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">My Wishlist</h1>
          <button
            onClick={clearWishlist}
            className="text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer"
          >
            Clear All
          </button>
        </div>

        <p className="text-slate-500 mb-6">{wishlist.length} properties in wishlist</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((property) => (
            <div key={property._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <Link href={`/dashboard/property_details/${property._id}`}>
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={property.images?.[0] || "/noimage.png"}
                    alt={property.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                    {property.status === "ready" ? "Ready to Move" : property.status}
                  </div>
                </div>
              </Link>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-black text-blue-600">{formatPrice(property.price || 0)}</p>
                    <h3 className="font-bold text-slate-800 mt-1">
                      {property.type} {property.bhk ? `• ${property.bhk} BHK` : ""}
                    </h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {property.locality}, {property.city}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Link 
                    href={`/dashboard/property_details/${property._id}`}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-center hover:bg-blue-700 transition text-sm cursor-pointer"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(property._id)}
                    className="px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
