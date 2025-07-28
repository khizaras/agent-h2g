import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const causeId = id;

    if (!causeId) {
      return NextResponse.json(
        { success: false, error: "Cause ID is required" },
        { status: 400 },
      );
    }

    // Get basic cause information with user and category details
    const causeQuery = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        u.avatar as user_avatar,
        u.bio as user_bio,
        cat.name as category_name,
        cat.display_name as category_display_name,
        cat.description as category_description,
        cat.color as category_color
      FROM causes c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = ?
    `;

    const [cause] = (await Database.query(causeQuery, [causeId])) as any[];

    if (!cause) {
      return NextResponse.json(
        { success: false, error: "Cause not found" },
        { status: 404 },
      );
    }

    // Get category-specific details based on the category
    let categoryDetails = null;
    
    if (cause.category_name === 'food') {
      const foodQuery = `SELECT * FROM food_details WHERE cause_id = ?`;
      const [foodDetails] = (await Database.query(foodQuery, [causeId])) as any[];
      categoryDetails = foodDetails;
    } else if (cause.category_name === 'clothes') {
      const clothesQuery = `SELECT * FROM clothes_details WHERE cause_id = ?`;
      const [clothesDetails] = (await Database.query(clothesQuery, [causeId])) as any[];
      categoryDetails = clothesDetails;
    } else if (cause.category_name === 'education') {
      const educationQuery = `SELECT * FROM education_details WHERE cause_id = ?`;
      const [educationDetails] = (await Database.query(educationQuery, [causeId])) as any[];
      categoryDetails = educationDetails;
    }

    // Get comments for this cause
    const commentsQuery = `
      SELECT 
        c.*,
        u.name as author_name,
        u.avatar as author_avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.cause_id = ? AND c.is_approved = TRUE
      ORDER BY c.is_pinned DESC, c.created_at DESC
    `;
    
    const comments = await Database.query(commentsQuery, [causeId]);

    // Get activities/updates for this cause
    const activitiesQuery = `
      SELECT 
        a.*,
        u.name as user_name
      FROM activities a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.cause_id = ?
      ORDER BY a.created_at DESC
      LIMIT 10
    `;
    
    const activities = await Database.query(activitiesQuery, [causeId]);

    // Update view count
    await Database.query(
      `UPDATE causes SET view_count = view_count + 1 WHERE id = ?`,
      [causeId]
    );

    // Parse JSON fields
    if (cause.tags) {
      try {
        cause.tags = JSON.parse(cause.tags);
      } catch (e) {
        cause.tags = [];
      }
    }

    if (cause.gallery) {
      try {
        cause.gallery = JSON.parse(cause.gallery);
      } catch (e) {
        cause.gallery = [];
      }
    }

    // Parse category-specific JSON fields
    if (categoryDetails) {
      // Handle common JSON fields that might exist in any category
      const jsonFields = ['dietary_restrictions', 'allergens', 'size_range', 'colors', 'brands', 
                         'topics', 'learning_objectives', 'materials_provided', 'equipment_required', 
                         'software_required', 'subtitles_available', 'schedule'];
      
      jsonFields.forEach(field => {
        if (categoryDetails[field] && typeof categoryDetails[field] === 'string') {
          try {
            categoryDetails[field] = JSON.parse(categoryDetails[field]);
          } catch (e) {
            categoryDetails[field] = [];
          }
        }
      });
    }

    const response = {
      success: true,
      data: {
        cause,
        categoryDetails,
        comments,
        activities,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching cause details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cause details" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Implementation for updating a cause
    // This would be used for editing causes
    return NextResponse.json(
      { success: false, error: "Update functionality not implemented yet" },
      { status: 501 },
    );
  } catch (error) {
    console.error("Error updating cause:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cause" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Implementation for deleting a cause
    // This would require proper authorization
    return NextResponse.json(
      { success: false, error: "Delete functionality not implemented yet" },
      { status: 501 },
    );
  } catch (error) {
    console.error("Error deleting cause:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete cause" },
      { status: 500 },
    );
  }
}