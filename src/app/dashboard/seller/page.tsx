"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  User,
  MessageSquare,
  LogOut,
  Menu,
  Loader2,
  CheckCircle,
  Clock,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";

interface Property {
  _id: string;
  type?: string;
  city?: string;
  locality?: string;
  price?: number;
  bhk?: number;
  bed?: string;
  bath?: string;
  bal?: string;
  area?: number;
  areaUnit?: string;
  furnish?: string;
  age?: string;
  description?: string;
  propertyStatus?: string;
  images: string[];
  purpose?: string;
  category?: string;
  status: string;
  pricePerSqft?: number;
  deposit?: string;
  maintenance?: string;
  maintenanceType?: string;
  ownership?: string;
  negotiable?: string;
  tenant?: string;
  broker?: string;
  availableFrom?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  launched: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ready: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "under-construction": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState({
    purpose: "rent",
    category: "",
    type: "",
    status: "",
    city: "",
    locality: "",
    bhk: "",
    bed: "",
    bath: "",
    bal: "",
    area: "",
    areaUnit: "sq.ft.",
    price: "",
    pricePerSqft: "",
    deposit: "",
    maintenance: "",
    maintenanceType: "Included",
    furnish: "",
    age: "",
    ownership: "Freehold",
    negotiable: "Yes",
    tenant: "",
    broker: "",
    availableFrom: "",
    description: "",
    images: [] as File[],
    existingImages: [] as string[],
  });
  const [editImageInputKey, setEditImageInputKey] = useState(0);
  const [editLoading, setEditLoading] = useState(false);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchSellerProperties();
    }
  }, [session]);

  const fetchSellerProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/seller/properties");
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await axios.get("/api/seller/inquiries");
      setInquiries(res.data.inquiries || []);
    } catch (err) {
      console.error("Failed to fetch inquiries", err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "inquiries") {
      fetchInquiries();
    }
  }, [activeTab]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const pendingProperties = properties.filter((p) => p.status === "pending");
  const approvedProperties = properties.filter(
    (p) => ["new", "launched", "ready", "under-construction"].includes(p.status)
  );

  const formatPrice = (price?: number) => {
    if (!price && price !== 0) return "N/A";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEditClick = (property: Property) => {
    setEditingProperty(property);
    setEditForm({
      purpose: property.purpose || "rent",
      category: property.category || "",
      type: property.type || "",
      status: property.propertyStatus || "new",
      city: property.city || "",
      locality: property.locality || "",
      bhk: property.bhk?.toString() || "",
      bed: property.bed || "",
      bath: property.bath || "",
      bal: property.bal || "",
      area: property.area?.toString() || "",
      areaUnit: property.areaUnit || "sq.ft.",
      price: property.price?.toString() || "",
      pricePerSqft: property.pricePerSqft?.toString() || "",
      deposit: property.deposit || "",
      maintenance: property.maintenance || "",
      maintenanceType: property.maintenanceType || "Included",
      furnish: property.furnish || "",
      age: property.age || "",
      ownership: property.ownership || "Freehold",
      negotiable: property.negotiable || "Yes",
      tenant: property.tenant || "",
      broker: property.broker || "",
      availableFrom: property.availableFrom || "",
      description: property.description || "",
      images: [],
      existingImages: property.images || [],
    });
    setEditImageInputKey(prev => prev + 1);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingProperty) return;
    
    try {
      setEditLoading(true);

      // Check if there are new images to upload
      if (editForm.images.length > 0) {
        const fd = new FormData();
        fd.append("purpose", editForm.purpose);
        fd.append("category", editForm.category);
        fd.append("type", editForm.type);
        fd.append("status", editForm.status);
        fd.append("city", editForm.city);
        fd.append("locality", editForm.locality);
        if (editForm.bhk) fd.append("bhk", editForm.bhk);
        fd.append("bed", editForm.bed);
        fd.append("bath", editForm.bath);
        fd.append("bal", editForm.bal);
        if (editForm.area) fd.append("area", editForm.area);
        fd.append("areaUnit", editForm.areaUnit);
        if (editForm.price) fd.append("price", editForm.price);
        if (editForm.pricePerSqft) fd.append("pricePerSqft", editForm.pricePerSqft);
        fd.append("deposit", editForm.deposit);
        fd.append("maintenance", editForm.maintenance);
        fd.append("maintenanceType", editForm.maintenanceType);
        fd.append("furnish", editForm.furnish);
        fd.append("age", editForm.age);
        fd.append("ownership", editForm.ownership);
        fd.append("negotiable", editForm.negotiable);
        fd.append("tenant", editForm.tenant);
        fd.append("broker", editForm.broker);
        fd.append("availableFrom", editForm.availableFrom);
        fd.append("description", editForm.description);
        fd.append("existingImages", JSON.stringify(editForm.existingImages));
        
        editForm.images.forEach((file) => {
          fd.append("images", file);
        });

        await axios.patch(`/api/seller/properties/${editingProperty._id}`, fd);
      } else {
        // No new images, send as JSON
        await axios.patch(`/api/seller/properties/${editingProperty._id}`, {
          purpose: editForm.purpose,
          category: editForm.category,
          type: editForm.type,
          status: editForm.status,
          city: editForm.city,
          locality: editForm.locality,
          bhk: editForm.bhk ? Number(editForm.bhk) : undefined,
          bed: editForm.bed,
          bath: editForm.bath,
          bal: editForm.bal,
          area: editForm.area ? Number(editForm.area) : undefined,
          areaUnit: editForm.areaUnit,
          price: editForm.price ? Number(editForm.price) : undefined,
          pricePerSqft: editForm.pricePerSqft ? Number(editForm.pricePerSqft) : undefined,
          deposit: editForm.deposit,
          maintenance: editForm.maintenance,
          maintenanceType: editForm.maintenanceType,
          furnish: editForm.furnish,
          age: editForm.age,
          ownership: editForm.ownership,
          negotiable: editForm.negotiable,
          tenant: editForm.tenant,
          broker: editForm.broker,
          availableFrom: editForm.availableFrom,
          description: editForm.description,
          existingImages: editForm.existingImages,
        });
      }
      
      toast.success("Property updated successfully");
      setEditDialogOpen(false);
      fetchSellerProperties();
    } catch (err) {
      console.error("Failed to update property", err);
      toast.error("Failed to update property");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setEditForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));
    setEditImageInputKey(prev => prev + 1);
  };

  const handleEditRemoveNewImage = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleEditRemoveExistingImage = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "listings", label: "My Listings", icon: <Building2 size={18} /> },
    { id: "add-property", label: "Post Property", icon: <PlusCircle size={18} /> },
    { id: "inquiries", label: "Inquiries", icon: <MessageSquare size={18} /> },
    { id: "profile", label: "My Profile", icon: <User size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] border-r border-slate-700/50 transform transition-transform duration-200 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Building2 className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Seller<span className="text-blue-400">Panel</span>
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-slate-600">
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {session?.user?.name?.[0]?.toUpperCase() || "S"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white truncate">
                  {session?.user?.name || "Seller"}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {session?.user?.email}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/welcome" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer border border-red-500/20"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:pl-64">
        {/* TOP HEADER */}
        <header className="h-16 bg-[#1e293b] border-b border-slate-700/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg cursor-pointer"
            >
              <Menu size={20} className="text-slate-300" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white capitalize">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                Seller Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/post-property">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                <PlusCircle size={16} className="mr-1" />
                Post Property
              </Button>
            </Link>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-[#1e293b] border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">
                          Total Listings
                        </p>
                        <p className="text-2xl font-bold text-white mt-1">
                          {properties.length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Building2 className="text-blue-400" size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b] border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">
                          Pending Approval
                        </p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">
                          {pendingProperties.length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                        <Clock className="text-yellow-400" size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b] border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">
                          Active Listings
                        </p>
                        <p className="text-2xl font-bold text-green-400 mt-1">
                          {approvedProperties.length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <CheckCircle className="text-green-400" size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1e293b] border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">
                          Total Views
                        </p>
                        <p className="text-2xl font-bold text-purple-400 mt-1">0</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Eye className="text-purple-400" size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* RECENT PROPERTIES */}
              <Card className="bg-[#1e293b] border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-bold text-white">
                    Recent Properties
                  </CardTitle>
                  <button
                    onClick={() => setActiveTab("listings")}
                    className="text-sm text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="animate-spin text-blue-500" size={24} />
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="mx-auto text-slate-600 mb-2" size={40} />
                      <p className="text-slate-400 text-sm">No properties yet</p>
                      <Link href="/dashboard/post-property">
                        <Button className="mt-3 bg-blue-600 hover:bg-blue-700 cursor-pointer">
                          Post Your First Property
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {properties.slice(0, 5).map((property) => (
                        <div
                          key={property._id}
                          className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                        >
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                            {property.images?.[0] ? (
                              <img
                                src={property.images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Building2 className="m-3 text-slate-500" size={20} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">
                              {property.type || "Property"} {property.bhk ? `• ${property.bhk} BHK` : ""}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {property.locality}, {property.city}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-400">
                              {formatPrice(property.price)}
                            </p>
                            <Badge
                              className={`text-[10px] ${
                                STATUS_COLORS[property.status] ||
                                "bg-slate-700 text-slate-300"
                              }`}
                            >
                              {property.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* QUICK ACTIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/dashboard/post-property">
                  <Card className="bg-[#1e293b] border-slate-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <PlusCircle className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Add New Property</p>
                        <p className="text-xs text-slate-500">List a new property</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <button
                  onClick={() => setActiveTab("listings")}
                  className="cursor-pointer"
                >
                  <Card className="bg-[#1e293b] border-slate-700/50 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <Building2 className="text-green-400" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Manage Listings</p>
                        <p className="text-xs text-slate-500">Edit or delete properties</p>
                      </div>
                    </CardContent>
                  </Card>
                </button>

                <button
                  onClick={() => setActiveTab("profile")}
                  className="cursor-pointer"
                >
                  <Card className="bg-[#1e293b] border-slate-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <User className="text-purple-400" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Update Profile</p>
                        <p className="text-xs text-slate-500">Manage your account</p>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              </div>
            </div>
          )}

          {/* MY LISTINGS VIEW */}
          {activeTab === "listings" && (
            <SellerListings
              properties={properties}
              loading={loading}
              onRefresh={fetchSellerProperties}
              formatPrice={formatPrice}
              formatDate={formatDate}
              onEdit={handleEditClick}
            />
          )}

          {/* ADD PROPERTY VIEW */}
          {activeTab === "add-property" && (
            <div className="text-center py-12">
              <Building2 className="mx-auto text-slate-600 mb-4" size={60} />
              <h3 className="text-xl font-bold text-white mb-2">
                Post a New Property
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Use our multi-step form to list your property. All listings require
                admin approval before going live.
              </p>
              <Link href="/dashboard/post-property">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  <PlusCircle size={18} className="mr-2" />
                  Post Property
                </Button>
              </Link>
            </div>
          )}

          {/* INQUIRIES VIEW */}
          {activeTab === "inquiries" && (
            <Card className="bg-[#1e293b] border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-white">
                    Inquiries & Leads
                  </CardTitle>
                  {inquiries.length > 0 && (
                    <Badge className="bg-blue-600 text-white">
                      {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="mx-auto animate-spin text-slate-600 mb-4" size={40} />
                    <p className="text-slate-400">Loading inquiries...</p>
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto text-slate-600 mb-4" size={40} />
                    <p className="text-slate-400">No inquiries yet</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Inquiries will appear here when buyers contact you
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inquiry, index) => (
                      <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-white">{inquiry.name}</p>
                            <p className="text-sm text-slate-400">{inquiry.email}</p>
                            {inquiry.phone && (
                              <p className="text-sm text-slate-400">{inquiry.phone}</p>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                          <p className="text-xs text-slate-500 mb-1">Interested in:</p>
                          <p className="text-sm font-medium text-white">
                            {inquiry.propertyType} in {inquiry.propertyLocality}, {inquiry.propertyCity}
                            {inquiry.propertyPrice && (
                              <span className="text-blue-400 ml-2">
                                ₹{inquiry.propertyPrice >= 10000000 
                                  ? `${(inquiry.propertyPrice / 10000000).toFixed(2)} Cr`
                                  : inquiry.propertyPrice >= 100000 
                                    ? `${(inquiry.propertyPrice / 100000).toFixed(2)} L`
                                    : inquiry.propertyPrice.toLocaleString()
                                }
                              </span>
                            )}
                          </p>
                          {inquiry.message && (
                            <p className="text-sm text-slate-300 mt-2">
                              <span className="text-slate-500">Message: </span>
                              {inquiry.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* PROFILE VIEW */}
          {activeTab === "profile" && (
            <SellerProfile session={session} />
          )}
        </div>

        {/* EDIT PROPERTY DIALOG */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              
              {/* Purpose */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">
                  I'm looking to
                </label>
                <div className="flex gap-2">
                  {["sell", "rent", "pg"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, purpose: p })}
                      className={`px-4 py-2 rounded-lg border text-sm ${
                        editForm.purpose === p
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-800 border-slate-600 text-slate-300"
                      }`}
                    >
                      {p === "pg" ? "PG" : p === "rent" ? "Rent / Lease" : "Sell"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">
                  {editForm.purpose === "pg" ? "Who is this PG for?" : "Property Category"}
                </label>
                <div className="flex gap-2">
                  {(editForm.purpose === "pg" 
                    ? ["boys", "girls"] 
                    : ["residential", "commercial"]
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, category: cat })}
                      className={`px-4 py-2 rounded-lg border text-sm ${
                        editForm.category === cat
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-800 border-slate-600 text-slate-300"
                      }`}
                    >
                      {editForm.purpose === "pg" 
                        ? (cat === "boys" ? "Boys PG" : "Girls PG")
                        : (cat === "residential" ? "Residential" : "Commercial")
                      }
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">
                  Property Type
                </label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full bg-slate-800 border-slate-600 text-white rounded-lg px-3 py-2"
                >
                  <option value="">Select Type</option>
                  {editForm.purpose === "pg" ? (
                    <>
                      <option value="PG">PG</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Co-living">Co-living</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Flat/Apartment">Flat/Apartment</option>
                      <option value="Independent House / Villa">Independent House / Villa</option>
                      <option value="Independent / Builder Floor">Independent / Builder Floor</option>
                      <option value="Plot / Land">Plot / Land</option>
                      <option value="1 RK / Studio Apartment">1 RK / Studio Apartment</option>
                      <option value="Serviced apartment">Serviced apartment</option>
                      <option value="Farmhouse">Farmhouse</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-2">City</label>
                  <Input
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-2">Locality</label>
                  <Input
                    value={editForm.locality}
                    onChange={(e) => setEditForm({ ...editForm, locality: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Locality / Society"
                  />
                </div>
              </div>

              {/* Construction Status */}
              {(editForm.purpose === "sell" || editForm.purpose === "rent") && (
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-2">Construction Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-slate-800 border-slate-600 text-white rounded-lg px-3 py-2"
                  >
                    <option value="new">New Project</option>
                    <option value="launched">Newly Launched</option>
                    <option value="ready">Ready to Move</option>
                    <option value="under-construction">Under Construction</option>
                  </select>
                </div>
              )}

              {/* BHK, Area, Price Per Sqft */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-2">BHK</label>
                  <Input
                    value={editForm.bhk}
                    onChange={(e) => setEditForm({ ...editForm, bhk: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="BHK"
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-2">Area</label>
                  <div className="flex gap-2">
                    <Input
                      value={editForm.area}
                      onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white flex-1"
                      placeholder="Area"
                      type="number"
                    />
                    <select
                      value={editForm.areaUnit}
                      onChange={(e) => setEditForm({ ...editForm, areaUnit: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white rounded-lg px-2"
                    >
                      <option value="sq.ft.">sq.ft.</option>
                      <option value="sq.m.">sq.m.</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-2">Price/sq.ft</label>
                  <Input
                    value={editForm.pricePerSqft}
                    onChange={(e) => setEditForm({ ...editForm, pricePerSqft: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Price per sq.ft"
                    type="number"
                  />
                </div>
              </div>

              {/* Room Details - Sell/Rent */}
              {(editForm.purpose === "sell" || editForm.purpose === "rent") && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 font-medium block mb-2">Bedrooms</label>
                    <select
                      value={editForm.bed}
                      onChange={(e) => setEditForm({ ...editForm, bed: e.target.value })}
                      className="w-full bg-slate-800 border-slate-600 text-white rounded-lg px-3 py-2"
                    >
                      <option value="">Select</option>
                      {["1", "2", "3", "4", "5", "More"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 font-medium block mb-2">Bathrooms</label>
                    <select
                      value={editForm.bath}
                      onChange={(e) => setEditForm({ ...editForm, bath: e.target.value })}
                      className="w-full bg-slate-800 border-slate-600 text-white rounded-lg px-3 py-2"
                    >
                      <option value="">Select</option>
                      {["1", "2", "3", "4", "5", "More"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 font-medium block mb-2">Balconies</label>
                    <select
                      value={editForm.bal}
                      onChange={(e) => setEditForm({ ...editForm, bal: e.target.value })}
                      className="w-full bg-slate-800 border-slate-600 text-white rounded-lg px-3 py-2"
                    >
                      <option value="">Select</option>
                      {["0", "1", "2", "3", "4"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Furnishing */}
              {(editForm.purpose === "sell" || editForm.purpose === "rent") && (
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-2">Furnishing</label>
                  <div className="flex gap-2">
                    {["Furnished", "Semi-furnished", "Un-furnished"].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, furnish: f })}
                        className={`px-4 py-2 rounded-lg border text-sm ${
                          editForm.furnish === f
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-800 border-slate-600 text-slate-300"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Age of Property */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">Age of Property</label>
                <div className="flex gap-2 flex-wrap">
                  {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, age: a })}
                      className={`px-4 py-2 rounded-lg border text-sm ${
                        editForm.age === a
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-800 border-slate-600 text-slate-300"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available From - Rent Only */}
              {editForm.purpose === "rent" && (
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-2">Available From</label>
                  <Input
                    type="date"
                    value={editForm.availableFrom}
                    onChange={(e) => setEditForm({ ...editForm, availableFrom: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              )}

              {/* Tenant Type - Rent/PG */}
              {(editForm.purpose === "rent" || editForm.purpose === "pg") && (
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-2">Willing to rent out to</label>
                  <div className="flex gap-2 flex-wrap">
                    {(editForm.purpose === "pg" 
                      ? ["Bachelors", "Boys", "Girls"] 
                      : ["Family", "Bachelors", "Boys", "Girls"]
                    ).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, tenant: t })}
                        className={`px-4 py-2 rounded-lg border text-sm ${
                          editForm.tenant === t
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-800 border-slate-600 text-slate-300"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">
                  {editForm.purpose === "sell" ? "Sale Price (₹)" : editForm.purpose === "rent" ? "Expected Rent (₹)" : "PG Monthly Rent (₹)"}
                </label>
                <Input
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="Price"
                  type="number"
                />
              </div>

              {/* Broker */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">Are you ok with brokers contacting you?</label>
                <div className="flex gap-2">
                  {["Yes", "No"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, broker: b })}
                      className={`px-4 py-2 rounded-lg border text-sm ${
                        editForm.broker === b
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-800 border-slate-600 text-slate-300"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rent/PG Only Fields */}
              {(editForm.purpose === "rent" || editForm.purpose === "pg") && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 font-medium block mb-2">Security Deposit</label>
                    <Input
                      value={editForm.deposit}
                      onChange={(e) => setEditForm({ ...editForm, deposit: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white"
                      placeholder="Deposit"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 font-medium block mb-2">Maintenance</label>
                    <div className="flex gap-2 mb-2">
                      {["Included", "Excluded"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, maintenanceType: m })}
                          className={`px-3 py-1 rounded-lg border text-xs ${
                            editForm.maintenanceType === m
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-800 border-slate-600 text-slate-300"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <Input
                      value={editForm.maintenance}
                      onChange={(e) => setEditForm({ ...editForm, maintenance: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white"
                      placeholder="Maintenance"
                      type="number"
                    />
                  </div>
                </div>
              )}

              {/* Sell Only - Ownership */}
              {editForm.purpose === "sell" && (
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-2">Ownership Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Freehold", "Leasehold", "Co-operative", "Power of Attorney"].map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, ownership: o })}
                        className={`px-4 py-2 rounded-lg border text-sm ${
                          editForm.ownership === o
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-800 border-slate-600 text-slate-300"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Negotiable */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">Price Negotiable?</label>
                <div className="flex gap-2">
                  {["Yes", "No"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, negotiable: n })}
                      className={`px-4 py-2 rounded-lg border text-sm ${
                        editForm.negotiable === n
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-800 border-slate-600 text-slate-300"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images Upload */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">Property Images</label>
                
                {/* Existing Images */}
                {editForm.existingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-2">Current Images</p>
                    <div className="flex gap-2 flex-wrap">
                      {editForm.existingImages.map((img, i) => (
                        <div key={`existing-${i}`} className="relative">
                          <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => handleEditRemoveExistingImage(i)}
                            className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-bl cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                <div>
                  <p className="text-xs text-slate-400 mb-2">Add New Images</p>
                  <input
                    key={editImageInputKey}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="cursor-pointer border border-slate-600 rounded-lg px-3 py-2 w-full bg-slate-800 text-slate-300 text-sm"
                  />
                </div>

                {editForm.images.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-400 mb-2">New Images to Upload</p>
                    <div className="flex gap-2 flex-wrap">
                      {editForm.images.map((file, i) => (
                        <div key={`new-${i}`} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="w-20 h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleEditRemoveNewImage(i)}
                            className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-bl cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-2">Property Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-800 border-slate-600 text-white rounded-lg px-3 py-2 h-32 resize-none"
                  placeholder="Describe your property..."
                />
              </div>

            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                disabled={editLoading}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

// SUB-COMPONENTS

function SellerListings({
  properties,
  loading,
  onRefresh,
  formatPrice,
  formatDate,
  onEdit,
}: {
  properties: Property[];
  loading: boolean;
  onRefresh: () => void;
  formatPrice: (price?: number) => string;
  formatDate: (dateString: string) => string;
  onEdit: (property: Property) => void;
}) {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      setDeleteLoading(id);
      await axios.delete(`/api/seller/properties/${id}`);
      toast.success("Property deleted successfully");
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete property");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <Card className="bg-[#1e293b] border-slate-700/50">
        <CardContent className="text-center py-12">
          <Building2 className="mx-auto text-slate-600 mb-4" size={40} />
          <p className="text-slate-400">No properties listed yet</p>
          <Link href="/dashboard/post-property">
            <Button className="mt-3 bg-blue-600 hover:bg-blue-700 cursor-pointer">
              Post Your First Property
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1e293b] border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-white">
          My Listings ({properties.length})
        </CardTitle>
        <Link href="/dashboard/post-property">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <PlusCircle size={16} className="mr-1" />
            Add New
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property._id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <div className="w-full sm:w-24 h-20 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="m-6 text-slate-500" size={24} />
                )}
              </div>

              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-white">
                      {property.type || "Property"} {property.bhk ? `• ${property.bhk} BHK` : ""}
                    </p>
                    <p className="text-sm text-slate-400">
                      {property.locality}, {property.city}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Posted on {formatDate(property.createdAt)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-lg text-blue-400">
                      {formatPrice(property.price)}
                    </p>
                    <Badge
                      className={`mt-1 ${
                        STATUS_COLORS[property.status] ||
                        "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {property.status === "pending" && "Pending Approval"}
                      {property.status === "rejected" && "Rejected"}
                      {["new", "launched", "ready", "under-construction"].includes(
                        property.status
                      ) && "Active"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Link href={`/dashboard/property_details/${property._id}`}>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer">
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                    onClick={() => onEdit(property)}
                  >
                    <Edit3 size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-500/30 hover:bg-red-500/10 cursor-pointer"
                    onClick={() => handleDelete(property._id)}
                    disabled={deleteLoading === property._id}
                  >
                    {deleteLoading === property._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SellerProfile({ session }: { session: any }) {
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/seller/profile");
        if (res.data.user) {
          setFormData({
            name: res.data.user.name || "",
            email: res.data.user.email || "",
            mobile: res.data.user.mobile || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.patch("/api/seller/profile", formData);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#1e293b] border-slate-700/50 max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base font-bold text-white">
          My Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
              Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
              Email
            </label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-slate-800 border-slate-600 text-white"
              disabled
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
              Mobile Number
            </label>
            <Input
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="Enter mobile number"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
