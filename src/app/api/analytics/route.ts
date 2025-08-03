import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "30d"; // 7d, 30d, 90d, 1y
    const type = searchParams.get("type") || "overview"; // overview, causes, donations, users

    // Calculate date range based on timeframe
    let dateCondition = "";
    const now = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    dateCondition = "WHERE created_at >= ?";
    const dateParam = startDate.toISOString().split("T")[0];

    if (type === "overview") {
      // Platform overview analytics
      const [
        totalUsers,
        totalCauses,
        totalDonations,
        activeUsers,
        newUsersThisPeriod,
        newCausesThisPeriod,
        donationsThisPeriod,
        topCategories,
        recentActivity,
      ] = await Promise.all([
        // Total users
        Database.query("SELECT COUNT(*) as count FROM users") as Promise<any[]>,

        // Total causes
        Database.query("SELECT COUNT(*) as count FROM causes") as Promise<
          any[]
        >,

        // Total donations
        Database.query(`
          SELECT 
            COUNT(*) as total_donations,
            COALESCE(SUM(amount), 0) as total_amount
          FROM cause_supporters
        `) as Promise<any[]>,

        // Active users (logged in last 30 days)
        Database.query(`
          SELECT COUNT(*) as count 
          FROM users 
          WHERE last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `) as Promise<any[]>,

        // New users this period
        Database.query(
          `
          SELECT COUNT(*) as count 
          FROM users 
          ${dateCondition}
        `,
          [dateParam],
        ) as Promise<any[]>,

        // New causes this period
        Database.query(
          `
          SELECT COUNT(*) as count 
          FROM causes 
          ${dateCondition}
        `,
          [dateParam],
        ) as Promise<any[]>,

        // Donations this period
        Database.query(
          `
          SELECT 
            COUNT(*) as count,
            COALESCE(SUM(amount), 0) as total_amount
          FROM cause_supporters 
          ${dateCondition}
        `,
          [dateParam],
        ) as Promise<any[]>,

        // Top categories
        Database.query(`
          SELECT 
            cat.name,
            cat.color,
            COUNT(c.id) as cause_count,
            COALESCE(SUM(c.current_amount), 0) as total_raised
          FROM categories cat
          LEFT JOIN causes c ON cat.id = c.category_id
          GROUP BY cat.id, cat.name, cat.color
          ORDER BY cause_count DESC
          LIMIT 5
        `) as Promise<any[]>,

        // Recent activity
        Database.query(`
          SELECT 
            'cause_created' as activity_type,
            c.title as description,
            c.created_at,
            u.name as user_name
          FROM causes c
          LEFT JOIN users u ON c.user_id = u.id
          WHERE c.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          
          UNION ALL
          
          SELECT 
            'donation' as activity_type,
            CONCAT('Donated to ', c.title) as description,
            cs.created_at,
            u.name as user_name
          FROM cause_supporters cs
          LEFT JOIN causes c ON cs.cause_id = c.id
          LEFT JOIN users u ON cs.user_id = u.id
          WHERE cs.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          
          ORDER BY created_at DESC
          LIMIT 10
        `) as Promise<any[]>,
      ]);

      return NextResponse.json({
        success: true,
        data: {
          overview: {
            total_users: totalUsers[0]?.count || 0,
            total_causes: totalCauses[0]?.count || 0,
            total_donations: totalDonations[0]?.total_donations || 0,
            total_amount_raised: totalDonations[0]?.total_amount || 0,
            active_users: activeUsers[0]?.count || 0,
          },
          period_stats: {
            timeframe,
            new_users: newUsersThisPeriod[0]?.count || 0,
            new_causes: newCausesThisPeriod[0]?.count || 0,
            donations_count: donationsThisPeriod[0]?.count || 0,
            donations_amount: donationsThisPeriod[0]?.total_amount || 0,
          },
          top_categories: topCategories || [],
          recent_activity: recentActivity || [],
        },
      });
    } else if (type === "causes") {
      // Causes analytics
      const [
        causesByStatus,
        causesByCategory,
        topPerformingCauses,
        causeTrends,
      ] = await Promise.all([
        // Causes by status
        Database.query(`
          SELECT 
            status,
            COUNT(*) as count
          FROM causes
          GROUP BY status
        `) as Promise<any[]>,

        // Causes by category
        Database.query(`
          SELECT 
            cat.name,
            cat.color,
            COUNT(c.id) as count,
            COALESCE(AVG(c.current_amount / NULLIF(c.goal_amount, 0) * 100), 0) as avg_progress
          FROM categories cat
          LEFT JOIN causes c ON cat.id = c.category_id
          GROUP BY cat.id, cat.name, cat.color
          ORDER BY count DESC
        `) as Promise<any[]>,

        // Top performing causes
        Database.query(`
          SELECT 
            c.id,
            c.title,
            c.goal_amount,
            c.current_amount,
            (c.current_amount / c.goal_amount * 100) as progress_percentage,
            cat.name as category_name,
            u.name as creator_name,
            COALESCE(cs.supporter_count, 0) as supporter_count
          FROM causes c
          LEFT JOIN categories cat ON c.category_id = cat.id
          LEFT JOIN users u ON c.user_id = u.id
          LEFT JOIN (
            SELECT cause_id, COUNT(*) as supporter_count 
            FROM cause_supporters 
            GROUP BY cause_id
          ) cs ON c.id = cs.cause_id
          WHERE c.status = 'active'
          ORDER BY progress_percentage DESC, supporter_count DESC
          LIMIT 10
        `) as Promise<any[]>,

        // Cause creation trends
        Database.query(`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as count
          FROM causes
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        `) as Promise<any[]>,
      ]);

      return NextResponse.json({
        success: true,
        data: {
          causes_by_status: causesByStatus || [],
          causes_by_category: causesByCategory || [],
          top_performing_causes: topPerformingCauses || [],
          creation_trends: causeTrends || [],
        },
      });
    } else if (type === "donations") {
      // Donations analytics
      const [donationStats, donationTrends, topDonors, averageDonations] =
        await Promise.all([
          // Overall donation stats
          Database.query(`
          SELECT 
            COUNT(*) as total_donations,
            COALESCE(SUM(amount), 0) as total_amount,
            COALESCE(AVG(amount), 0) as average_amount,
            MIN(amount) as min_amount,
            MAX(amount) as max_amount
          FROM cause_supporters
        `) as Promise<any[]>,

          // Donation trends
          Database.query(`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as donation_count,
            COALESCE(SUM(amount), 0) as total_amount
          FROM cause_supporters
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        `) as Promise<any[]>,

          // Top donors
          Database.query(`
          SELECT 
            u.name,
            u.email,
            COUNT(cs.id) as donation_count,
            COALESCE(SUM(cs.amount), 0) as total_donated
          FROM users u
          LEFT JOIN cause_supporters cs ON u.id = cs.user_id
          WHERE cs.id IS NOT NULL
          GROUP BY u.id, u.name, u.email
          ORDER BY total_donated DESC
          LIMIT 10
        `) as Promise<any[]>,

          // Average donations by category
          Database.query(`
          SELECT 
            cat.name as category,
            COUNT(cs.id) as donation_count,
            COALESCE(AVG(cs.amount), 0) as average_amount
          FROM categories cat
          LEFT JOIN causes c ON cat.id = c.category_id
          LEFT JOIN cause_supporters cs ON c.id = cs.cause_id
          WHERE cs.id IS NOT NULL
          GROUP BY cat.id, cat.name
          ORDER BY average_amount DESC
        `) as Promise<any[]>,
        ]);

      return NextResponse.json({
        success: true,
        data: {
          donation_stats: donationStats[0] || {},
          donation_trends: donationTrends || [],
          top_donors: topDonors || [],
          average_by_category: averageDonations || [],
        },
      });
    } else if (type === "users") {
      // User analytics
      const [userStats, userGrowth, userActivity, topContributors] =
        await Promise.all([
          // User stats
          Database.query(`
          SELECT 
            COUNT(*) as total_users,
            COUNT(CASE WHEN is_verified = 1 THEN 1 END) as verified_users,
            COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as active_users,
            COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as new_users_7d
          FROM users
        `) as Promise<any[]>,

          // User growth
          Database.query(`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as new_users
          FROM users
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        `) as Promise<any[]>,

          // User activity
          Database.query(`
          SELECT 
            u.name,
            u.email,
            u.last_login,
            COUNT(DISTINCT c.id) as causes_created,
            COUNT(DISTINCT cs.id) as donations_made,
            COUNT(DISTINCT ui.id) as interactions_made
          FROM users u
          LEFT JOIN causes c ON u.id = c.user_id
          LEFT JOIN cause_supporters cs ON u.id = cs.user_id
          LEFT JOIN user_interactions ui ON u.id = ui.user_id
          GROUP BY u.id, u.name, u.email, u.last_login
          HAVING (causes_created > 0 OR donations_made > 0 OR interactions_made > 0)
          ORDER BY (causes_created + donations_made + interactions_made) DESC
          LIMIT 10
        `) as Promise<any[]>,

          // Top contributors
          Database.query(`
          SELECT 
            u.name,
            COUNT(DISTINCT c.id) as causes_created,
            COALESCE(SUM(c.current_amount), 0) as total_raised,
            COUNT(DISTINCT cs.id) as personal_donations
          FROM users u
          LEFT JOIN causes c ON u.id = c.user_id
          LEFT JOIN cause_supporters cs ON u.id = cs.user_id
          GROUP BY u.id, u.name
          HAVING causes_created > 0
          ORDER BY total_raised DESC
          LIMIT 10
        `) as Promise<any[]>,
        ]);

      return NextResponse.json({
        success: true,
        data: {
          user_stats: userStats[0] || {},
          user_growth: userGrowth || [],
          most_active_users: userActivity || [],
          top_contributors: topContributors || [],
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid analytics type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Track custom analytics events
    const { event_type, event_data, user_id, cause_id } = await request.json();

    if (!event_type) {
      return NextResponse.json(
        { success: false, error: "Event type is required" },
        { status: 400 },
      );
    }

    // Store analytics event
    const result = (await Database.query(
      `INSERT INTO analytics_events (
        event_type, 
        event_data, 
        user_id, 
        cause_id,
        created_at
      ) VALUES (?, ?, ?, ?, NOW())`,
      [
        event_type,
        JSON.stringify(event_data || {}),
        user_id || null,
        cause_id || null,
      ],
    )) as any;

    return NextResponse.json({
      success: true,
      data: {
        event_id: result.insertId,
        message: "Analytics event tracked successfully",
      },
    });
  } catch (error) {
    console.error("Track analytics event error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track analytics event" },
      { status: 500 },
    );
  }
}
