"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Building2,
  PlusCircle,
  User,
  MessageSquare,
  LogOut,
  Menu,
  Loader2,
  Building,
  Home,
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
import Link from "next/link";

export interface ProfileInfo {
  companyName?: string;
  registrationNumber?: string;
  experience?: string;
  projectsCompleted?: string;
  aboutCompany?: string;
  officeAddress?: string;
  agencyName?: string;
  licenseNumber?: string;
  yearsInBusiness?: string;
  specialization?: string;
  aboutBusiness?: string;
}

interface Property {
  _id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  status: string;
  image: string;
  purpose?: string;
  category?: string;
  type?: string;
  city?: string;
  locality?: string;
  bhk?: string;
  bed?: string;
  bath?: string;
  bal?: string;
  furnish?: string;
  age?: string;
  pricePerSqft?: string;
  deposit?: string;
  maintenance?: string;
  description?: string;
  area?: string;
  areaUnit?: string;
  ownership?: string;
  negotiable?: string;
  maintenanceType?: string;
  youtube?: string;
  images?: string[];
  video?: string;
  postedDate?: string;
}

interface DashboardLayoutProps {
  role: "builder" | "dealer";
  themeColor: string;
  themeHoverColor: string;
  accentColor: string;
  panelName: string;
  profileInfo: ProfileInfo;
  setProfileInfo: React.Dispatch<React.SetStateAction<ProfileInfo>>;
  onPostPropertyClick?: () => void;
}

export default function DashboardLayout({
  role,
  themeColor,
  themeHoverColor,
  accentColor,
  panelName,
  profileInfo,
  setProfileInfo,
  onPostPropertyClick,
}: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProperties();
    }
  }, [session]);

  useEffect(() => {
    if (activeTab === "inquiries") {
      fetchInquiries();
    }
  }, [activeTab]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/${role}/properties`);
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
      const res = await axios.get(`/api/${role}/inquiries`);
      setInquiries(res.data.inquiries || []);
    } catch (err) {
      console.error("Failed to fetch inquiries", err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const formatPrice = (price?: string) => {
    if (!price) return "N/A";
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "N/A";
    if (numPrice >= 10000000) return `₹${(numPrice / 10000000).toFixed(1)}Cr`;
    if (numPrice >= 100000) return `₹${(numPrice / 100000).toFixed(1)}L`;
    return `₹${numPrice.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
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
      status: property.status || "new",
      city: property.city || "",
      locality: property.locality || "",
      bhk: property.bhk || "",
      bed: property.bed || "",
      bath: property.bath || "",
      bal: property.bal || "",
      area: property.area || "",
      areaUnit: property.areaUnit || "sq.ft.",
      price: property.price || "",
      pricePerSqft: property.pricePerSqft || "",
      deposit: property.deposit || "",
      maintenance: property.maintenance || "",
      maintenanceType: property.maintenanceType || "Included",
      furnish: property.furnish || "",
      age: property.age || "",
      ownership: property.ownership || "Freehold",
      negotiable: property.negotiable || "Yes",
      tenant: "",
      broker: "",
      availableFrom: "",
      description: property.description || "",
      images: [],
      existingImages: property.images || [],
    });
    setEditImageInputKey((prev) => prev + 1);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingProperty) return;

    try {
      setEditLoading(true);

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
        if (editForm.pricePerSqft)
          fd.append("pricePerSqft", editForm.pricePerSqft);
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

        await axios.patch(`/api/${role}/properties/${editingProperty._id}`, fd);
      } else {
        await axios.patch(`/api/${role}/properties/${editingProperty._id}`, {
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
          pricePerSqft: editForm.pricePerSqft
            ? Number(editForm.pricePerSqft)
            : undefined,
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
      fetchProperties();
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
    setEditImageInputKey((prev) => prev + 1);
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
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Building2 size={18} />,
    },
    { id: "listings", label: "My Listings", icon: <Building size={18} /> },
    {
      id: "add-property",
      label: "Post Property",
      icon: <PlusCircle size={18} />,
    },
    { id: "inquiries", label: "Inquiries", icon: <MessageSquare size={18} /> },
    { id: "profile", label: "My Profile", icon: <User size={18} /> },
  ];

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

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] border-r border-slate-700/50 transform transition-transform duration-200 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h1 className={`text-xl font-bold ${accentColor}`}>{panelName}</h1>
          <button
            className="lg:hidden text-slate-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Menu size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === "add-property" && onPostPropertyClick) {
                  onPostPropertyClick();
                }
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? `${themeColor} text-white`
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700/50">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="bg-[#1e293b] border-b border-slate-700/50 p-4 flex items-center justify-between lg:justify-end">
          <button
            className="lg:hidden text-slate-400"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className={themeColor}>
                {session.user.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#1e293b] border-slate-700/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Total Properties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {properties.length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1e293b] border-slate-700/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Active Listings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {properties.filter(
                        (p) =>
                          p.status === "new" ||
                          p.status === "launched" ||
                          p.status === "ready"
                      ).length}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1e293b] border-slate-700/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Total Inquiries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {inquiries.length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "listings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">My Listings</h2>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">No properties found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <Card
                      key={property._id}
                      className="bg-[#1e293b] border-slate-700/50 overflow-hidden"
                    >
                      <div className="aspect-video relative bg-slate-800">
                        {property.images && property.images[0] ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            No Image
                          </div>
                        )}
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          {property.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-white truncate">
                          {property.title}
                        </h3>
                        <p className="text-slate-400 text-sm truncate">
                          {property.locality}, {property.city}
                        </p>
                        <p className={`text-lg font-bold ${accentColor} mt-2`}>
                          {formatPrice(property.price)}
                        </p>
                        <div className="flex gap-4 mt-2 text-slate-400 text-sm">
                          <span>{property.bed} Beds</span>
                          <span>{property.bath} Baths</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className={themeColor}
                            onClick={() => handleEditClick(property)}
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Inquiries</h2>
              {inquiriesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">No inquiries yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry: any) => (
                    <Card
                      key={inquiry._id}
                      className="bg-[#1e293b] border-slate-700/50"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-white">
                              {inquiry.name}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {inquiry.email}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {inquiry.phone}
                            </p>
                          </div>
                          <p className="text-slate-400 text-sm">
                            {formatDate(inquiry.createdAt)}
                          </p>
                        </div>
                        <p className="text-slate-300 mt-2">{inquiry.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">My Profile</h2>
              <Card className="bg-[#1e293b] border-slate-700/50">
                <CardContent className="p-6 space-y-4">
                  {role === "builder" ? (
                    <>
                      <div>
                        <label className="text-slate-400 text-sm">
                          Company Name
                        </label>
                        <Input
                          value={profileInfo.companyName || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              companyName: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">
                          Registration Number
                        </label>
                        <Input
                          value={profileInfo.registrationNumber || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              registrationNumber: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">
                          Experience (Years)
                        </label>
                        <Input
                          value={profileInfo.experience || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              experience: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">
                          Projects Completed
                        </label>
                        <Input
                          value={profileInfo.projectsCompleted || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              projectsCompleted: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">
                          About Company
                        </label>
                        <Input
                          value={profileInfo.aboutCompany || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              aboutCompany: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">
                          Office Address
                        </label>
                        <Input
                          value={profileInfo.officeAddress || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              officeAddress: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-slate-400 text-sm">
                          Agency Name
                        </label>
                        <Input
                          value={profileInfo.agencyName || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              agencyName: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">
                          License Number
                        </label>
                        <Input
                          value={profileInfo.licenseNumber || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              licenseNumber: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">
                          Years in Business
                        </label>
                        <Input
                          value={profileInfo.yearsInBusiness || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              yearsInBusiness: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">
                          Specialization
                        </label>
                        <Input
                          value={profileInfo.specialization || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              specialization: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">
                          About Business
                        </label>
                        <Input
                          value={profileInfo.aboutBusiness || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              aboutBusiness: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">
                          Office Address
                        </label>
                        <Input
                          value={profileInfo.officeAddress || ""}
                          onChange={(e) =>
                            setProfileInfo({
                              ...profileInfo,
                              officeAddress: e.target.value,
                            })
                          }
                          className="bg-slate-800 border-slate-700 text-white mt-1"
                        />
                      </div>
                    </>
                  )}
                  <Button className={themeColor}>Save Profile</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#1e293b] border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Purpose</label>
                <select
                  value={editForm.purpose}
                  onChange={(e) =>
                    setEditForm({ ...editForm, purpose: e.target.value })
                  }
                  className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 mt-1"
                >
                  <option value="sell">Sell</option>
                  <option value="rent">Rent</option>
                  <option value="pg">PG</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 mt-1"
                >
                  <option value="new">New</option>
                  <option value="launched">Launched</option>
                  <option value="ready">Ready</option>
                  <option value="under-construction">Under Construction</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Title</label>
              <Input
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">City</label>
                <Input
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Locality</label>
                <Input
                  value={editForm.locality}
                  onChange={(e) =>
                    setEditForm({ ...editForm, locality: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Beds</label>
                <Input
                  value={editForm.bed}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bed: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Baths</label>
                <Input
                  value={editForm.bath}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bath: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Balcony</label>
                <Input
                  value={editForm.bal}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bal: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Area</label>
                <Input
                  value={editForm.area}
                  onChange={(e) =>
                    setEditForm({ ...editForm, area: e.target.value })
                  }
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm">Area Unit</label>
                <select
                  value={editForm.areaUnit}
                  onChange={(e) =>
                    setEditForm({ ...editForm, areaUnit: e.target.value })
                  }
                  className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 mt-1"
                >
                  <option value="sq.ft.">sq.ft.</option>
                  <option value="sq.m.">sq.m.</option>
                  <option value="sq.yards">sq.yards</option>
                  <option value="acre">acre</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm">Price</label>
              <Input
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm">Description</label>
              <Input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm">Images</label>
              <input
                type="file"
                multiple
                key={editImageInputKey}
                onChange={handleEditImageChange}
                className="w-full bg-slate-800 border-slate-700 text-white rounded-md p-2 mt-1"
              />
              {(editForm.images.length > 0 ||
                 editForm.existingImages.length > 0) && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {editForm.existingImages.map((img, idx) => (
                    <div key={`existing-${idx}`} className="relative">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleEditRemoveExistingImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {editForm.images.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleEditRemoveNewImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="border-slate-700 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={editLoading}
              className={themeColor}
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export type { FormType } from "@/app/dashboard/post-property/page";
