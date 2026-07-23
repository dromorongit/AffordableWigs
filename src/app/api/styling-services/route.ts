import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import StylingService from "@/models/StylingService";

const BUILD_ID = process.env.BUILD_ID || "unknown-build";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    console.log("[forensic] mongoose.connection.readyState:", mongoose.connection.readyState);
    console.log("[forensic] mongoose.connection.host:", mongoose.connection.host);
    console.log("[forensic] mongoose.connection.db.databaseName:", mongoose.connection.db?.databaseName);
    console.log("[forensic] StylingService.collection.name:", StylingService.collection.name);

    const allDocs = await StylingService.find({}).lean();
    console.log("[forensic] allDocs.length:", allDocs.length);
    console.log("[forensic] allDocs:", JSON.stringify(allDocs));

    const activeDocs = await StylingService.find({ isActive: true }).lean();
    console.log("[forensic] activeDocs.length:", activeDocs.length);
    console.log("[forensic] activeDocs:", JSON.stringify(activeDocs));

    const uri = process.env.MONGODB_URI || "";
    const maskedUri = (() => {
      try {
        const url = new URL(uri);
        return `${url.protocol}//${url.username ? url.username + ":****@" : ""}${url.host}${url.pathname}`;
      } catch {
        return "invalid-uri";
      }
    })();

    const services = await StylingService.find({
      isActive: { $ne: false },
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    const formatted = services.map((s) => ({
      _id: s._id.toString(),
      name: s.name,
      slug: s.slug,
      description: s.description,
      price: s.price,
      sortOrder: s.sortOrder,
      estimatedDuration: s.estimatedDuration,
    }));

    console.log(
      "[forensic] formatted array before prepending No Styling:",
      JSON.stringify(formatted)
    );

    const result = [
      { _id: "none", name: "No Styling", price: 0, description: "" },
      ...formatted,
    ];

    const response = {
      services: result,
      buildId: BUILD_ID,
      _meta: {
        buildId: BUILD_ID,
        nodeEnv: process.env.NODE_ENV,
        mongooseHost: mongoose.connection.host,
        mongooseDbName: mongoose.connection.name,
        mongooseConnectionDbName: (() => {
          try {
            return mongoose.connection.db?.databaseName || "unknown";
          } catch {
            return "unknown";
          }
        })(),
        maskedMongoUri: maskedUri,
        gitHead: "859eabe19504e2e5598331ea21e99983f24d35cd",
        routeFile: "src/app/api/styling-services/route.ts",
      }
    };

    console.log("[forensic] final response object:", JSON.stringify(response));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching styling services:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch styling services",
        buildId: BUILD_ID,
        _meta: {
          buildId: BUILD_ID,
          nodeEnv: process.env.NODE_ENV,
          mongooseHost: mongoose.connection.host,
          mongooseDbName: mongoose.connection.name,
          maskedMongoUri: (() => {
            try {
              const url = new URL(process.env.MONGODB_URI || "");
              return `${url.protocol}//${url.username ? url.username + ":****@" : ""}${url.host}${url.pathname}`;
            } catch {
              return "invalid-uri";
            }
          })(),
        }
      },
      { status: 500 }
    );
  }
}
