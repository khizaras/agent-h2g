import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search");
    const educationType = searchParams.get("educationType");
    const skillLevel = searchParams.get("skillLevel");
    const deliveryMethod = searchParams.get("deliveryMethod");
    const isFree = searchParams.get("isFree");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "DESC";

    // Build query conditions
    const conditions: string[] = ["c.status IN ('active', 'pending')"];
    const params: any[] = [];

    // Get education category ID
    const categoryQuery = `SELECT id FROM categories WHERE name = 'education'`;
    const categoryResult = (await Database.query(categoryQuery, [])) as any[];
    
    if (!categoryResult.length) {
      return NextResponse.json(
        { success: false, error: "Education category not found" },
        { status: 404 }
      );
    }

    const educationCategoryId = categoryResult[0].id;
    conditions.push("c.category_id = ?");
    params.push(educationCategoryId);

    if (search) {
      conditions.push("(c.title LIKE ? OR c.description LIKE ? OR ed.topics LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (educationType) {
      conditions.push("ed.education_type = ?");
      params.push(educationType);
    }

    if (skillLevel) {
      conditions.push("ed.skill_level = ?");
      params.push(skillLevel);
    }

    if (deliveryMethod) {
      conditions.push("ed.delivery_method = ?");
      params.push(deliveryMethod);
    }

    if (isFree !== null && isFree !== undefined) {
      conditions.push("ed.is_free = ?");
      params.push(isFree === 'true');
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;
    const offset = (page - 1) * limit;

    // Get education causes with detailed information
    const causesQuery = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        cat.name as category_name,
        cat.display_name as category_display_name,
        ed.*,
        CASE 
          WHEN ed.registration_deadline IS NOT NULL AND ed.registration_deadline < CURDATE() THEN 'expired'
          WHEN ed.start_date < CURDATE() THEN 'ongoing'
          WHEN ed.start_date > CURDATE() THEN 'upcoming'
          ELSE 'available'
        END as enrollment_status,
        (ed.max_trainees - ed.current_trainees) as available_spots
      FROM causes c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN education_details ed ON c.id = ed.cause_id
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
      LEFT JOIN education_details ed ON c.id = ed.cause_id
      ${whereClause}
    `;
    const countParams = params.slice(0, -2); // Remove limit and offset
    const [countResult] = (await Database.query(countQuery, countParams)) as any[];

    // Process the results to parse JSON fields
    const processedCauses = causes.map((cause: any) => ({
      ...cause,
      tags: cause.tags ? JSON.parse(cause.tags) : [],
      topics: cause.topics ? JSON.parse(cause.topics) : [],
      learning_objectives: cause.learning_objectives ? JSON.parse(cause.learning_objectives) : [],
      schedule: cause.schedule ? JSON.parse(cause.schedule) : {},
      materials_provided: cause.materials_provided ? JSON.parse(cause.materials_provided) : [],
      equipment_required: cause.equipment_required ? JSON.parse(cause.equipment_required) : [],
      software_required: cause.software_required ? JSON.parse(cause.software_required) : [],
      subtitles_available: cause.subtitles_available ? JSON.parse(cause.subtitles_available) : [],
      course_modules: cause.course_modules ? JSON.parse(cause.course_modules) : null,
      instructors: cause.instructors ? JSON.parse(cause.instructors) : null,
      enhanced_prerequisites: cause.enhanced_prerequisites ? JSON.parse(cause.enhanced_prerequisites) : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        causes: processedCauses,
        pagination: {
          page,
          limit,
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching education causes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch education causes" },
      { status: 500 }
    );
  }
}