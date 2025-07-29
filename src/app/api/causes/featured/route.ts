import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Get featured causes - prioritize manually featured causes first
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
      WHERE c.status = 'active' AND (c.is_featured = 1 OR c.is_featured = TRUE)
      ORDER BY 
        c.created_at DESC
      LIMIT 6
    `;

    let featuredCauses = await Database.query(featuredQuery, []);

    // If we don't have enough featured causes, fill with high priority causes
    if (featuredCauses.length < 3) {
      const fallbackQuery = `
        SELECT 
          c.*,
          u.name as user_name,
          u.email as user_email, 
          cat.name as category_name,
          cat.display_name as category_display_name
        FROM causes c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        WHERE c.status = 'active' AND (c.is_featured = 0 OR c.is_featured = FALSE OR c.is_featured IS NULL)
        ORDER BY 
          CASE c.priority 
            WHEN 'critical' THEN 4
            WHEN 'high' THEN 3  
            WHEN 'medium' THEN 2
            WHEN 'low' THEN 1
            ELSE 0
          END DESC,
          c.created_at DESC
        LIMIT ${6 - featuredCauses.length}
      `;

      const fallbackCauses = await Database.query(fallbackQuery, []);
      featuredCauses = [...featuredCauses, ...fallbackCauses];
    }

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