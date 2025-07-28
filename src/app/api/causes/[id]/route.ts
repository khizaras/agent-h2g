import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { auth } from '@/lib/auth';

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

    // Transform creator information for easier access
    if (cause.user_id) {
      cause.creator_id = cause.user_id;
      cause.creator = {
        id: cause.user_id,
        name: cause.user_name || 'Anonymous',
        email: cause.user_email,
        avatar: cause.user_avatar,
        bio: cause.user_bio || '',
        causesCreated: 0, // This would need a separate query
        totalRaised: 0,   // This would need a separate query
        verified: false   // This would need a separate query
      };
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const causeId = parseInt(params.id);
    const updateData = await request.json();

    // First, check if the cause exists and if the user is the owner
    const existingCauseResult = await Database.query(
      'SELECT creator_id, category_name FROM causes WHERE id = ?',
      [causeId]
    ) as any[];
    const existingCause = existingCauseResult[0];

    if (!existingCause) {
      return NextResponse.json({ error: 'Cause not found' }, { status: 404 });
    }

    if (existingCause.creator_id !== session.user.id) {
      return NextResponse.json({ error: 'You can only edit your own causes' }, { status: 403 });
    }

    // Update main cause data
    const updateQuery = `
      UPDATE causes 
      SET title = ?, 
          description = ?, 
          detailedDescription = ?,
          category_name = ?, 
          goalAmount = ?, 
          urgencyLevel = ?, 
          location = ?, 
          deadline = ?,
          gallery = ?,
          updatedAt = NOW()
      WHERE id = ?
    `;

    await Database.query(updateQuery, [
      updateData.title,
      updateData.description,
      updateData.detailedDescription || '',
      updateData.category,
      updateData.goalAmount,
      updateData.urgencyLevel,
      updateData.location,
      updateData.deadline,
      JSON.stringify(updateData.gallery || []),
      causeId
    ]);

    // Update category-specific details if provided
    if (updateData.categoryDetails) {
      const categoryDetails = updateData.categoryDetails;

      switch (updateData.category) {
        case 'food':
          // Check if food details exist
          const existingFoodResult = await Database.query(
            'SELECT id FROM food_details WHERE cause_id = ?',
            [causeId]
          ) as any[];
          const existingFood = existingFoodResult[0];

          if (existingFood) {
            // Update existing food details
            await Database.query(`
              UPDATE food_details 
              SET food_type = ?, 
                  servings_count = ?, 
                  dietary_restrictions = ?, 
                  preparation_time = ?, 
                  cooking_instructions = ?
              WHERE cause_id = ?
            `, [
              categoryDetails.food_type || 'meals',
              categoryDetails.servings_count || 1,
              JSON.stringify(categoryDetails.dietary_restrictions || []),
              categoryDetails.preparation_time || 0,
              categoryDetails.cooking_instructions || '',
              causeId
            ]);
          } else {
            // Create new food details
            await Database.query(`
              INSERT INTO food_details 
              (cause_id, food_type, servings_count, dietary_restrictions, preparation_time, cooking_instructions)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [
              causeId,
              categoryDetails.food_type || 'meals',
              categoryDetails.servings_count || 1,
              JSON.stringify(categoryDetails.dietary_restrictions || []),
              categoryDetails.preparation_time || 0,
              categoryDetails.cooking_instructions || ''
            ]);
          }
          break;

        case 'clothes':
          const existingClothesResult = await Database.query(
            'SELECT id FROM clothes_details WHERE cause_id = ?',
            [causeId]
          ) as any[];
          const existingClothes = existingClothesResult[0];

          if (existingClothes) {
            await Database.query(`
              UPDATE clothes_details 
              SET clothing_type = ?, 
                  sizes_available = ?, 
                  gender = ?, 
                  season = ?, 
                  condition_status = ?
              WHERE cause_id = ?
            `, [
              categoryDetails.clothing_type || 'shirts',
              JSON.stringify(categoryDetails.sizes_available || []),
              categoryDetails.gender || 'unisex',
              categoryDetails.season || 'all-season',
              categoryDetails.condition || 'good',
              causeId
            ]);
          } else {
            await Database.query(`
              INSERT INTO clothes_details 
              (cause_id, clothing_type, sizes_available, gender, season, condition_status)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [
              causeId,
              categoryDetails.clothing_type || 'shirts',
              JSON.stringify(categoryDetails.sizes_available || []),
              categoryDetails.gender || 'unisex',
              categoryDetails.season || 'all-season',
              categoryDetails.condition || 'good'
            ]);
          }
          break;

        case 'education':
          const existingEducationResult = await Database.query(
            'SELECT id FROM education_details WHERE cause_id = ?',
            [causeId]
          ) as any[];
          const existingEducation = existingEducationResult[0];

          if (existingEducation) {
            await Database.query(`
              UPDATE education_details 
              SET education_type = ?, 
                  skill_level = ?, 
                  topics = ?, 
                  max_trainees = ?, 
                  duration_hours = ?, 
                  prerequisites = ?, 
                  learning_objectives = ?, 
                  instructor_name = ?, 
                  instructor_email = ?, 
                  certification = ?
              WHERE cause_id = ?
            `, [
              categoryDetails.education_type || 'course',
              categoryDetails.skill_level || 'beginner',
              JSON.stringify(categoryDetails.topics || []),
              categoryDetails.max_trainees || 20,
              categoryDetails.duration_hours || 1,
              categoryDetails.prerequisites || '',
              JSON.stringify(categoryDetails.learning_objectives || []),
              categoryDetails.instructor_name || '',
              categoryDetails.instructor_email || '',
              categoryDetails.certification || false,
              causeId
            ]);
          } else {
            await Database.query(`
              INSERT INTO education_details 
              (cause_id, education_type, skill_level, topics, max_trainees, duration_hours, 
               prerequisites, learning_objectives, instructor_name, instructor_email, certification)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              causeId,
              categoryDetails.education_type || 'course',
              categoryDetails.skill_level || 'beginner',
              JSON.stringify(categoryDetails.topics || []),
              categoryDetails.max_trainees || 20,
              categoryDetails.duration_hours || 1,
              categoryDetails.prerequisites || '',
              JSON.stringify(categoryDetails.learning_objectives || []),
              categoryDetails.instructor_name || '',
              categoryDetails.instructor_email || '',
              categoryDetails.certification || false
            ]);
          }
          break;
      }
    }

    // Fetch the updated cause
    const updatedCauseResult = await Database.query(
      'SELECT * FROM causes WHERE id = ?',
      [causeId]
    ) as any[];
    const updatedCause = updatedCauseResult[0];

    return NextResponse.json({
      success: true,
      data: {
        cause: updatedCause,
        message: 'Cause updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating cause:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update cause',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
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