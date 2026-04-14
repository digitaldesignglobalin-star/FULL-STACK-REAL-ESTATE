import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import User from "@/models/user.model";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    
    if (!token?.email || token?.role !== "employee") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const [
      totalProperties,
      pendingProperties,
      activeProperties,
      totalUsers,
      blockedUsers,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: "pending" }),
      Property.countDocuments({ status: { $in: ["new", "launched", "ready"] } }),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ isBlocked: true }),
    ]);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const [newPropertiesLastWeek, newUsersLastWeek] = await Promise.all([
      Property.countDocuments({ createdAt: { $gte: last7Days } }),
      User.countDocuments({ createdAt: { $gte: last7Days } }),
    ]);

    const propertiesByStatus = await Property.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const propertiesCount = await Property.countDocuments({ 
        createdAt: { $gte: startOfDay, $lte: endOfDay } 
      });

      dailyStats.push({
        day: startOfDay.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        listings: propertiesCount,
      });
    }

    const recentInquiries = await Property.aggregate([
      {
        $match: {
          inquiries: { $exists: true, $ne: [] }
        }
      },
      { $unwind: "$inquiries" },
      { $sort: { "inquiries.createdAt": -1 } },
      { $limit: 10 },
      {
        $project: {
          propertyId: "$_id",
          propertyType: "$type",
          propertyCity: "$city",
          inquiry: "$inquiries",
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalProperties,
        pendingProperties,
        activeProperties,
        newPropertiesLastWeek,
        totalUsers,
        blockedUsers,
        newUsersLastWeek,
      },
      propertiesByStatus,
      dailyStats,
      recentInquiries,
    });
  } catch (error) {
    console.error("Employee stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}