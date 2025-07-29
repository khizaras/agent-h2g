import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !(session.user as any)?.is_admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    // Get overall statistics
    const [
      totalUsersResult,
      totalCausesResult,
      activeCausesResult,
      completedCausesResult,
      totalCommentsResult,
      pendingCommentsResult,
    ] = await Promise.all([
      Database.query("SELECT COUNT(*) as count FROM users"),
      Database.query("SELECT COUNT(*) as count FROM causes"),
      Database.query("SELECT COUNT(*) as count FROM causes WHERE status = 'active'"),
      Database.query("SELECT COUNT(*) as count FROM causes WHERE status = 'completed'"),
      Database.query("SELECT COUNT(*) as count FROM comments"),
      Database.query("SELECT COUNT(*) as count FROM comments WHERE is_approved = FALSE"),
    ]);

    // Calculate monthly growth (users created in last 30 days vs previous 30 days)
    const [currentMonthUsers, previousMonthUsers] = await Promise.all([
      Database.query(
        "SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
      ),
      Database.query(
        "SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)"
      ),
    ]);

    const currentCount = currentMonthUsers[0]?.count || 0;
    const previousCount = previousMonthUsers[0]?.count || 1; // Avoid division by zero
    const monthlyGrowth = previousCount > 0 ? ((currentCount - previousCount) / previousCount) * 100 : 0;

    const stats = {
      totalUsers: totalUsersResult[0]?.count || 0,
      totalCauses: totalCausesResult[0]?.count || 0,
      activeCauses: activeCausesResult[0]?.count || 0,
      completedCauses: completedCausesResult[0]?.count || 0,
      totalComments: totalCommentsResult[0]?.count || 0,
      pendingApprovals: pendingCommentsResult[0]?.count || 0,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      totalDonations: 0, // Placeholder - implement when donations table exists
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}