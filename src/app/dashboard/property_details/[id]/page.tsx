"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Share2,
  Heart,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  MessageSquare,
  Image as ImageIcon,
  Maximize,
  Loader2,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWishlist } from "@/hooks/useWishlist";

interface Property {
  _id: string;
  purpose?: string;
  category?: string;
  type?: string;
  city?: string;
  locality?: string;
  bhk?: number;
  bed?: string;
  bath?: string;
  bal?: string;
  furnish?: string;
  age?: string;
  area?: number;
  areaUnit?: string;
  price?: number;
  pricePerSqft?: number;
  deposit?: string;
  maintenance?: string;
  description?: string;
  ownership?: string;
  negotiable?: string;
  broker?: string;
  images: string[];
  status: string;
  postedBy?: {
    _id: string;
    name?: string;
    email?: string;
    mobile?: string;
  };
  createdAt?: string;
}

const PropertyDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const isLiked = property ? isInWishlist(property._id) : false;

  const toggleWishlist = () => {
    if (!property) return;
    if (isLiked) {
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

  const handleShare = async () => {
    if (!property) return;
    const shareData = {
      title: `${property.type} ${property.bhk ? `in ${property.bhk} BHK` : ""}`,
      text: `Check out this property: ${property.locality}, ${property.city} - ${formatPrice(property.price || 0)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const res = await axios.get(`/api/property_details/${id}`);
        setProperty(res.data.property);
        setError("");
      } catch (err: any) {
        console.error("Error fetching property:", err);
        setError(err.response?.data?.error || "Property not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const formatPrice = (price: number) => {
    if (!price) return "Price on Request";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ready":
        return "Ready to Move";
      case "new":
        return "New Property";
      case "launched":
        return "Just Launched";
      case "under-construction":
        return "Under Construction";
      default:
        return status;
    }
  };

  const getPurposeLabel = (purpose: string) => {
    switch (purpose) {
      case "sell":
        return "For Sale";
      case "rent":
        return "For Rent";
      case "lease":
        return "For Lease";
      case "pg":
        return "PG / Co-living";
      default:
        return "For Sale";
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name
    if (!inquiryName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (inquiryName.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inquiryEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!emailRegex.test(inquiryEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate phone (if provided)
    if (inquiryPhone.trim()) {
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanedPhone = inquiryPhone.replace(/\D/g, "");
      if (cleanedPhone.length !== 10 || !phoneRegex.test(cleanedPhone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }
    }

    setInquiryLoading(true);
    try {
      await axios.post(`/api/property_details/${id}/inquiry`, {
        name: inquiryName.trim(),
        email: inquiryEmail.trim().toLowerCase(),
        phone: inquiryPhone.trim() ? inquiryPhone.trim() : "",
        message: inquiryMessage.trim(),
      });
      toast.success("Inquiry sent successfully!");
      setInquiryName("");
      setInquiryEmail("");
      setInquiryPhone("");
      setInquiryMessage("");
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      toast.error("Failed to send inquiry");
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#50A2FF]" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 text-lg mb-4">
          {error || "Property not found"}
        </p>
        <Link href="/dashboard" className="text-[#50A2FF] hover:underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ["/noimage.png"];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header with Back Button */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-[#50A2FF] hover:bg-blue-50 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="font-medium">Back</span>
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-[#50A2FF] text-[#50A2FF] hover:bg-blue-50 cursor-pointer"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={toggleWishlist}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />{" "}
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {/* --- Property Gallery Section --- */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-500 bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-0.5 ">
            {/* Main Hero Image - takes full width on mobile, 2 cols on desktop */}
            <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-tl-xl md:rounded-l-xl border border-slate-500">
              <img
                src={images[0]}
                alt="Property"
                className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-500 group-hover:scale-105"
                onClick={() => {
                  setCurrentImageIndex(0);
                  setLightboxOpen(true);
                }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors " />
            </div>

            {/* Side Images - fill remaining space */}
            {[1, 2, 3, 4].map((index) =>
              images[index] ? (
                <div
                  key={index}
                  className={`relative group cursor-pointer  overflow-hidden ${
                    index === 1
                      ? "rounded-tr-xl"
                      : index === 4
                        ? "rounded-br-xl"
                        : ""
                  }`}
                >
                  <img
                    src={images[index]}
                    alt={`Property ${index + 1}`}
                    className="w-full h-[150px] md:h-[225px] object-cover transition-transform duration-500  group-hover:scale-105 "
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setLightboxOpen(true);
                    }}
                  />
                </div>
              ) : (
                <div
                  key={index}
                  className={` relative bg-slate-100 flex items-center justify-center border border-slate-500 cursor-pointer ${
                    index === 1
                      ? "rounded-tr-xl"
                      : index === 4
                        ? "rounded-br-xl"
                        : ""
                  }`}
                >
                  <div className="text-slate-300 flex flex-col items-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                </div>
              ),
            )}

            {/* Show count of remaining images */}
            {images.length > 5 && (
              <div
                className="relative cursor-pointer overflow-hidden bg-slate-900/70 flex items-center justify-center"
                onClick={() => {
                  setCurrentImageIndex(5);
                  setLightboxOpen(true);
                }}
              >
                <div className="text-white flex flex-col items-center">
                  <ImageIcon className="w-6 h-6 mb-1" />
                  <span className="font-semibold text-sm">
                    +{images.length - 5} more
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* --- End Gallery --- */}

        {/* --- Lightbox --- */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1,
                )
              }
              className="absolute left-4 text-white hover:text-gray-300 cursor-pointer"
            >
              <ChevronRight className="w-10 h-10 rotate-180" />
            </button>
            <img
              src={images[currentImageIndex]}
              alt="Property"
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0,
                )
              }
              className="absolute right-4 text-white hover:text-gray-300 cursor-pointer"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            <div className="absolute bottom-4 text-white text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price Section */}
            <section>
              <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <Badge className="bg-[#50A2FF] hover:bg-[#4091ee] px-4">
                      {getPurposeLabel(property.purpose || "sell")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-[#50A2FF] text-[#50A2FF]"
                    >
                      {getStatusLabel(property.status)}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                    {property.type || "Property"}{" "}
                    {property.bhk ? `in ${property.bhk} BHK` : ""}
                  </h1>
                  <p className="flex items-center gap-1 text-slate-500 mt-2">
                    <MapPin className="w-4 h-4 text-[#50A2FF]" />
                    {property.locality}, {property.city}
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="text-sm text-slate-500 uppercase tracking-wider">
                    Price
                  </p>
                  <p className="text-3xl font-bold text-[#50A2FF]">
                    {formatPrice(property.price || 0)}
                  </p>
                  {property.pricePerSqft && (
                    <p className="text-xs text-slate-400">
                      ₹{property.pricePerSqft.toLocaleString()} / sq.ft
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#50A2FF]">
                    <Bed className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Bedrooms</p>
                    <p className="font-semibold text-slate-900">
                      {property.bed || property.bhk || "-"}{" "}
                      {property.bhk ? "BHK" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#50A2FF]">
                    <Bath className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Bathrooms</p>
                    <p className="font-semibold text-slate-900">
                      {property.bath || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#50A2FF]">
                    <Square className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Super Area</p>
                    <p className="font-semibold text-slate-900">
                      {property.area || "-"} {property.areaUnit || "sq.ft"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description */}
            {property.description && (
              <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-slate-900">
                  Property Description
                </h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </section>
            )}

            {/* Property Details */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-slate-900">
                Property Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {property.furnish && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Furnishing</span>
                    <span className="font-medium text-slate-900 capitalize">
                      {property.furnish}
                    </span>
                  </div>
                )}
                {property.age && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Property Age</span>
                    <span className="font-medium text-slate-900">
                      {property.age}
                    </span>
                  </div>
                )}
                {property.ownership && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Ownership</span>
                    <span className="font-medium text-slate-900">
                      {property.ownership}
                    </span>
                  </div>
                )}
                {property.negotiable && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Negotiable</span>
                    <span className="font-medium text-slate-900">
                      {property.negotiable}
                    </span>
                  </div>
                )}
                {property.deposit && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Security Deposit</span>
                    <span className="font-medium text-slate-900">
                      ₹{property.deposit}
                    </span>
                  </div>
                )}
                {property.maintenance && (
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Maintenance</span>
                    <span className="font-medium text-slate-900">
                      ₹{property.maintenance}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Amenities Grid */}
            <section>
              <h3 className="text-xl font-semibold mb-6 text-slate-900">
                World-Class Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  "Swimming Pool",
                  "Gymnasium",
                  "Power Backup",
                  "Club House",
                  "CCTV Security",
                  "Kids Play Area",
                  "Intercom",
                  "Lush Gardens",
                  "Reserved Parking",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#50A2FF]" />
                    <span className="text-sm text-slate-700 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Inquiry Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-[#50A2FF] text-white font-bold text-xl">
                      {property.postedBy?.name?.[0]?.toUpperCase() || "A"}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">
                      {property.postedBy?.name || "Agent"}
                    </h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Badge
                        variant="secondary"
                        className="font-normal text-[10px] h-5"
                      >
                        Property{" "}
                        {property.broker === "yes" ? "Broker" : "Owner"}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {property.postedBy?.mobile && (
                    <a
                      href={`tel:${property.postedBy.mobile}`}
                      className="w-full bg-[#50A2FF] hover:bg-[#4091ee] h-12 gap-2 text-white font-semibold transition-all flex items-center justify-center rounded-lg cursor-pointer"
                    >
                      <Phone className="w-4 h-4" /> {property.postedBy.mobile}
                    </a>
                  )}
                  {!property.postedBy?.mobile && (
                    <Button className="w-full bg-[#50A2FF] hover:bg-[#4091ee] h-12 gap-2 text-white font-semibold transition-all cursor-pointer">
                      <Phone className="w-4 h-4" /> Contact Agent
                    </Button>
                  )}
                  {property.postedBy?.mobile && (
                    <a
                      href={`https://wa.me/${property.postedBy.mobile.replace(/\D/g, "")}?text=Hi, I'm interested in the property you have posted. Please share more details.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border-[#50A2FF] text-[#50A2FF] hover:bg-blue-50 h-12 gap-2 font-semibold transition-all flex items-center justify-center rounded-lg cursor-pointer border"
                    >
                      <MessageSquare className="w-4 h-4" /> WhatsApp Inquiry
                    </a>
                  )}
                  {!property.postedBy?.mobile && (
                    <Button
                      variant="outline"
                      className="w-full border-[#50A2FF] text-[#50A2FF] hover:bg-blue-50 h-12 gap-2 font-semibold cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" /> WhatsApp Inquiry
                    </Button>
                  )}
                </div>

                <Separator className="my-6" />

                <form className="space-y-4" onSubmit={handleInquirySubmit}>
                  <p className="text-sm font-semibold text-slate-900">
                    Request a Site Visit
                  </p>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full p-3 text-sm rounded-lg border border-slate-400 focus:outline-[#50A2FF] transition-all cursor-pointer"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full p-3 text-sm rounded-lg border border-slate-400 focus:outline-[#50A2FF] transition-all cursor-pointer"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (optional)"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full p-3 text-sm rounded-lg border border-slate-400 focus:outline-[#50A2FF] transition-all cursor-pointer"
                  />
                  <textarea
                    placeholder="Message (optional)"
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    rows={3}
                    className="w-full p-3 text-sm rounded-lg border border-slate-400 focus:outline-[#50A2FF] transition-all cursor-pointer resize-none"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-slate-900 text-white hover:bg-slate-800 h-11 cursor-pointer"
                    disabled={inquiryLoading}
                  >
                    {inquiryLoading ? "Sending..." : "Send Inquiry"}
                  </Button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-6 text-slate-400">
                  <div className="flex flex-col items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[10px]">
                      {property.createdAt
                        ? `Posted ${new Date(property.createdAt).toLocaleDateString()}`
                        : "Recently Posted"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="text-[10px]">Property Owner</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetailPage;
