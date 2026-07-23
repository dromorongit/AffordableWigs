import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [totalRevenue, totalStyledOrders, allServicesStats, topServices] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$stylingTotal" } } },
      ]),
      Order.countDocuments({ paymentStatus: "paid", stylingTotal: { $gt: 0 } }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $unwind: "$items" },
        { $group: { _id: "$items.stylingType", count: { $sum: 1 }, revenue: { $sum: { $multiply: ["$items.stylingPrice", "$items.quantity"] } } } },
        { $sort: { count: -1 } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $unwind: "$items" },
        { $match: { "items.stylingType": { $ne: "none" } } },
        { $group: { _id: "$items.stylingName", count: { $sum: 1 }, revenue: { $sum: { $multiply: ["$items.stylingPrice", "$items.quantity"] } } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const stylingRevenue = totalRevenue[0]?.total || 0;
    const totalOrders = await Order.countDocuments({ paymentStatus: "paid" });
    const percentageWithStyling = totalOrders > 0 ? ((totalStyledOrders / totalOrders) * 100).toFixed(1) : "0";

    let mostPopular = "N/A";
    if (allServicesStats.length > 0) {
      const { StylingService } = await import("@/models/index");
      const services = await StylingService.find({}).lean();
      const nameMap = new Map(services.map((s: any) => [s.slug, s.name]));
      const top = allServicesStats[0];
      mostPopular = nameMap.get(top._id) || top._id;
    }

    return NextResponse.json({
      totalStylingRevenue: stylingRevenue,
      totalStyledOrders,
      mostPopularStylingService: mostPopular,
      top5StylingServices: topServices.map((s: any) => ({
        name: s._id,
        count: s.count,
        revenue: s.revenue,
      })),
      percentageWithStyling,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching styling analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch styling analytics" },
      { status: 500 }
    );
  }
}
