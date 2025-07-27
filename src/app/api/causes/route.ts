import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "DESC";

    // Build query conditions
    const conditions: string[] = [];
    const params: any[] = [];

    if (category) {
      conditions.push("c.category_id = ?");
      params.push(category);
    }

    if (status) {
      conditions.push("c.status = ?");
      params.push(status);
    }

    if (search) {
      conditions.push("(c.title LIKE ? OR c.description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    // Get causes with user and category information
    const causesQuery = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        cat.name as category_name,
        cat.description as category_description
      FROM causes c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      ${whereClause}
      ORDER BY c.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);
    const causes = await Database.query(causesQuery, params);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM causes c
      ${whereClause}
    `;
    const countParams = params.slice(0, -2); // Remove limit and offset
    const [countResult] = (await Database.query(
      countQuery,
      countParams,
    )) as any[];

    return NextResponse.json({
      success: true,
      data: {
        causes,
        pagination: {
          page,
          limit,
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching causes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch causes" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category_id,
      target_amount,
      location,
      contact_info,
      image_url,
      urgency_level = "medium",
    } = body;

    // Validate required fields
    if (!title || !description || !category_id || !target_amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert new cause
    const insertQuery = `
      INSERT INTO causes (
        user_id, title, description, category_id, target_amount,
        location, contact_info, image_url, urgency_level, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())
    `;

    const result = (await Database.query(insertQuery, [
      session.user.id,
      title,
      description,
      category_id,
      target_amount,
      location,
      contact_info,
      image_url,
      urgency_level,
    ])) as any;

    // Fetch the created cause with related data
    const causeQuery = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        cat.name as category_name
      FROM causes c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = ?
    `;

    const [cause] = (await Database.query(causeQuery, [
      result.insertId,
    ])) as any[];

    return NextResponse.json(
      {
        success: true,
        data: cause,
        message: "Cause created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating cause:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create cause" },
      { status: 500 },
    );
  }
}
