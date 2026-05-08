import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

// GET: Retrieve maintenance mode setting
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get the maintenance mode setting (default to false if not set)
    const maintenanceModeDoc = await Settings.findOne({ key: "maintenanceMode" });
    const maintenanceMode = maintenanceModeDoc ? maintenanceModeDoc.value : false;
    
    return NextResponse.json({ maintenanceMode });
  } catch (error) {
    console.error("Error fetching maintenance mode:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintenance mode" },
      { status: 500 }
    );
  }
}

// POST: Update maintenance mode setting
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { maintenanceMode } = await request.json();
    
    // Validate input
    if (typeof maintenanceMode !== "boolean") {
      return NextResponse.json(
        { error: "maintenanceMode must be a boolean" },
        { status: 400 }
      );
    }
    
    // Update or create the maintenance mode setting
    await Settings.findOneAndUpdate(
      { key: "maintenanceMode" },
      { value: maintenanceMode },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      maintenanceMode 
    });
  } catch (error) {
    console.error("Error updating maintenance mode:", error);
    return NextResponse.json(
      { error: "Failed to update maintenance mode" },
      { status: 500 }
    );
  }
}