"use client";

import React, { useState, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Building2,
  Users,
  Trash2,
  Search,
  Edit3,
  RefreshCw,
  Loader2,
  DollarSign,
  Star,
  MoreHorizontal,
  LogOut,
  AlertCircle,
  Eye,
  Mail,
  Phone,
  ArrowRightLeft,
  ShieldCheck,
  PlusCircle,
  Ban,
  UserCheck,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Property {
  _id: string;
  type?: string;
  city?: string;
  locality?: string;
  price?: number;
  bhk?: number;
  area?: number;
  status: string;
  images: string[];
  postedBy?: { _id: string; name: string; email: string };
  createdAt: string;
  purpose?: string;
  description?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  subRole?: string;
  isApproved: boolean;
  isBlocked: boolean;
  image?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  new: "#3b82f6",
  launched: "#8b5cf6",
  ready: "#10b981",
  "under-construction": "#f97316",
  rejected: "#ef4444",
};

export default function EmployeeDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["employee-stats"],
    queryFn: async () => {
      const res = await axios.get("/api/employee/stats");
      return res.data;
    },
    refetchInterval: 30000,
  });

  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["employee-properties", search],
    queryFn: async () => {
      const res = await axios.get("/api/employee/properties", {
        params: { search, limit: 50 },
      });
      return res.data;
    },
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["employee-users", search],
    queryFn: async () => {
      const res = await axios.get("/api/employee/users", {
        params: { search, limit: 50 },
      });
      return res.data;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const res = await axios.patch(`/api/employee/users/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["employee-users"] });
      queryClient.invalidateQueries({ queryKey: ["employee-stats"] });
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/employee/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employee-users"] });
      queryClient.invalidateQueries({ queryKey: ["employee-stats"] });
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const markFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(`/api/employee/properties/${id}`, {
        featured: true,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property marked as featured");
      queryClient.invalidateQueries({ queryKey: ["employee-properties"] });
    },
    onError: () => {
      toast.error("Failed to mark property as featured");
    },
  });

  const removeFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(`/api/employee/properties/${id}`, {
        featured: false,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property removed from featured");
      queryClient.invalidateQueries({ queryKey: ["employee-properties"] });
    },
    onError: () => {
      toast.error("Failed to remove featured property");
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/employee/properties/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employee-properties"] });
      queryClient.invalidateQueries({ queryKey: ["employee-stats"] });
    },
    onError: () => {
      toast.error("Failed to delete property");
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Property> }) => {
      const res = await axios.patch(`/api/employee/properties/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property updated successfully");
      queryClient.invalidateQueries({ queryKey: ["employee-properties"] });
      queryClient.invalidateQueries({ queryKey: ["employee-stats"] });
      setPropertyDialogOpen(false);
      setSelectedProperty(null);
    },
    onError: () => {
      toast.error("Failed to update property");
    },
  });

  const stats = statsData?.stats || {
    totalProperties: 0,
    pendingProperties: 0,
    activeProperties: 0,
    newPropertiesLastWeek: 0,
    totalUsers: 0,
    blockedUsers: 0,
    newUsersLastWeek: 0,
  };

  const dailyStats = statsData?.dailyStats || [];
  const propertiesByStatus: { _id: string; count: number }[] = statsData?.propertiesByStatus || [];
  const properties: Property[] = propertiesData?.properties || [];
  const users: User[] = usersData?.users || [];

  const filteredProperties = useMemo(() => {
    if (!search) return properties;
    return properties.filter(
      (p) =>
        p.city?.toLowerCase().includes(search.toLowerCase()) ||
        p.locality?.toLowerCase().includes(search.toLowerCase()) ||
        p.type?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [properties, search]);

  const filteredUsers = useMemo(() => {
    const nonAdminUsers = users.filter((u) => u.role !== "admin");
    if (!search) return nonAdminUsers;
    return nonAdminUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const builders = useMemo(() => {
    return users.filter((u) => u.role === "builder");
  }, [users]);

  const dealers = useMemo(() => {
    return users.filter((u) => u.role === "dealer");
  }, [users]);

  const handleUserAction = (
    user: User,
    action: "approve" | "block" | "unblock" | "delete",
  ) => {
    if (action === "delete") {
      if (confirm(`Are you sure you want to delete ${user.name}?`)) {
        deleteUserMutation.mutate(user._id);
      }
    } else if (action === "block") {
      updateUserMutation.mutate({ id: user._id, data: { isBlocked: true } });
    } else if (action === "unblock") {
      updateUserMutation.mutate({ id: user._id, data: { isBlocked: false } });
    } else if (action === "approve") {
      updateUserMutation.mutate({ id: user._id, data: { isApproved: true } });
    }
  };

  const handlePropertyAction = (property: Property, action: "status" | "delete" | "view") => {
    if (action === "delete") {
      if (confirm("Are you sure you want to delete this property?")) {
        deletePropertyMutation.mutate(property._id);
      }
    } else if (action === "view") {
      setSelectedProperty(property);
      setPropertyDialogOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPrice = (price?: number) => {
    if (!price && price !== 0) return "N/A";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 selection:bg-emerald-500/30">
      <aside className="w-64 border-r border-slate-800/60 bg-[#020617] flex flex-col fixed h-full z-30">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Users className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Estate<span className="text-emerald-500">Staff</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <NavButton
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavButton
            icon={<Building2 size={18} />}
            label="Properties"
            active={activeTab === "properties"}
            onClick={() => setActiveTab("properties")}
          />
          <NavButton
            icon={<AlertCircle size={18} />}
            label="Pending Approval"
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          />
          <NavButton
            icon={<PlusCircle size={18} />}
            label="Post Property"
            active={activeTab === "add-property"}
            onClick={() => setActiveTab("add-property")}
          />
          <NavButton
            icon={<Users size={18} />}
            label="Clients"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
          <NavButton
            icon={<Building2 size={18} />}
            label="Builders"
            active={activeTab === "builders"}
            onClick={() => setActiveTab("builders")}
          />
          <NavButton
            icon={<ShieldCheck size={18} />}
            label="Dealers"
            active={activeTab === "dealers"}
            onClick={() => setActiveTab("dealers")}
          />
        </nav>

        {/* <div className="px-3 py-2 mx-3 mb-3">
          <a
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
          >
            <ShieldCheck size={18} />
            Admin Panel
            <ArrowRightLeft size={16} className="ml-auto" />
          </a>
        </div> */}

        <div className="p-4 mt-auto">
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold">
                EP
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold">Employee Portal</span>
                <span className="text-[10px] text-slate-500 uppercase">
                  Real Estate
                </span>
              </div>
            </div>
            <button
              onClick={() => setLogoutDialogOpen(true)}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer border border-red-500/20"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="pl-64 flex-1">
        <header className="h-20 border-b border-slate-800/60 flex items-center justify-between px-8 sticky top-0 bg-[#020617]/80 backdrop-blur-md z-20">
          <div>
            <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              Employee Management System
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"
                size={16}
              />
              <Input
                placeholder="Search..."
                className="w-64 bg-slate-900/50 border-slate-800 pl-10 h-9 text-sm focus:ring-1 focus:ring-emerald-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-9"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["employee-stats"] });
                queryClient.invalidateQueries({ queryKey: ["employee-properties"] });
                queryClient.invalidateQueries({ queryKey: ["employee-users"] });
                toast.success("Data refreshed");
              }}
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {statsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                      title="Total Properties"
                      value={stats.totalProperties.toLocaleString()}
                      trend={`+${stats.newPropertiesLastWeek} this week`}
                      up={true}
                      icon={<Building2 size={18} />}
                    />
                    <KpiCard
                      title="Total Users"
                      value={stats.totalUsers.toLocaleString()}
                      trend={`+${stats.newUsersLastWeek} this week`}
                      up={true}
                      icon={<Users size={18} />}
                    />
                    <KpiCard
                      title="Active Listings"
                      value={stats.activeProperties.toLocaleString()}
                      trend="Live on site"
                      up={true}
                      icon={<Star size={18} />}
                    />
                    <KpiCard
                      title="New This Week"
                      value={stats.newPropertiesLastWeek.toLocaleString()}
                      trend="Recent additions"
                      up={true}
                      icon={<DollarSign size={18} />}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/60 rounded-xl p-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                        Property Listings Over Time
                      </h3>
                      <div className="h-[300px]">
                        {dailyStats.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyStats}>
                              <defs>
                                <linearGradient
                                  id="colorListingsEmp"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#10b981"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#10b981"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                vertical={false}
                                stroke="#1e293b"
                                strokeDasharray="3 3"
                              />
                              <XAxis
                                dataKey="day"
                                stroke="#475569"
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                              />
                              <YAxis
                                stroke="#475569"
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#0f172a",
                                  borderColor: "#1e293b",
                                  color: "#fff",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="listings"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorListingsEmp)"
                                strokeWidth={2}
                                name="Properties"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-500">
                            No data available
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                        Property Status
                      </h3>
                      <div className="space-y-3">
                        {propertiesByStatus.map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between text-[11px] font-bold uppercase"
                          >
                            <span className="text-slate-500 flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: STATUS_COLORS[item._id] || "#6b7280" }}
                              />
                              {item._id || "Unknown"}
                            </span>
                            <span className="text-white">{item.count} Units</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl">
                    <div className="p-6 border-b border-slate-800/60">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Building2 size={16} className="text-emerald-500" />
                        Recent Properties
                      </h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800/60 hover:bg-transparent">
                          <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Property</TableHead>
                          <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Location</TableHead>
                          <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Price</TableHead>
                          <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Status</TableHead>
                          <TableHead className="text-right text-slate-500 uppercase text-[10px] font-bold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProperties.slice(0, 5).map((p) => (
                          <TableRow key={p._id} className="border-slate-800/60 hover:bg-slate-800/20">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800">
                                  {p.images[0] ? (
                                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <Building2 size={20} className="m-2 text-slate-600" />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-200">{p.type || "Property"}</span>
                                  <span className="text-[10px] text-slate-500">{p.bhk ? `${p.bhk} BHK` : ""}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-400">
                              {p.locality || "N/A"}, {p.city || "N/A"}
                            </TableCell>
                            <TableCell className="font-mono text-emerald-400 font-bold">
                              {formatPrice(p.price)}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={p.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 border border-white/30 text-white hover:bg-white/20">
                                    <MoreHorizontal size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                                  <DropdownMenuItem
                                    onClick={() => handlePropertyAction(p, "view")}
                                    className="focus:bg-white focus:text-black cursor-pointer flex gap-2"
                                  >
                                    <Eye size={14} /> View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "properties" && (
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              {propertiesLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800/60 hover:bg-transparent">
                      <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Property</TableHead>
                      <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Location</TableHead>
                      <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Price</TableHead>
                      <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Status</TableHead>
                      <TableHead className="text-right text-slate-500 uppercase text-[10px] font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                          No properties found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProperties.map((p) => (
                        <TableRow key={p._id} className="border-slate-800/60 hover:bg-slate-800/20">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800">
                                {p.images[0] ? (
                                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Building2 size={20} className="m-2 text-slate-600" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-200">{p.type || "Property"}</span>
                                <span className="text-[10px] text-slate-500">{p.area ? `${p.area} sq.ft.` : ""}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-400">
                            {p.locality || "N/A"}, {p.city || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-emerald-400 font-bold">
                            {formatPrice(p.price)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={p.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 border border-white/30 text-white hover:bg-white/20">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                                <DropdownMenuItem
                                  onClick={() => handlePropertyAction(p, "view")}
                                  className="focus:bg-white focus:text-black cursor-pointer flex gap-2"
                                >
                                  <Eye size={14} /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handlePropertyAction(p, "delete")}
                                  className="focus:bg-red-950 focus:text-red-400 cursor-pointer flex gap-2"
                                >
                                  <Trash2 size={14} /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {activeTab === "pending" && (
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 border-b border-slate-800/60">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-500" />
                  Properties Pending Approval ({stats.pendingProperties})
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/60 hover:bg-transparent">
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Property</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Location</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Price</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Posted By</TableHead>
                    <TableHead className="text-right text-slate-500 uppercase text-[10px] font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.filter(p => p.status === "pending").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No pending properties
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProperties.filter(p => p.status === "pending").map((p) => (
                      <TableRow key={p._id} className="border-slate-800/60 hover:bg-slate-800/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800">
                              {p.images[0] ? (
                                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Building2 size={20} className="m-2 text-slate-600" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-200">{p.type || "Property"}</span>
                              <span className="text-[10px] text-slate-500">{formatDate(p.createdAt)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-400">
                          {p.locality || "N/A"}, {p.city || "N/A"}
                        </TableCell>
                        <TableCell className="font-mono text-emerald-400 font-bold">
                          {formatPrice(p.price)}
                        </TableCell>
                        <TableCell className="text-sm text-slate-400">
                          {p.postedBy?.name || "Unknown"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 border border-white/30 text-white hover:bg-white/20">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                              <DropdownMenuItem
                                onClick={() => handlePropertyAction(p, "view")}
                                className="focus:bg-white focus:text-black cursor-pointer flex gap-2"
                              >
                                <Eye size={14} /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updatePropertyMutation.mutate({ id: p._id, data: { status: "ready" } })}
                                className="focus:bg-emerald-950 focus:text-emerald-400 cursor-pointer flex gap-2"
                              >
                                <Star size={14} /> Approve
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 border-b border-slate-800/60">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Users size={16} className="text-emerald-500" />
                  All Clients
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/60 hover:bg-transparent">
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">User</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Email</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Role</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Status</TableHead>
                    <TableHead className="text-right text-slate-500 uppercase text-[10px] font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="animate-spin text-emerald-500 mx-auto" size={24} />
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.filter((u) => u.role === "user").map((user) => (
                      <TableRow key={user._id} className="border-slate-800/60 hover:bg-slate-800/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="font-semibold text-slate-200">{user.name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-400">{user.email}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.isBlocked ? (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">Blocked</span>
                          ) : user.isApproved ? (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 border border-white/30 text-white hover:bg-white/20">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                              {!user.isApproved && (
                                <DropdownMenuItem onClick={() => handleUserAction(user, "approve")} className="focus:bg-emerald-950 focus:text-emerald-400 cursor-pointer flex gap-2">
                                  <UserCheck size={14} /> Approve
                                </DropdownMenuItem>
                              )}
                              {user.isBlocked ? (
                                <DropdownMenuItem onClick={() => handleUserAction(user, "unblock")} className="focus:bg-blue-950 focus:text-blue-400 cursor-pointer flex gap-2">
                                  <UserCheck size={14} /> Unblock
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUserAction(user, "block")} className="focus:bg-red-950 focus:text-red-400 cursor-pointer flex gap-2">
                                  <Ban size={14} /> Block
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleUserAction(user, "delete")} className="focus:bg-red-950 focus:text-red-400 cursor-pointer flex gap-2">
                                <Trash2 size={14} /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "builders" && (
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 border-b border-slate-800/60">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={16} className="text-blue-500" />
                  All Builders
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/60 hover:bg-transparent">
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Builder</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Email</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Phone</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Status</TableHead>
                    <TableHead className="text-right text-slate-500 uppercase text-[10px] font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {builders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No builders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    builders.map((user) => (
                      <TableRow key={user._id} className="border-slate-800/60 hover:bg-slate-800/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                              {user.name?.charAt(0).toUpperCase() || "B"}
                            </div>
                            <span className="font-semibold text-slate-200">{user.name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-400">{user.email}</TableCell>
                        <TableCell className="text-sm text-slate-400">{user.mobile || "N/A"}</TableCell>
                        <TableCell>
                          {user.isBlocked ? (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">Blocked</span>
                          ) : user.isApproved ? (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Approved</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 border border-white/30 text-white hover:bg-white/20">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                              {!user.isApproved && (
                                <DropdownMenuItem onClick={() => handleUserAction(user, "approve")} className="focus:bg-emerald-950 focus:text-emerald-400 cursor-pointer flex gap-2">
                                  <UserCheck size={14} /> Approve
                                </DropdownMenuItem>
                              )}
                              {user.isBlocked ? (
                                <DropdownMenuItem onClick={() => handleUserAction(user, "unblock")} className="focus:bg-blue-950 focus:text-blue-400 cursor-pointer flex gap-2">
                                  <UserCheck size={14} /> Unblock
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUserAction(user, "block")} className="focus:bg-red-950 focus:text-red-400 cursor-pointer flex gap-2">
                                  <Ban size={14} /> Block
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleUserAction(user, "delete")} className="focus:bg-red-950 focus:text-red-400 cursor-pointer flex gap-2">
                                <Trash2 size={14} /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "dealers" && (
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 border-b border-slate-800/60">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={16} className="text-purple-500" />
                  All Dealers
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/60 hover:bg-transparent">
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Dealer</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Email</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Phone</TableHead>
                    <TableHead className="text-slate-500 uppercase text-[10px] font-bold">Status</TableHead>
                    <TableHead className="text-right text-slate-500 uppercase text-[10px] font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dealers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No dealers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    dealers.map((user) => (
                      <TableRow key={user._id} className="border-slate-800/60 hover:bg-slate-800/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                              {user.name?.charAt(0).toUpperCase() || "D"}
                            </div>
                            <span className="font-semibold text-slate-200">{user.name || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-400">{user.email}</TableCell>
                        <TableCell className="text-sm text-slate-400">{user.mobile || "N/A"}</TableCell>
                        <TableCell>
                          {user.isBlocked ? (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">Blocked</span>
                          ) : user.isApproved ? (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Approved</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 border border-white/30 text-white hover:bg-white/20">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white">
                              {!user.isApproved && (
                                <DropdownMenuItem onClick={() => handleUserAction(user, "approve")} className="focus:bg-emerald-950 focus:text-emerald-400 cursor-pointer flex gap-2">
                                  <UserCheck size={14} /> Approve
                                </DropdownMenuItem>
                              )}
                              {user.isBlocked ? (
                                <DropdownMenuItem onClick={() => handleUserAction(user, "unblock")} className="focus:bg-blue-950 focus:text-blue-400 cursor-pointer flex gap-2">
                                  <UserCheck size={14} /> Unblock
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUserAction(user, "block")} className="focus:bg-red-950 focus:text-red-400 cursor-pointer flex gap-2">
                                  <Ban size={14} /> Block
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleUserAction(user, "delete")} className="focus:bg-red-950 focus:text-red-400 cursor-pointer flex gap-2">
                                <Trash2 size={14} /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "add-property" && (
            <AddPropertyForm />
          )}
        </div>
      </main>

      <Dialog open={propertyDialogOpen} onOpenChange={setPropertyDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-200">
              Property Details
            </DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Type</p>
                  <p className="text-sm font-semibold">{selectedProperty.type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Status</p>
                  <StatusBadge status={selectedProperty.status} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Price</p>
                  <p className="text-sm font-semibold text-emerald-400">{formatPrice(selectedProperty.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Area</p>
                  <p className="text-sm font-semibold">{selectedProperty.area || "N/A"} sq.ft.</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">City</p>
                  <p className="text-sm font-semibold">{selectedProperty.city || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Locality</p>
                  <p className="text-sm font-semibold">{selectedProperty.locality || "N/A"}</p>
                </div>
              </div>
              {selectedProperty.postedBy && (
                <div className="border-t border-slate-800 pt-4">
                  <p className="text-xs text-slate-500 uppercase mb-2">Posted By</p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold">
                      {selectedProperty.postedBy.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{selectedProperty.postedBy.name}</p>
                      <p className="text-xs text-slate-500">{selectedProperty.postedBy.email}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="border-t border-slate-800 pt-4">
                <p className="text-xs text-slate-500 uppercase mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {["new", "ready", "pending"].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedProperty.status === status ? "default" : "outline"}
                      onClick={() => updatePropertyMutation.mutate({ id: selectedProperty._id, data: { status } })}
                      className={selectedProperty.status === status ? "bg-emerald-600" : "border-slate-700"}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPropertyDialogOpen(false)} className="border-slate-700">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-400">Are you sure you want to logout from the employee portal?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)} className="border-slate-700">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/employee/login" })}
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function KpiCard({ title, value, trend, up, icon }: { title: string; value: string; trend: string; up: boolean; icon: React.ReactNode }) {
  return (
    <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <p className={`text-[10px] mt-1 ${up ? "text-emerald-400" : "text-red-400"}`}>{trend}</p>
        </div>
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">{icon}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    launched: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    ready: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "under-construction": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${colors[status] || "bg-slate-500/10 text-slate-400"}`}>
      {status}
    </span>
  );
}

function AddPropertyForm() {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    purpose: "rent",
    category: "",
    type: "",
    roomType: "",
    gender: "",
    food: "",
    status: "pending",
    city: "",
    locality: "",
    bhk: "",
    bed: "",
    bath: "",
    bal: "",
    furnish: "",
    age: "",
    price: "",
    pricePerSqft: "",
    deposit: "",
    maintenance: "",
    description: "",
    tenant: "",
    broker: "",
    area: "",
    areaUnit: "sq.ft.",
    availableFrom: "",
    ownership: "Freehold",
    negotiable: "Yes",
    maintenanceType: "Included",
    images: [] as File[],
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      const newImages = [...formData.images, ...imageFiles];
      setFormData((prev) => ({ ...prev, images: newImages }));
      const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newImages = [...formData.images, ...newFiles];
      setFormData((prev) => ({ ...prev, images: newImages }));
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      purpose: "rent",
      category: "",
      type: "",
      roomType: "",
      gender: "",
      food: "",
      status: "pending",
      city: "",
      locality: "",
      bhk: "",
      bed: "",
      bath: "",
      bal: "",
      furnish: "",
      age: "",
      price: "",
      pricePerSqft: "",
      deposit: "",
      maintenance: "",
      description: "",
      tenant: "",
      broker: "",
      area: "",
      areaUnit: "sq.ft.",
      availableFrom: "",
      ownership: "Freehold",
      negotiable: "Yes",
      maintenanceType: "Included",
      images: [],
    });
    setImagePreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city || !formData.price) {
      toast.error("City and Price are required");
      return;
    }

    setUploading(true);
    try {
      const hasImages = formData.images.length > 0;

      if (hasImages) {
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "images") {
            (value as File[]).forEach((file) => {
              fd.append("images", file);
            });
          } else if (value !== undefined && value !== null && value !== "") {
            fd.append(key, value.toString());
          }
        });
        await axios.post("/api/employee/properties", fd);
      } else {
        const payload: Record<string, unknown> = {};
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== "images") {
            if (value !== undefined && value !== null && value !== "") {
              if (["bhk", "bed", "bath", "bal", "price", "pricePerSqft", "deposit", "maintenance", "area"].includes(key)) {
                payload[key] = value ? parseInt(value.toString()) : undefined;
              } else {
                payload[key] = value;
              }
            }
          }
        });
        await axios.post("/api/employee/properties", payload);
      }
      toast.success("Property created successfully");
      queryClient.invalidateQueries({ queryKey: ["employee-properties"] });
      queryClient.invalidateQueries({ queryKey: ["employee-stats"] });
      resetForm();
    } catch (error) {
      toast.error("Failed to create property");
    } finally {
      setUploading(false);
    }
  };

  const inputClass = "bg-slate-900/50 border-slate-700 text-slate-200 text-sm focus:ring-emerald-500 focus:border-emerald-500";
  const labelClass = "text-xs font-bold text-slate-500 uppercase mb-1 block";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/30 border-slate-800/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <PlusCircle size={16} className="text-emerald-500" />
              Add New Property
            </CardTitle>
            <CardDescription className="text-slate-500 text-[10px]">
              Fill in the property details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-emerald-400 uppercase mb-3">Basic Details</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className={labelClass}>Purpose *</label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                      required
                    >
                      <option value="sell">Sell</option>
                      <option value="rent">Rent</option>
                      <option value="pg">PG</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Property Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="house">House</option>
                      <option value="plot">Plot</option>
                      <option value="flat">Flat</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="pending">Pending</option>
                      <option value="new">New</option>
                      <option value="launched">Launched</option>
                      <option value="ready">Ready</option>
                      <option value="under-construction">Under Construction</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-emerald-400 uppercase mb-3">Location Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Locality</label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                      placeholder="Enter locality"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-emerald-400 uppercase mb-3">Property Details</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className={labelClass}>BHK</label>
                    <input
                      type="number"
                      value={formData.bhk}
                      onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                      placeholder="BHK"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bedrooms</label>
                    <select
                      value={formData.bed}
                      onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      {["1", "2", "3", "4", "5", "More"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms</label>
                    <select
                      value={formData.bath}
                      onChange={(e) => setFormData({ ...formData, bath: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      {["1", "2", "3", "4", "5"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Balconies</label>
                    <select
                      value={formData.bal}
                      onChange={(e) => setFormData({ ...formData, bal: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      {["0", "1", "2", "3", "4"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  <div>
                    <label className={labelClass}>Area (sq.ft.)</label>
                    <input
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                      placeholder="Area"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Area Unit</label>
                    <select
                      value={formData.areaUnit}
                      onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="sq.ft.">sq.ft.</option>
                      <option value="sq.m.">sq.m.</option>
                      <option value="sq.yards">sq.yards</option>
                      <option value="acres">acres</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Ownership</label>
                    <select
                      value={formData.ownership}
                      onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="Freehold">Freehold</option>
                      <option value="Leasehold">Leasehold</option>
                      <option value="Co-operative Society">Co-operative Society</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Negotiable</label>
                    <select
                      value={formData.negotiable}
                      onChange={(e) => setFormData({ ...formData, negotiable: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-emerald-400 uppercase mb-3">Pricing</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className={labelClass}>Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                      placeholder="e.g., 5000000"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Price per sq.ft.</label>
                    <input
                      type="number"
                      value={formData.pricePerSqft}
                      onChange={(e) => setFormData({ ...formData, pricePerSqft: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                      placeholder="e.g., 5000"
                    />
                  </div>
                  {formData.purpose !== "sell" && (
                    <>
                      <div>
                        <label className={labelClass}>Deposit (₹)</label>
                        <input
                          type="number"
                          value={formData.deposit}
                          onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                          className={`w-full ${inputClass} rounded-md p-2`}
                          placeholder="e.g., 50000"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Maintenance (₹)</label>
                        <input
                          type="number"
                          value={formData.maintenance}
                          onChange={(e) => setFormData({ ...formData, maintenance: e.target.value })}
                          className={`w-full ${inputClass} rounded-md p-2`}
                          placeholder="e.g., 2000"
                        />
                      </div>
                    </>
                  )}
                  {formData.purpose === "sell" && (
                    <div>
                      <label className={labelClass}>Ownership</label>
                      <select
                        value={formData.ownership}
                        onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                        className={`w-full ${inputClass} rounded-md p-2`}
                      >
                        <option value="Freehold">Freehold</option>
                        <option value="Leasehold">Leasehold</option>
                        <option value="Co-operative Society">Co-operative Society</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Negotiable</label>
                    <select
                      value={formData.negotiable}
                      onChange={(e) => setFormData({ ...formData, negotiable: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  {formData.purpose === "rent" && (
                    <div>
                      <label className={labelClass}>Available From</label>
                      <input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                        className={`w-full ${inputClass} rounded-md p-2`}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase mb-3">Additional Information</p>
                <div className="grid grid-cols-2 gap-3">
                  {formData.purpose === "rent" && (
                    <div>
                      <label className={labelClass}>Tenant Type</label>
                      <select
                        value={formData.tenant}
                        onChange={(e) => setFormData({ ...formData, tenant: e.target.value })}
                        className={`w-full ${inputClass} rounded-md p-2`}
                      >
                        <option value="">Select</option>
                        <option value="family">Family</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="company">Company</option>
                      </select>
                    </div>
                  )}
                  {formData.purpose === "pg" && (
                    <>
                      <div>
                        <label className={labelClass}>Room Type</label>
                        <select
                          value={formData.roomType}
                          onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                          className={`w-full ${inputClass} rounded-md p-2`}
                        >
                          <option value="">Select</option>
                          <option value="single">Single Sharing</option>
                          <option value="double">Double Sharing</option>
                          <option value="triple">Triple Sharing</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className={`w-full ${inputClass} rounded-md p-2`}
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="any">Any</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Food Included</label>
                        <select
                          value={formData.food}
                          onChange={(e) => setFormData({ ...formData, food: e.target.value })}
                          className={`w-full ${inputClass} rounded-md p-2`}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div>
                    <label className={labelClass}>Broker Contact</label>
                    <input
                      type="text"
                      value={formData.broker}
                      onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                      className={`w-full ${inputClass} rounded-md p-2`}
                      placeholder="Broker phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full ${inputClass} rounded-md p-2 min-h-[100px]`}
                  placeholder="Describe the property..."
                />
              </div>

              <Button
                type="submit"
                disabled={uploading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {uploading ? "Creating..." : "Create Property"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/30 border-slate-800/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-emerald-500" />
              Property Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging ? "border-emerald-500 bg-emerald-500/10" : "border-slate-700 hover:border-slate-600"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <Building2 className="mx-auto text-slate-500 mb-2" size={32} />
              <p className="text-sm text-slate-400">Drag & drop images here or click to browse</p>
              <p className="text-xs text-slate-500 mt-1">Supports: JPG, PNG, WEBP</p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
