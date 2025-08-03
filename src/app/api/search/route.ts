import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sort") || "created_at";
    const sortOrder = searchParams.get("order") || "DESC";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const offset = (page - 1) * limit;

    if (!query && !category && !location) {
      return NextResponse.json(
        { success: false, error: "At least one search parameter is required" },
        { status: 400 },
      );
    }

    // Build WHERE clause
    let whereClause = "WHERE c.status = 'active'";
    const params: any[] = [];

    // Text search in title, description, and tags
    if (query) {
      whereClause += ` AND (
        c.title LIKE ? OR 
        c.description LIKE ? OR 
        c.location LIKE ? OR
        cat.name LIKE ?
      )`;
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (category) {
      whereClause += " AND cat.slug = ?";
      params.push(category);
    }

    // Location filter
    if (location) {
      whereClause += " AND c.location LIKE ?";
      params.push(`%${location}%`);
    }

    // Status filter (for admin searches)
    if (status && status !== "active") {
      whereClause = whereClause.replace("c.status = 'active'", "c.status = ?");
      params.unshift(status);
    }

    // Validate sort fields
    const validSortFields = [
      "created_at",
      "updated_at",
      "title",
      "goal_amount",
      "current_amount",
      "end_date",
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Main search query
    const searchResults = await Database.query(
      `
      SELECT 
        c.*,
        cat.name as category_name,
        cat.color as category_color,
        cat.icon as category_icon,
        u.name as creator_name,
        u.avatar as creator_avatar,
        (c.current_amount / c.goal_amount * 100) as progress_percentage,
        COALESCE(cs.supporter_count, 0) as supporter_count,
        COALESCE(cc.comment_count, 0) as comment_count,
        -- Relevance scoring
        (
          CASE 
            WHEN c.title LIKE ? THEN 10
            WHEN c.description LIKE ? THEN 5
            WHEN c.location LIKE ? THEN 3
            WHEN cat.name LIKE ? THEN 2
            ELSE 1
          END
        ) as relevance_score
      FROM causes c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT cause_id, COUNT(*) as supporter_count 
        FROM cause_supporters 
        GROUP BY cause_id
      ) cs ON c.id = cs.cause_id
      LEFT JOIN (
        SELECT cause_id, COUNT(*) as comment_count 
        FROM comments 
        WHERE status = 'approved'
        GROUP BY cause_id
      ) cc ON c.id = cc.cause_id
      ${whereClause}
      ORDER BY 
        ${query ? "relevance_score DESC," : ""} 
        c.${sortField} ${order}
      LIMIT ? OFFSET ?
    `,
      [
        ...(query
          ? [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
          : []),
        ...params,
        limit,
        offset,
      ],
    );

    // Get total count for pagination
    const countResult = (await Database.query(
      `
      SELECT COUNT(DISTINCT c.id) as total
      FROM causes c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      ${whereClause}
    `,
      params,
    )) as any[];

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // Get search suggestions if no results
    let suggestions: any[] = [];
    if (total === 0 && query) {
      suggestions = (await Database.query(
        `
        SELECT DISTINCT 
          c.title,
          cat.name as category_name,
          c.location
        FROM causes c
        LEFT JOIN categories cat ON c.category_id = cat.id
        WHERE c.status = 'active'
        AND (
          c.title LIKE ? OR 
          cat.name LIKE ? OR
          c.location LIKE ?
        )
        LIMIT 5
      `,
        [
          `%${query.substring(0, 3)}%`,
          `%${query.substring(0, 3)}%`,
          `%${query.substring(0, 3)}%`,
        ],
      )) as any[];
    }

    // Get popular searches/categories for empty queries
    let popularCategories: any[] = [];
    if (!query) {
      popularCategories = (await Database.query(`
        SELECT 
          cat.name,
          cat.slug,
          cat.color,
          cat.icon,
          COUNT(c.id) as cause_count
        FROM categories cat
        LEFT JOIN causes c ON cat.id = c.category_id AND c.status = 'active'
        GROUP BY cat.id, cat.name, cat.slug, cat.color, cat.icon
        ORDER BY cause_count DESC
        LIMIT 6
      `)) as any[];
    }

    return NextResponse.json({
      success: true,
      data: {
        results: searchResults || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        search_info: {
          query,
          category,
          location,
          total_results: total,
          sort_by: sortField,
          sort_order: order,
        },
        suggestions,
        popular_categories: popularCategories,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform search" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Advanced search with filters
    const body = await request.json();
    const {
      query = "",
      categories = [],
      dateRange = {},
      amountRange = {},
      location = "",
      sortBy = "created_at",
      sortOrder = "DESC",
      page = 1,
      limit = 20,
    } = body;

    const offset = (page - 1) * limit;

    // Build complex WHERE clause
    let whereClause = "WHERE c.status = 'active'";
    const params: any[] = [];

    // Text search
    if (query) {
      whereClause += ` AND (
        c.title LIKE ? OR 
        c.description LIKE ? OR 
        c.location LIKE ?
      )`;
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Category filters
    if (categories.length > 0) {
      whereClause += ` AND cat.slug IN (${categories.map(() => "?").join(",")})`;
      params.push(...categories);
    }

    // Date range filter
    if (dateRange.start) {
      whereClause += " AND c.created_at >= ?";
      params.push(dateRange.start);
    }
    if (dateRange.end) {
      whereClause += " AND c.created_at <= ?";
      params.push(dateRange.end);
    }

    // Amount range filter
    if (amountRange.min) {
      whereClause += " AND c.goal_amount >= ?";
      params.push(amountRange.min);
    }
    if (amountRange.max) {
      whereClause += " AND c.goal_amount <= ?";
      params.push(amountRange.max);
    }

    // Location filter
    if (location) {
      whereClause += " AND c.location LIKE ?";
      params.push(`%${location}%`);
    }

    // Validate sort fields
    const validSortFields = [
      "created_at",
      "updated_at",
      "title",
      "goal_amount",
      "current_amount",
      "end_date",
      "progress_percentage",
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Execute advanced search
    const searchResults = await Database.query(
      `
      SELECT 
        c.*,
        cat.name as category_name,
        cat.color as category_color,
        cat.icon as category_icon,
        u.name as creator_name,
        u.avatar as creator_avatar,
        (c.current_amount / c.goal_amount * 100) as progress_percentage,
        COALESCE(cs.supporter_count, 0) as supporter_count,
        COALESCE(cc.comment_count, 0) as comment_count
      FROM causes c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN (
        SELECT cause_id, COUNT(*) as supporter_count 
        FROM cause_supporters 
        GROUP BY cause_id
      ) cs ON c.id = cs.cause_id
      LEFT JOIN (
        SELECT cause_id, COUNT(*) as comment_count 
        FROM comments 
        WHERE status = 'approved'
        GROUP BY cause_id
      ) cc ON c.id = cc.cause_id
      ${whereClause}
      ORDER BY c.${sortField} ${order}
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset],
    );

    // Get total count
    const countResult = (await Database.query(
      `
      SELECT COUNT(DISTINCT c.id) as total
      FROM causes c
      LEFT JOIN categories cat ON c.category_id = cat.id
      ${whereClause}
    `,
      params,
    )) as any[];

    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: {
        results: searchResults || [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
        filters_applied: {
          query,
          categories,
          dateRange,
          amountRange,
          location,
          sortBy: sortField,
          sortOrder: order,
        },
      },
    });
  } catch (error) {
    console.error("Advanced search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform advanced search" },
      { status: 500 },
    );
  }
}
