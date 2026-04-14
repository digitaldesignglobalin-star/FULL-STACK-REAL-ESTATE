"use client";

import React, { useState, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Users,
  Trash2,
  Search,
  Edit3,
  RefreshCw,
  Check,
  Loader2,
  DollarSign,
  Crown,
  PlusCircle,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserCheck,
  Ban,
  LogOut,
  Star,
  ArrowRightLeft,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  hasSubscription?: boolean;
  subscriptionExpiry?: string;
  commissionPercent?: number;
  createdAt: string;
}

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
  category?: string;
  roomType?: string;
  gender?: string;
  food?: string;
  bed?: number;
  bath?: number;
  bal?: number;
  furnish?: string;
  age?: string;
  pricePerSqft?: number;
  deposit?: number;
  maintenance?: number;
  description?: string;
  tenant?: string;
  broker?: string;
  areaUnit?: string;
  availableFrom?: string;
  ownership?: string;
  negotiable?: string;
  maintenanceType?: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  new: "#3b82f6",
  launched: "#8b5cf6",
  ready: "#10b981",
  "under-construction": "#f97316",
  rejected: "#ef4444",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/stats");
      return res.data;
    },
    refetchInterval: 30000,
  });

  // Fetch Users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: async () => {
      const res = await axios.get("/api/admin/users", {
        params: { search, limit: 50 },
      });
      return res.data;
    },
  });

  // Fetch Properties
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["admin-properties", search],
    queryFn: async () => {
      const res = await axios.get("/api/admin/properties", {
        params: { search, limit: 50 },
      });
      return res.data;
    },
  });

  // Update User Mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const res = await axios.patch(`/api/admin/users/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/admin/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  // Update Property Mutation
  const updatePropertyMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Property>;
    }) => {
      const res = await axios.patch(`/api/admin/properties/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setPropertyDialogOpen(false);
      setSelectedProperty(null);
    },
    onError: () => {
      toast.error("Failed to update property");
    },
  });

  // Delete Property Mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/admin/properties/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: () => {
      toast.error("Failed to delete property");
    },
  });

  // Mark Property as Featured Mutation
  const markFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(`/api/admin/properties/${id}`, {
        featured: true,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property marked as featured");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
    },
    onError: () => {
      toast.error("Failed to mark property as featured");
    },
  });

  // Remove Property from Featured Mutation
  const removeFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(`/api/admin/properties/${id}`, {
        featured: false,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property removed from featured");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
    },
    onError: () => {
      toast.error("Failed to remove featured property");
    },
  });

  const stats = statsData?.stats || {
    totalUsers: 0,
    totalBuilders: 0,
    totalProperties: 0,
    pendingProperties: 0,
    activeProperties: 0,
    blockedUsers: 0,
    newUsersLastWeek: 0,
    newPropertiesLastWeek: 0,
    totalRevenue: 0,
  };

  const featuredPropertiesCount = (propertiesData?.properties || []).filter(
    (p: any) => p.featured === true,
  ).length;

  const dailyStats = statsData?.dailyStats || [];
  const propertiesByStatus: { _id: string; count: number }[] =
    statsData?.propertiesByStatus || [];
  const usersByRoleOverTime = statsData?.usersByRoleOverTime || [];
  const subscriptionUsers: User[] = statsData?.subscriptionUsers || [];

  const marketData = propertiesByStatus.map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
    fill: STATUS_COLORS[item._id] || "#6b7280",
  }));

  const users: User[] = usersData?.users || [];
  const properties: Property[] = propertiesData?.properties || [];

  const filteredProperties = useMemo(() => {
    if (!search) return properties;
    return properties.filter(
      (p) =>
        p.city?.toLowerCase().includes(search.toLowerCase()) ||
        p.locality?.toLowerCase().includes(search.toLowerCase()) ||
        p.type?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [properties, search]);

  const featuredProperties = useMemo(() => {
    return properties.filter((p: any) => p.featured === true);
  }, [properties]);

  const filteredUsers = useMemo(() => {
    const nonAdminUsers = users.filter((u) => u.role !== "admin");
    if (!search) return nonAdminUsers;
    return nonAdminUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

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

  const handlePropertyAction = (
    property: Property,
    action: "status" | "delete",
  ) => {
    if (action === "delete") {
      if (confirm("Are you sure you want to delete this property?")) {
        deletePropertyMutation.mutate(property._id);
      }
    } else {
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
    <div className="flex min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-slate-800/60 bg-[#020617] flex flex-col fixed h-full z-30">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Estate<span className="text-blue-500">Admin</span>
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
            icon={<PlusCircle size={18} />}
            label="Post Property"
            active={activeTab === "add-property"}
            onClick={() => setActiveTab("add-property")}
          />
          <NavButton
            icon={<Star size={18} />}
            label="Featured Property"
            active={activeTab === "featured-property"}
            onClick={() => setActiveTab("featured-property")}
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

        <div className="px-3 py-2 mx-3 mb-3">
          <a
            href="/employee"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
          >
            <Users size={18} />
            Employee Panel
            <ArrowRightLeft size={16} className="ml-auto" />
          </a>
        </div>

        <div className="p-4 mt-auto">
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800/60">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-slate-700">
                <AvatarFallback className="bg-blue-600 text-[10px]">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-bold">Admin Portal</span>
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

      {/* MAIN CONTENT */}
      <main className="pl-64 flex-1">
        {/* TOP HEADER */}
        <header className="h-20 border-b border-slate-800/60 flex items-center justify-between px-8 sticky top-0 bg-[#020617]/80 backdrop-blur-md z-20">
          <div>
            <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              Real Estate Management System
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
                size={16}
              />
              <Input
                placeholder="Search..."
                className="w-64 bg-slate-900/50 border-slate-800 pl-10 h-9 text-sm focus:ring-1 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-9"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
                queryClient.invalidateQueries({ queryKey: ["admin-users"] });
                queryClient.invalidateQueries({
                  queryKey: ["admin-properties"],
                });
                toast.success("Data refreshed");
              }}
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </header>

        <div className="p-8">
          {/* DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {statsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <KpiCard
                      title="Total Users"
                      value={stats.totalUsers.toLocaleString()}
                      trend={`+${stats.newUsersLastWeek} this week`}
                      up={true}
                      icon={<Users size={18} />}
                    />
                    <KpiCard
                      title="Total Properties"
                      value={stats.totalProperties.toLocaleString()}
                      trend={`+${stats.newPropertiesLastWeek} this week`}
                      up={true}
                      icon={<Building2 size={18} />}
                    />
                    <KpiCard
                      title="Total Revenue"
                      value={formatPrice(stats.totalRevenue)}
                      trend="Property Values"
                      up={true}
                      icon={<DollarSign size={18} />}
                    />
                    <KpiCard
                      title="Featured Properties"
                      value={featuredPropertiesCount.toLocaleString()}
                      trend={featuredPropertiesCount > 0 ? "Active" : "None"}
                      up={featuredPropertiesCount > 0}
                      icon={<Star size={18} />}
                    />
                    <KpiCard
                      title="Blocked Users"
                      value={stats.blockedUsers.toLocaleString()}
                      trend={stats.blockedUsers > 0 ? "Review Needed" : "None"}
                      up={stats.blockedUsers === 0}
                      icon={<Ban size={18} />}
                    />
                  </div>

                  {featuredProperties.length > 0 && (
                    <Card className="bg-slate-900/30 border-slate-800/60">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Star size={16} className="text-amber-500" />
                          Featured Properties
                        </CardTitle>
                        <CardDescription className="text-slate-500 text-[10px]">
                          Properties selected by admin for featured section
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {featuredProperties.slice(0, 4).map((property) => (
                            <div
                              key={property._id}
                              className="bg-slate-950/50 border border-slate-800 rounded-lg p-3"
                            >
                              <div className="w-full h-32 bg-slate-800 rounded-lg overflow-hidden mb-3">
                                <img
                                  src={property.images?.[0] || "/noimage.png"}
                                  alt={property.type}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-1">
                                <p className="text-amber-500 font-bold text-lg">
                                  {formatPrice(property.price)}
                                </p>
                                <p className="text-white text-sm font-medium truncate">
                                  {property.type}
                                </p>
                                <p className="text-slate-500 text-xs truncate">
                                  {property.locality}, {property.city}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-slate-900/30 border-slate-800/60">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                          Property Listings Over Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        {dailyStats.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyStats}>
                              <defs>
                                <linearGradient
                                  id="colorListingsNew"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
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
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#colorListingsNew)"
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
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/30 border-slate-800/60">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                          Property Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center">
                        <div className="h-[220px] w-full">
                          {marketData.length > 0 ? (
                            <ResponsiveContainer>
                              <PieChart>
                                <Pie
                                  data={marketData}
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={8}
                                  dataKey="value"
                                >
                                  {marketData.map(
                                    (
                                      entry: {
                                        name: string;
                                        value: number;
                                        fill: string;
                                      },
                                      index: number,
                                    ) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill}
                                        stroke="none"
                                      />
                                    ),
                                  )}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                              No properties
                            </div>
                          )}
                        </div>
                        <div className="w-full space-y-2 mt-4">
                          {marketData.map(
                            (m: {
                              name: string;
                              value: number;
                              fill: string;
                            }) => (
                              <div
                                key={m.name}
                                className="flex justify-between text-[11px] font-bold uppercase"
                              >
                                <span className="text-slate-500 flex items-center gap-2">
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: m.fill }}
                                  />{" "}
                                  {m.name}
                                </span>
                                <span className="text-white">
                                  {m.value} Units
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-slate-900/30 border-slate-800/60 z-0">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Star size={16} className="text-amber-500" />
                        Featured Properties
                      </CardTitle>
                      <CardDescription className="text-slate-500 text-[10px]">
                        Properties selected by admin for featured section
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {featuredProperties.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-slate-500">
                          No featured properties
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow className="border-slate-800/60 hover:bg-transparent">
                              <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                                Property
                              </TableHead>
                              <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                                Location
                              </TableHead>
                              <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                                Price
                              </TableHead>
                              <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                                Status
                              </TableHead>
                              <TableHead className="text-right text-slate-500 uppercase text-[10px] font-bold">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {featuredProperties.slice(0, 10).map((p) => (
                              <TableRow
                                key={p._id}
                                className="border-slate-800/60 hover:bg-slate-800/20"
                              >
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800">
                                      {p.images[0] ? (
                                        <img
                                          src={p.images[0]}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <Building2
                                          size={20}
                                          className="m-2 text-slate-600"
                                        />
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-bold text-slate-200">
                                        {p.type || "Property"}{" "}
                                        {p.bhk ? `• ${p.bhk} BHK` : ""}
                                      </span>
                                      <span className="text-[10px] text-slate-500">
                                        {p.area ? `${p.area} sq.ft.` : "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-slate-400">
                                  {p.locality || "N/A"}, {p.city || "N/A"}
                                </TableCell>
                                <TableCell className="font-mono text-blue-400 font-bold">
                                  {formatPrice(p.price)}
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={p.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 border border-white/30 text-white hover:bg-white/20 hover:text-white"
                                      >
                                        <MoreHorizontal size={16} />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="bg-slate-900 border-slate-800 text-white"
                                    >
                                      <DropdownMenuItem
                                        onClick={() => {
                                          const featuredProps =
                                            properties.filter(
                                              (prop: any) =>
                                                prop.featured === true,
                                            );
                                          const otherProps = properties.filter(
                                            (prop: any) => prop._id !== p._id,
                                          );
                                          setSelectedProperty(p);
                                          setPropertyDialogOpen(true);
                                        }}
                                        className="focus:bg-white focus:text-black cursor-pointer flex gap-2 text-white border border-white/30"
                                      >
                                        <Edit3 size={14} /> Update Status
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          if (
                                            confirm(
                                              "Are you sure you want to remove this property from featured?",
                                            )
                                          ) {
                                            removeFeaturedMutation.mutate(
                                              p._id,
                                            );
                                          }
                                        }}
                                        className="focus:bg-red-950 text-red-400 cursor-pointer flex gap-2"
                                      >
                                        <Star size={14} /> Remove from Featured
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/30 border-slate-800/60 z-0">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Building2 size={16} className="text-blue-500" />
                        All Properties
                      </CardTitle>
                      <CardDescription className="text-slate-500 text-[10px]">
                        Complete list of all properties
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-800/60 hover:bg-transparent">
                            <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                              Property
                            </TableHead>
                            <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                              Location
                            </TableHead>
                            <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                              Price
                            </TableHead>
                            <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                              Status
                            </TableHead>
                            <TableHead className="text-right text-slate-500 uppercase text-[10px] font-bold">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProperties.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-8 text-slate-500"
                              >
                                No properties found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredProperties.slice(0, 10).map((p) => (
                              <TableRow
                                key={p._id}
                                className="border-slate-800/60 hover:bg-slate-800/20"
                              >
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800">
                                      {p.images[0] ? (
                                        <img
                                          src={p.images[0]}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <Building2
                                          size={20}
                                          className="m-2 text-slate-600"
                                        />
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-bold text-slate-200">
                                        {p.type || "Property"}{" "}
                                        {p.bhk ? `• ${p.bhk} BHK` : ""}
                                      </span>
                                      <span className="text-[10px] text-slate-500">
                                        {p.area ? `${p.area} sq.ft.` : "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-slate-400">
                                  {p.locality || "N/A"}, {p.city || "N/A"}
                                </TableCell>
                                <TableCell className="font-mono text-blue-400 font-bold">
                                  {formatPrice(p.price)}
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={p.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 border border-white/30 text-white hover:bg-white/20 hover:text-white"
                                      >
                                        <MoreHorizontal size={16} />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="bg-slate-900 border-slate-800 text-white"
                                    >
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handlePropertyAction(p, "status")
                                        }
                                        className="focus:bg-white focus:text-black cursor-pointer flex gap-2 text-white border border-white/30"
                                      >
                                        <Edit3 size={14} /> Update Status
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handlePropertyAction(p, "delete")
                                        }
                                        className="focus:bg-red-950 text-red-400 cursor-pointer flex gap-2"
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
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/30 border-slate-800/60 z-0">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                        User Registrations by Role
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[280px]">
                      {usersByRoleOverTime.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={usersByRoleOverTime}>
                            <defs>
                              <linearGradient
                                id="colorUser"
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
                              <linearGradient
                                id="colorBuilder"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#8b5cf6"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#8b5cf6"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                              <linearGradient
                                id="colorEmployee"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#f59e0b"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#f59e0b"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                              <linearGradient
                                id="colorAdmin"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#ef4444"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#ef4444"
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
                              dataKey="user"
                              stackId="1"
                              stroke="#10b981"
                              fill="url(#colorUser)"
                              strokeWidth={2}
                              name="Users"
                            />
                            <Area
                              type="monotone"
                              dataKey="builder"
                              stackId="1"
                              stroke="#8b5cf6"
                              fill="url(#colorBuilder)"
                              strokeWidth={2}
                              name="Builders"
                            />
                            <Area
                              type="monotone"
                              dataKey="employee"
                              stackId="1"
                              stroke="#f59e0b"
                              fill="url(#colorEmployee)"
                              strokeWidth={2}
                              name="Employees"
                            />
                            <Area
                              type="monotone"
                              dataKey="admin"
                              stackId="1"
                              stroke="#ef4444"
                              fill="url(#colorAdmin)"
                              strokeWidth={2}
                              name="Admins"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                          No user data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/30 border-slate-800/60 z-0">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Users size={16} className="text-emerald-500" />
                        All Clients
                      </CardTitle>
                      <CardDescription className="text-slate-500 text-[10px]">
                        Complete list of registered clients
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pointer-events-auto">
                      <UsersTable
                        users={users.filter((u) => u.role !== "admin")}
                        updateUserMutation={updateUserMutation}
                        deleteUserMutation={deleteUserMutation}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/30 border-slate-800/60 z-0">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Crown size={16} className="text-amber-500" />
                        Premium Subscribers
                      </CardTitle>
                      <CardDescription className="text-slate-500 text-[10px]">
                        Users with active subscriptions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pointer-events-auto">
                      <SubscriptionTable users={subscriptionUsers} />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* PROPERTIES VIEW */}
          {activeTab === "properties" && (
            <Card className="bg-slate-900/30 border-slate-800/60 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {propertiesLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800/60 hover:bg-transparent">
                      <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                        Property
                      </TableHead>
                      <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                        Location
                      </TableHead>
                      <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                        Price
                      </TableHead>
                      <TableHead className="text-slate-500 uppercase text-[10px] font-bold">
                        Status
                      </TableHead>
                      <TableHead className="text-right text-slate-500 uppercase text-[10px] font-bold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-slate-500"
                        >
                          No properties found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProperties.map((p) => (
                        <TableRow
                          key={p._id}
                          className="border-slate-800/60 hover:bg-slate-800/20"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800">
                                {p.images[0] ? (
                                  <img
                                    src={p.images[0]}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Building2
                                    size={20}
                                    className="m-2 text-slate-600"
                                  />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-200">
                                  {p.type || "Property"}{" "}
                                  {p.bhk ? `• ${p.bhk} BHK` : ""}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {p.area ? `${p.area} sq.ft.` : "N/A"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-400">
                            {p.locality || "N/A"}, {p.city || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-blue-400 font-bold">
                            {formatPrice(p.price)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={p.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 border border-white/30 text-white hover:bg-white/20 hover:text-white"
                                >
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-slate-900 border-slate-800 text-white"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePropertyAction(p, "status")
                                  }
                                  className="focus:bg-white focus:text-black cursor-pointer flex gap-2 text-white border border-white/30"
                                >
                                  <Edit3 size={14} /> Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePropertyAction(p, "delete")
                                  }
                                  className="focus:bg-white focus:text-black cursor-pointer flex gap-2 text-white border border-white/30"
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
            </Card>
          )}

          {/* ADD PROPERTY VIEW */}
          {activeTab === "add-property" && (
            <AddPropertyCard properties={properties} />
          )}

          {/* FEATURED PROPERTY VIEW */}
          {activeTab === "featured-property" && (
            <FeaturedPropertyCard properties={properties} />
          )}

          {/* USERS VIEW */}
          {activeTab === "users" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {usersLoading ? (
                <div className="col-span-full flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="col-span-full text-center py-8 text-slate-500">
                  No users found
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <Card
                    key={u._id}
                    className="bg-slate-900/30 border-slate-800/60 hover:border-blue-500/50 transition-colors group"
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-slate-800 group-hover:border-blue-500/50 transition-all">
                        <AvatarFallback className="bg-slate-800 text-blue-500 font-bold">
                          {u.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <CardTitle className="text-md font-bold">
                          {u.name}
                        </CardTitle>
                        <CardDescription className="text-[11px] text-slate-500">
                          {u.email}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 text-center">
                          <p className="text-[9px] text-slate-500 uppercase font-black">
                            Role
                          </p>
                          <p className="text-xs font-bold text-blue-400 capitalize">
                            {u.role}
                          </p>
                        </div>
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 text-center">
                          <p className="text-[9px] text-slate-500 uppercase font-black">
                            Member Since
                          </p>
                          <p className="text-xs font-bold text-slate-300">
                            {formatDate(u.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {u.isBlocked ? (
                            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                              Blocked
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 ">
                              Active
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[11px] h-7 bg-white text-gray-800 hover:bg-gray-900 hover:text-gray-100 hover:border-gray-100 border border-white/30 cursor-pointer"
                            >
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-slate-900 border-slate-800 text-slate-200"
                          >
                            <DropdownMenuItem
                              onClick={() => handleUserAction(u, "approve")}
                              className="focus:bg-slate-800 cursor-pointer flex gap-2"
                            >
                              <Check size={14} /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUserAction(
                                  u,
                                  u.isBlocked ? "unblock" : "block",
                                )
                              }
                              className="focus:bg-slate-800 cursor-pointer flex gap-2"
                            >
                              {u.isBlocked ? (
                                <Check size={14} />
                              ) : (
                                <Ban size={14} />
                              )}
                              {u.isBlocked ? "Unblock" : "Block"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUserAction(u, "delete")}
                              className="focus:bg-red-950 text-red-400 cursor-pointer flex gap-2"
                            >
                              <Trash2 size={14} /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* BUILDERS VIEW */}
          {activeTab === "builders" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usersLoading ? (
                  <div className="col-span-full flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                  </div>
                ) : (
                  filteredUsers
                    .filter(
                      (u) => u.role === "builder" || u.subRole === "builder",
                    )
                    .map((u) => (
                      <Card
                        key={u._id}
                        className="bg-slate-900/30 border-slate-800/60 hover:border-purple-500/50 transition-colors group"
                      >
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-slate-800 group-hover:border-purple-500/50">
                            <AvatarFallback className="bg-purple-500/20 text-purple-400 font-bold">
                              {u.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <CardTitle className="text-md font-bold text-white">
                              {u.name}
                            </CardTitle>
                            <CardDescription className="text-[11px] text-slate-500">
                              {u.email}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className="bg-purple-500/20 text-purple-400 border-purple-500/40"
                            >
                              Builder
                            </Badge>
                            <span
                              className={`text-xs ${u.isApproved ? "text-green-400" : "text-amber-400"}`}
                            >
                              {u.isApproved ? "Approved" : "Pending"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
              {!usersLoading &&
                filteredUsers.filter(
                  (u) => u.role === "builder" || u.subRole === "builder",
                ).length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No builders found
                  </div>
                )}
            </div>
          )}

          {/* DEALERS VIEW */}
          {activeTab === "dealers" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usersLoading ? (
                  <div className="col-span-full flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                  </div>
                ) : (
                  filteredUsers
                    .filter(
                      (u) => u.role === "dealer" || u.subRole === "dealer",
                    )
                    .map((u) => (
                      <Card
                        key={u._id}
                        className="bg-slate-900/30 border-slate-800/60 hover:border-amber-500/50 transition-colors group"
                      >
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-slate-800 group-hover:border-amber-500/50">
                            <AvatarFallback className="bg-amber-500/20 text-amber-400 font-bold">
                              {u.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <CardTitle className="text-md font-bold text-white">
                              {u.name}
                            </CardTitle>
                            <CardDescription className="text-[11px] text-slate-500">
                              {u.email}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className="bg-amber-500/20 text-amber-400 border-amber-500/40"
                            >
                              Dealer
                            </Badge>
                            <span
                              className={`text-xs ${u.isApproved ? "text-green-400" : "text-amber-400"}`}
                            >
                              {u.isApproved ? "Approved" : "Pending"}
                            </span>
                          </div>
                          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                            <p className="text-[9px] text-slate-500 uppercase font-black">
                              Commission
                            </p>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={u.commissionPercent || 0}
                                onChange={(e) =>
                                  updateUserMutation.mutate({
                                    id: u._id,
                                    data: {
                                      commissionPercent: Number(e.target.value),
                                    },
                                  })
                                }
                                className="bg-slate-900 border-slate-700 text-white text-sm h-8"
                                placeholder="0-100"
                              />
                              <span className="text-slate-400 text-sm">%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
              {!usersLoading &&
                filteredUsers.filter(
                  (u) => u.role === "dealer" || u.subRole === "dealer",
                ).length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No dealers found
                  </div>
                )}
            </div>
          )}
        </div>
      </main>

      {/* PROPERTY STATUS DIALOG */}
      <Dialog open={propertyDialogOpen} onOpenChange={setPropertyDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>Update Property Status</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Type</p>
                  <p className="font-semibold">
                    {selectedProperty.type || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Location</p>
                  <p className="font-semibold">
                    {selectedProperty.locality || "N/A"},{" "}
                    {selectedProperty.city || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Price</p>
                  <p className="font-semibold text-blue-400">
                    {formatPrice(selectedProperty.price)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Current Status</p>
                  <StatusBadge status={selectedProperty.status} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Change Status</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "pending",
                    "new",
                    "launched",
                    "ready",
                    "under-construction",
                    "rejected",
                  ].map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updatePropertyMutation.mutate({
                          id: selectedProperty._id,
                          data: { status },
                        })
                      }
                      disabled={updatePropertyMutation.isPending}
                      className={
                        selectedProperty.status === status
                          ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:text-white cursor-pointer"
                          : "bg-transparent border border-white/30 text-white hover:bg-white hover:text-black cursor-pointer"
                      }
                    >
                      {status === "under-construction"
                        ? "Under Construction"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPropertyDialogOpen(false);
                setSelectedProperty(null);
              }}
              className="bg-transparent border border-white/30 text-white hover:bg-white hover:text-black cursor-pointer"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-slate-300 py-4">
            Are you sure you want to logout from the admin panel?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="border-slate-600 text-slate-800 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              onClick={() => {
                setLogoutDialogOpen(false);
                signOut({ callbackUrl: "/welcome" });
              }}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// SUB-COMPONENTS

function AddPropertyCard({ properties }: { properties: Property[] }) {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPrice = (price?: number) => {
    if (!price && price !== 0) return "N/A";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
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
    video: null as File | null,
    youtube: "",
  });

  const selectedProperty = properties.find((p) => p._id === selectedPropertyId);

  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    const property = properties.find((p) => p._id === propertyId);
    if (property) {
      setFormData({
        purpose: property.purpose || "rent",
        category: property.category || "",
        type: property.type || "",
        roomType: property.roomType || "",
        gender: property.gender || "",
        food: property.food || "",
        status: property.status || "pending",
        city: property.city || "",
        locality: property.locality || "",
        bhk: property.bhk?.toString() || "",
        bed: property.bed?.toString() || "",
        bath: property.bath?.toString() || "",
        bal: property.bal?.toString() || "",
        furnish: property.furnish || "",
        age: property.age || "",
        price: property.price?.toString() || "",
        pricePerSqft: property.pricePerSqft?.toString() || "",
        deposit: property.deposit?.toString() || "",
        maintenance: property.maintenance?.toString() || "",
        description: property.description || "",
        tenant: property.tenant || "",
        broker: property.broker || "",
        area: property.area?.toString() || "",
        areaUnit: property.areaUnit || "sq.ft.",
        availableFrom: property.availableFrom || "",
        ownership: property.ownership || "Freehold",
        negotiable: property.negotiable || "Yes",
        maintenanceType: property.maintenanceType || "Included",
        images: [],
        video: null,
        youtube: "",
      });
    }
  };

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
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageFiles],
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
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
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, video: file }));
    }
  };

  const removeVideo = () => {
    setFormData((prev) => ({ ...prev, video: null }));
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
      video: null,
      youtube: "",
    });
    setSelectedPropertyId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hasImages = formData.images.length > 0;
      const hasVideo = formData.video !== null;

      if (hasImages || hasVideo) {
        const fd = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if (key === "images") {
            (value as File[]).forEach((file) => {
              fd.append("images", file);
            });
          } else if (key === "video" && value) {
            fd.append("video", value as File);
          } else if (value !== undefined && value !== null && value !== "") {
            fd.append(key, value.toString());
          }
        });

        if (selectedPropertyId) {
          await axios.patch(`/api/admin/properties/${selectedPropertyId}`, fd);
          toast.success("Property updated successfully");
        } else {
          await axios.post("/api/admin/properties", fd);
          toast.success("Property created successfully");
        }
      } else {
        const payload: Record<string, unknown> = {};

        Object.entries(formData).forEach(([key, value]) => {
          if (key !== "images" && key !== "video" && key !== "youtube") {
            if (value !== undefined && value !== null && value !== "") {
              if (
                [
                  "bhk",
                  "bed",
                  "bath",
                  "bal",
                  "price",
                  "pricePerSqft",
                  "deposit",
                  "maintenance",
                  "area",
                ].includes(key)
              ) {
                payload[key] = value ? parseInt(value.toString()) : undefined;
              } else {
                payload[key] = value;
              }
            }
          }
        });

        if (selectedPropertyId) {
          await axios.patch(
            `/api/admin/properties/${selectedPropertyId}`,
            payload,
          );
          toast.success("Property updated successfully");
        } else {
          await axios.post("/api/admin/properties", payload);
          toast.success("Property created successfully");
        }
      }
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      resetForm();
    } catch (error) {
      toast.error("Failed to save property");
    }
  };

  const inputClass =
    "bg-slate-900/50 border-slate-700 text-slate-200 text-sm focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "text-xs font-bold text-slate-500 uppercase mb-1 block";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Selection */}
        <Card className="bg-slate-900/30 border-slate-800/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-blue-500" />
              {selectedPropertyId ? "Update Property" : "Select Property"}
            </CardTitle>
            <CardDescription className="text-slate-500 text-[10px]">
              Choose an existing property to edit or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={labelClass}>Select Existing Property</label>
              <select
                value={selectedPropertyId}
                onChange={(e) => handleSelectProperty(e.target.value)}
                className={`w-full ${inputClass} rounded-md p-2`}
              >
                <option value="">-- Create New Property --</option>
                {properties.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.type || "Property"} - {p.locality || "N/A"},{" "}
                    {p.city || "N/A"}
                  </option>
                ))}
              </select>
            </div>

            {selectedProperty && (
              <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">
                  Current Details
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Type:</span>
                    <span className="text-slate-200 ml-2">
                      {selectedProperty.type || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">BHK:</span>
                    <span className="text-slate-200 ml-2">
                      {selectedProperty.bhk || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Area:</span>
                    <span className="text-slate-200 ml-2">
                      {selectedProperty.area
                        ? `${selectedProperty.area} sq.ft.`
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Price:</span>
                    <span className="text-blue-400 ml-2 font-bold">
                      {formatPrice(selectedProperty.price)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-200 ml-2">
                      {selectedProperty.locality || "N/A"},{" "}
                      {selectedProperty.city || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Form - Column 2 & 3 */}
        <Card className="lg:col-span-2 bg-slate-900/30 border-slate-800/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <PlusCircle
                size={16}
                className={
                  selectedPropertyId ? "text-amber-500" : "text-emerald-500"
                }
              />
              {selectedPropertyId
                ? "Update Property Details"
                : "Add New Property"}
            </CardTitle>
            <CardDescription className="text-slate-500 text-[10px]">
              Fill in the property details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Details */}
              <div className="border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-blue-400 uppercase mb-3">
                  Basic Details
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className={labelClass}>Purpose *</label>
                    <select
                      value={formData.purpose}
                      onChange={(e) =>
                        setFormData({ ...formData, purpose: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Property Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                      required
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
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="pending">Pending</option>
                      <option value="new">New</option>
                      <option value="launched">Launched</option>
                      <option value="ready">Ready</option>
                      <option value="under-construction">
                        Under Construction
                      </option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-blue-400 uppercase mb-3">
                  Location Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>City *</label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="e.g., Mumbai"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Locality *</label>
                    <Input
                      value={formData.locality}
                      onChange={(e) =>
                        setFormData({ ...formData, locality: e.target.value })
                      }
                      placeholder="e.g., Andheri West"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Property Profile */}
              <div className="border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-blue-400 uppercase mb-3">
                  Property Profile
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className={labelClass}>BHK</label>
                    <select
                      value={formData.bhk}
                      onChange={(e) =>
                        setFormData({ ...formData, bhk: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      <option value="1">1 BHK</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4 BHK</option>
                      <option value="5">5 BHK</option>
                      <option value="6">6+ BHK</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Bedrooms</label>
                    <select
                      value={formData.bed}
                      onChange={(e) =>
                        setFormData({ ...formData, bed: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms</label>
                    <select
                      value={formData.bath}
                      onChange={(e) =>
                        setFormData({ ...formData, bath: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Balconies</label>
                    <select
                      value={formData.bal}
                      onChange={(e) =>
                        setFormData({ ...formData, bal: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Furnishing</label>
                    <select
                      value={formData.furnish}
                      onChange={(e) =>
                        setFormData({ ...formData, furnish: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      <option value="furnished">Furnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="unfurnished">Unfurnished</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Property Age</label>
                    <select
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-5 years">1-5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Area (sq.ft.)</label>
                    <Input
                      type="number"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      placeholder="e.g., 1200"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Area Unit</label>
                    <select
                      value={formData.areaUnit}
                      onChange={(e) =>
                        setFormData({ ...formData, areaUnit: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="sq.ft.">sq.ft.</option>
                      <option value="sq.m.">sq.m.</option>
                      <option value="sq.yards">sq.yards</option>
                      <option value="acres">acres</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-blue-400 uppercase mb-3">
                  Pricing Details
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className={labelClass}>Price (₹) *</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="e.g., 5000000"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Price per sq.ft.</label>
                    <Input
                      type="number"
                      value={formData.pricePerSqft}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricePerSqft: e.target.value,
                        })
                      }
                      placeholder="e.g., 5000"
                      className={inputClass}
                    />
                  </div>
                  {formData.purpose !== "sell" && (
                    <>
                      <div>
                        <label className={labelClass}>Deposit (₹)</label>
                        <Input
                          type="number"
                          value={formData.deposit}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              deposit: e.target.value,
                            })
                          }
                          placeholder="e.g., 50000"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Maintenance (₹)</label>
                        <Input
                          type="number"
                          value={formData.maintenance}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maintenance: e.target.value,
                            })
                          }
                          placeholder="e.g., 2000"
                          className={inputClass}
                        />
                      </div>
                    </>
                  )}
                  {formData.purpose === "sell" && (
                    <div>
                      <label className={labelClass}>Ownership</label>
                      <select
                        value={formData.ownership}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ownership: e.target.value,
                          })
                        }
                        className={`w-full ${inputClass} rounded-md p-2`}
                      >
                        <option value="Freehold">Freehold</option>
                        <option value="Leasehold">Leasehold</option>
                        <option value="Co-operative Society">
                          Co-operative Society
                        </option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Negotiable</label>
                    <select
                      value={formData.negotiable}
                      onChange={(e) =>
                        setFormData({ ...formData, negotiable: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  {formData.purpose === "rent" && (
                    <div>
                      <label className={labelClass}>Available From</label>
                      <Input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availableFrom: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase mb-3">
                  Additional Information
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {formData.purpose === "rent" && (
                    <div>
                      <label className={labelClass}>Tenant Type</label>
                      <select
                        value={formData.tenant}
                        onChange={(e) =>
                          setFormData({ ...formData, tenant: e.target.value })
                        }
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              roomType: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
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
                          onChange={(e) =>
                            setFormData({ ...formData, food: e.target.value })
                          }
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
                    <select
                      value={formData.broker}
                      onChange={(e) =>
                        setFormData({ ...formData, broker: e.target.value })
                      }
                      className={`w-full ${inputClass} rounded-md p-2`}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your property..."
                    className={`w-full ${inputClass} rounded-md p-2`}
                    rows={3}
                  />
                </div>
              </div>

              {/* Photos & Videos */}
              <div className="border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-blue-400 uppercase mb-3">
                  Photos & Videos
                </p>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <Building2 size={24} className="text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-400">
                      Drag & drop images here, or{" "}
                      <span
                        className="text-blue-400 cursor-pointer hover:underline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        browse
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">
                      Supports: JPG, PNG, WEBP (Max 10MB each)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">
                      {formData.images.length} image
                      {formData.images.length > 1 ? "s" : ""} selected
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                            onClick={() =>
                              setImagePreview(URL.createObjectURL(img))
                            }
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Upload */}
                <div className="mt-4">
                  <label className={labelClass}>Video (Optional)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className={`w-full ${inputClass} rounded-md p-2`}
                  />
                  {formData.video && (
                    <div className="mt-2 relative inline-block">
                      <video
                        src={URL.createObjectURL(formData.video)}
                        controls
                        className="h-24 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Image Preview Modal */}
                {imagePreview && (
                  <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setImagePreview(null)}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-[90%] max-h-[90%] rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {selectedPropertyId ? (
                    <>
                      <Edit3 size={16} className="mr-2 " />
                      Update Property
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} className="mr-2" />
                      Add Property
                    </>
                  )}
                </Button>
                {selectedPropertyId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold border ${
        active
          ? "bg-blue-600/10 border-blue-600/20 text-blue-400"
          : "border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-900/50"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function KpiCard({
  title,
  value,
  trend,
  up,
  icon,
}: {
  title: string;
  value: string;
  trend: string;
  up: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-slate-900/30 border-slate-800/60 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-slate-950 rounded-lg text-blue-500 border border-slate-800 shadow-inner">
            {icon}
          </div>
          <Badge
            className={`text-[10px] ${
              up
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-amber-500/10 text-amber-500"
            } border-none`}
          >
            {trend}
          </Badge>
        </div>
        <p className="text-[10px] text-white uppercase font-black tracking-widest">
          {title}
        </p>
        <h3 className="text-2xl font-black mt-1 text-white">{value}</h3>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    launched: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    ready: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "under-construction":
      "bg-orange-500/10 text-orange-500 border-orange-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  const labels: Record<string, string> = {
    "under-construction": "Under Construction",
  };
  return (
    <Badge
      variant="outline"
      className={`text-[9px] uppercase font-bold ${styles[status] || styles.pending}`}
    >
      {labels[status] || status}
    </Badge>
  );
}

function BanCircleSvg({
  size = 24,
  ...props
}: {
  size?: number;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" x2="19.07" y1="4.93" y2="19.07" />
    </svg>
  );
}

function MoreVertical({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function Clock({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UsersTable({
  users,
  updateUserMutation,
  deleteUserMutation,
}: {
  users: User[];
  updateUserMutation: any;
  deleteUserMutation: any;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleBlockUser = (user: User) => {
    updateUserMutation.mutate({
      id: user._id,
      data: { isBlocked: !user.isBlocked },
    });
  };

  const handleApproveUser = (user: User) => {
    updateUserMutation.mutate({ id: user._id, data: { isApproved: true } });
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteUserMutation.mutate(user._id);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!globalFilter) return users;
    const lowerFilter = globalFilter.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(lowerFilter) ||
        user.email?.toLowerCase().includes(lowerFilter) ||
        user.mobile?.toLowerCase().includes(lowerFilter) ||
        user.role?.toLowerCase().includes(lowerFilter),
    );
  }, [users, globalFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [filteredUsers]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage]);

  const totalPages = Math.ceil(sortedUsers.length / pageSize);

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <div className="relative">
          <Users size={56} className="mb-4 text-slate-600" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent blur-xl" />
        </div>
        <p className="text-base font-medium text-slate-400">No users found</p>
        <p className="text-xs text-slate-500 mt-1">
          Registered users will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10" style={{ pointerEvents: "auto" }}>
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-slate-700">
        <Input
          placeholder="Search users..."
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-xs bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
        />
        <span className="text-sm text-slate-400">
          {sortedUsers.length} users
        </span>
      </div>
      <div className="overflow-auto max-h-[500px]">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 hover:bg-transparent">
              <TableHead className="text-slate-400 uppercase text-[10px] font-bold">
                User
              </TableHead>
              <TableHead className="text-slate-400 uppercase text-[10px] font-bold">
                Contact
              </TableHead>
              <TableHead className="text-slate-400 uppercase text-[10px] font-bold">
                Role
              </TableHead>
              <TableHead className="text-slate-400 uppercase text-[10px] font-bold">
                Premium
              </TableHead>
              <TableHead className="text-slate-400 uppercase text-[10px] font-bold">
                Approval
              </TableHead>
              <TableHead className="text-slate-400 uppercase text-[10px] font-bold">
                Status
              </TableHead>
              <TableHead className="text-slate-400 uppercase text-[10px] font-bold">
                Joined
              </TableHead>
              <TableHead className="text-right text-slate-400 uppercase text-[10px] font-bold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user._id}
                className="border-slate-700/50 hover:bg-slate-800/30"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-slate-600">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm font-bold">
                          {user.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user.hasSubscription && (
                        <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5 shadow-md">
                          <Crown size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-sm">
                        {user.name}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-slate-300 text-sm font-mono">
                    {user.mobile || "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${user.role === "builder" ? "bg-purple-500/25 text-purple-300 border-purple-500/40" : user.role === "employee" ? "bg-amber-500/25 text-amber-300 border-amber-500/40" : "bg-emerald-500/25 text-emerald-300 border-emerald-500/40"} text-[10px] font-bold`}
                  >
                    {user.role === "builder"
                      ? "🏗️ Builder"
                      : user.role === "employee"
                        ? "👔 Employee"
                        : "👤 User"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.hasSubscription ? (
                    <div className="flex flex-col">
                      <Badge
                        variant="outline"
                        className="bg-amber-500/25 text-amber-300 border-amber-500/40 text-[10px] font-bold w-fit"
                      >
                        {user.subscriptionExpiry &&
                        new Date(user.subscriptionExpiry) > new Date()
                          ? "✓ Active"
                          : "Expired"}
                      </Badge>
                      {user.subscriptionExpiry && (
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(
                            user.subscriptionExpiry,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500 text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${user.isApproved ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"}`}
                    />
                    <span
                      className={`text-xs font-semibold ${user.isApproved ? "text-emerald-400" : "text-amber-400"}`}
                    >
                      {user.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.isBlocked
                        ? "bg-red-500/25 text-red-300 border-red-500/40 text-[10px] font-bold"
                        : "bg-emerald-500/25 text-emerald-300 border-emerald-500/40 text-[10px] font-bold"
                    }
                  >
                    {user.isBlocked ? "🚫 Blocked" : "✅ Active"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-slate-300 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(user.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {!user.isApproved && (
                      <button
                        onClick={() => handleApproveUser(user)}
                        className="p-1.5 rounded-md hover:bg-emerald-500/20 text-emerald-400 transition-all duration-200"
                        title="Approve User"
                      >
                        <UserCheck size={16} />
                      </button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-md hover:bg-slate-700/60 text-slate-300 transition-all duration-200">
                          <MoreHorizontal size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-slate-900 border-slate-700 min-w-[180px]"
                      >
                        <DropdownMenuItem
                          onClick={() => handleApproveUser(user)}
                          className="text-emerald-400 focus:text-emerald-300 focus:bg-emerald-500/20 cursor-pointer"
                        >
                          <UserCheck size={14} className="mr-2" />
                          Approve User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBlockUser(user)}
                          className={`${user.isBlocked ? "text-emerald-400 focus:text-emerald-300 focus:bg-emerald-500/20" : "text-amber-400 focus:text-amber-300 focus:bg-amber-500/20"} cursor-pointer`}
                        >
                          {user.isBlocked ? (
                            <>
                              <CheckCircle size={14} className="mr-2" />
                              Unblock User
                            </>
                          ) : (
                            <>
                              <Ban size={14} className="mr-2" />
                              Block User
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-400 focus:text-red-300 focus:bg-red-500/20 cursor-pointer"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-slate-900/80 border-t border-slate-700">
          <span className="text-sm text-slate-400">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, sortedUsers.length)} of{" "}
            {sortedUsers.length} users
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
                }
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SubscriptionTable({ users }: { users: User[] }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Subscriber",
        size: 200,
        Cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-amber-500/30">
              <AvatarFallback className="bg-amber-500/20 text-amber-400 text-xs font-bold">
                {row.original.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200">
                {row.original.name}
              </span>
              <span className="text-[10px] text-slate-500">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "mobile",
        header: "Contact",
        size: 130,
        Cell: ({ cell }) => (
          <span className="text-slate-400 text-sm font-mono">
            {(cell.getValue() as string) || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: "Plan Type",
        size: 120,
        Cell: ({ cell }) => {
          const role = cell.getValue() as string;
          return (
            <Badge
              variant="outline"
              className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[9px] font-bold"
            >
              {role.toUpperCase()}
            </Badge>
          );
        },
      },
      {
        accessorKey: "subscriptionExpiry",
        header: "Expires On",
        size: 150,
        Cell: ({ cell }) => {
          const date = cell.getValue() as string;
          const daysLeft = date
            ? Math.ceil(
                (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
              )
            : 0;
          const isExpiringSoon = daysLeft > 0 && daysLeft <= 7;
          const isExpired = daysLeft < 0;

          return (
            <div className="flex flex-col">
              <span
                className={`text-sm font-medium ${isExpired ? "text-red-400" : "text-slate-200"}`}
              >
                {date
                  ? new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
              {date && (
                <span
                  className={`text-[9px] ${isExpiringSoon ? "text-amber-400" : isExpired ? "text-red-400" : "text-slate-500"}`}
                >
                  {isExpired ? "Expired" : `${daysLeft} days left`}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Member Since",
        size: 130,
        Cell: ({ cell }) => (
          <span className="text-slate-400 text-sm">
            {new Date(cell.getValue() as string).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        id: "premium",
        header: "Status",
        size: 110,
        Cell: ({ row }) => {
          const date = row.original.subscriptionExpiry;
          const isActive = date && new Date(date) > new Date();

          return (
            <div className="flex items-center gap-2">
              <Crown
                size={14}
                className={isActive ? "text-amber-400" : "text-slate-500"}
              />
              <span
                className={`text-xs font-bold ${isActive ? "text-amber-400" : "text-slate-500"}`}
              >
                {isActive ? "ACTIVE" : "EXPIRED"}
              </span>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: users,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    enableColumnResizing: true,
    enablePagination: true,
    enableSorting: true,
    enableGlobalFilter: true,
    enableRowSelection: true,
    enableColumnFilters: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "subscriptionExpiry", desc: false }],
      showGlobalFilter: true,
      columnVisibility: {
        mobile: false,
      },
    },
    muiSearchTextFieldProps: {
      placeholder: "Search subscribers...",
      sx: {
        "& .MuiOutlinedInput-root": {
          backgroundColor: "rgba(30, 41, 59, 0.5)",
          color: "#e2e8f0",
          fontSize: "13px",
          "& fieldset": { borderColor: "rgba(71, 85, 105, 0.5)" },
          "&:hover fieldset": { borderColor: "#f59e0b" },
          "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
        },
        "& .MuiInputLabel-root": { color: "#94a3b8" },
        "& .MuiInputAdornment-root": { color: "#64748b" },
      },
      variant: "outlined",
      size: "small",
    },
    muiTablePaperProps: {
      sx: {
        backgroundColor: "transparent",
        boxShadow: "none",
        borderRadius: "12px",
        overflow: "hidden",
      },
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: "transparent",
        maxHeight: "500px",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "rgba(30, 41, 59, 0.3)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(59, 130, 246, 0.8)",
        },
      },
    },
    muiTableProps: {
      sx: {
        backgroundColor: "transparent",
        "& tr": {
          backgroundColor: "transparent",
        },
        "& th": {
          backgroundColor: "rgba(15, 23, 42, 0.8)",
        },
        "& td": {
          backgroundColor: "transparent",
          borderBottom: "1px solid rgba(51, 65, 85, 0.3)",
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        color: "#94a3b8",
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
        padding: "16px",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderBottom: "1px solid rgba(51, 65, 85, 0.3)",
        backgroundColor: "transparent",
        color: "#e2e8f0",
        padding: "14px 16px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(245, 158, 11, 0.05)",
        },
      },
    },
    muiTableFooterCellProps: {
      sx: {
        backgroundColor: "transparent",
        color: "#64748b",
      },
    },
    muiPaginationProps: {
      sx: {
        color: "#94a3b8",
        borderTop: "1px solid rgba(51, 65, 85, 0.3)",
        padding: "12px 16px",
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
          {
            color: "#64748b",
            fontSize: "12px",
          },
        "& .MuiSelect-select": {
          color: "#e2e8f0",
          backgroundColor: "rgba(30, 41, 59, 0.8)",
        },
        "& .Mui-selected": {
          backgroundColor: "rgba(245, 158, 11, 0.2) !important",
          color: "#fbbf24 !important",
          "&:hover": {
            backgroundColor: "rgba(245, 158, 11, 0.3) !important",
          },
        },
        "& .MuiPaginationItem-root": {
          color: "#94a3b8",
          borderColor: "rgba(71, 85, 105, 0.3)",
          "&:hover": {
            backgroundColor: "rgba(245, 158, 11, 0.1)",
          },
        },
      },
      showFirstButton: true,
      showLastButton: true,
    },
    muiTableBodyProps: {
      sx: {
        "& .MuiTableRow-root": {
          "&:last-child .MuiTableCell-root": {
            borderBottom: "none",
          },
        },
      },
    },
  });

  return users.length > 0 ? (
    <div className="relative z-10" style={{ pointerEvents: "auto" }}>
      <MaterialReactTable table={table} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div className="relative">
        <Crown size={56} className="mb-4 text-slate-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent blur-xl" />
      </div>
      <p className="text-base font-medium text-slate-400">
        No premium subscribers yet
      </p>
      <p className="text-xs text-slate-600 mt-1">
        Users with active subscriptions will appear here
      </p>
    </div>
  );
}

function FeaturedPropertyCard({ properties }: { properties: Property[] }) {
  const queryClient = useQueryClient();

  const featuredProperties = properties.filter((p: any) => p.featured === true);
  const nonFeaturedProperties = properties.filter((p: any) => !p.featured);

  const markFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(`/api/admin/properties/${id}`, {
        featured: true,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property marked as featured");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
    },
    onError: () => {
      toast.error("Failed to mark property as featured");
    },
  });

  const removeFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.patch(`/api/admin/properties/${id}`, {
        featured: false,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property removed from featured");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
    },
    onError: () => {
      toast.error("Failed to remove featured property");
    },
  });

  const formatPrice = (price?: number) => {
    if (!price && price !== 0) return "N/A";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <Star className="text-amber-500" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Featured Property</h2>
          <p className="text-sm text-slate-400">
            Manage properties displayed in the Featured section
          </p>
        </div>
      </div>

      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Star size={16} className="text-amber-500" />
          Currently Featured ({featuredProperties.length})
        </h3>

        {featuredProperties.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">
            No featured properties yet. Mark properties as featured below.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProperties.map((property) => (
              <div
                key={property._id}
                className="bg-slate-950/50 border border-slate-800 rounded-lg p-3"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-16 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={property.images?.[0] || "/noimage.png"}
                      alt={property.type}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-500 font-bold text-sm">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-white text-xs font-medium truncate">
                      {property.type}
                    </p>
                    <p className="text-slate-500 text-[10px] truncate">
                      {property.locality}, {property.city}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFeaturedMutation.mutate(property._id)}
                  disabled={removeFeaturedMutation.isPending}
                  className="w-full mt-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 transition cursor-pointer"
                >
                  Remove from Featured
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          All Properties ({nonFeaturedProperties.length})
        </h3>

        {nonFeaturedProperties.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">
            No properties available to feature.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nonFeaturedProperties.map((property) => (
              <div
                key={property._id}
                className="bg-slate-950/50 border border-slate-800 rounded-lg p-3"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-16 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={property.images?.[0] || "/noimage.png"}
                      alt={property.type}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-slate-300 text-xs font-medium truncate">
                      {property.type}
                    </p>
                    <p className="text-slate-500 text-[10px] truncate">
                      {property.locality}, {property.city}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => markFeaturedMutation.mutate(property._id)}
                  disabled={markFeaturedMutation.isPending}
                  className="w-full mt-3 py-1.5 text-xs font-medium text-amber-500 border border-amber-500/30 rounded hover:bg-amber-500/10 transition cursor-pointer"
                >
                  Mark as Featured
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
