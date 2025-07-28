import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Get featured causes (we can make this configurable later)
    // For now, let's get the most recent 6 causes with high priority
    const featuredQuery = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email, 
        cat.name as category_name,
        cat.display_name as category_display_name
      FROM causes c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.status = 'active'
      ORDER BY 
        CASE c.priority 
          WHEN 'critical' THEN 4
          WHEN 'high' THEN 3  
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 1
          ELSE 0
        END DESC,
        c.created_at DESC
      LIMIT 6
    `;

    const featuredCauses = await Database.query(featuredQuery, []);

    return NextResponse.json({
      success: true,
      data: featuredCauses,
    });
  } catch (error) {
    console.error("Error fetching featured causes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch featured causes" },
      { status: 500 }
    );
  }
}