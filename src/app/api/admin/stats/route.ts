import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Property from "@/models/property.model";

export async function GET() {
  try {
    await connectDB();

    const [
      totalUsers,
      totalBuilders,
      totalDealers,
      totalProperties,
      pendingProperties,
      activeProperties,
      blockedUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "builder" }),
      User.countDocuments({ role: "dealer" }),
      Property.countDocuments(),
      Property.countDocuments({ status: "pending" }),
      Property.countDocuments({ status: { $in: ["new", "launched", "ready"] } }),
      User.countDocuments({ isBlocked: true }),
    ]);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const [newUsersLastWeek, newPropertiesLastWeek] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: last7Days } }),
      Property.countDocuments({ createdAt: { $gte: last7Days } }),
    ]);

    const totalRevenueResult = await Property.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const propertiesByStatus = await Property.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const propertiesByCity = await Property.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const [usersCount, propertiesCount] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
        Property.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
      ]);

      dailyStats.push({
        day: startOfDay.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        users: usersCount,
        listings: propertiesCount,
      });
    }

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const usersByRoleOverTime = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const roleStats = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]);

      const roleData: Record<string, string | number> = { day: startOfDay.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) };
      ["user", "builder", "dealer", "employee", "admin"].forEach((role) => {
        const found = roleStats.find((r) => r._id === role);
        roleData[role] = found ? found.count : 0;
      });

      usersByRoleOverTime.push(roleData);
    }

    const subscriptionUsers = await User.find({
      hasSubscription: true,
      subscriptionExpiry: { $gt: new Date() },
    })
      .select("name email mobile role hasSubscription subscriptionExpiry createdAt")
      .sort({ subscriptionExpiry: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalBuilders,
        totalDealers,
        totalProperties,
        pendingProperties,
        activeProperties,
        blockedUsers,
        newUsersLastWeek,
        newPropertiesLastWeek,
        totalRevenue,
      },
      propertiesByStatus,
      propertiesByCity,
      dailyStats,
      usersByRole,
      usersByRoleOverTime,
      subscriptionUsers,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
