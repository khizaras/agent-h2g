import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    if (cause.category_name === "food") {
      const foodQuery = `SELECT * FROM food_details WHERE cause_id = ?`;
      const [foodDetails] = (await Database.query(foodQuery, [
        causeId,
      ])) as any[];
      categoryDetails = foodDetails;
    } else if (cause.category_name === "clothes") {
      const clothesQuery = `SELECT * FROM clothes_details WHERE cause_id = ?`;
      const [clothesDetails] = (await Database.query(clothesQuery, [
        causeId,
      ])) as any[];
      categoryDetails = clothesDetails;
    } else if (cause.category_name === "training") {
      const trainingQuery = `SELECT * FROM training_details WHERE cause_id = ?`;
      const [trainingDetails] = (await Database.query(trainingQuery, [
        causeId,
      ])) as any[];
      categoryDetails = trainingDetails;
    }

    // Get comments for this cause (with error handling)
    let comments = [];
    try {
      const commentsQuery = `
        SELECT 
          c.*,
          u.name as author_name,
          u.avatar as author_avatar
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.cause_id = ? AND c.is_approved = TRUE
        ORDER BY c.created_at DESC
      `;
      comments = await Database.query(commentsQuery, [causeId]);
    } catch (error) {
      console.log('Comments table not available:', error.message);
      comments = [];
    }

    // Get recent analytics events as updates for this cause (if table exists)
    let activities = [];
    try {
      const activitiesQuery = `
        SELECT 
          ae.*,
          u.name as user_name
        FROM analytics_events ae
        LEFT JOIN users u ON ae.user_id = u.id
        WHERE ae.cause_id = ?
        AND ae.event_type IN ('cause_updated', 'cause_status_changed', 'milestone_reached')
        ORDER BY ae.created_at DESC
        LIMIT 10
      `;
      activities = await Database.query(activitiesQuery, [causeId]);
    } catch (error) {
      // Analytics table doesn't exist in current schema, use empty array
      console.log('Analytics events table not available:', error.message);
      activities = [];
    }

    // Update view count
    await Database.query(
      `UPDATE causes SET view_count = view_count + 1 WHERE id = ?`,
      [causeId],
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
      const jsonFields = [
        "dietary_restrictions",
        "allergens",
        "size_range",
        "colors",
        "brands",
        "topics",
        "learning_objectives",
        "materials_provided",
        "equipment_required",
        "software_required",
        "subtitles_available",
        "schedule",
        "course_modules",
        "instructors",
        "enhanced_prerequisites",
      ];

      jsonFields.forEach((field) => {
        if (
          categoryDetails[field] &&
          typeof categoryDetails[field] === "string"
        ) {
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
        name: cause.user_name || "Anonymous",
        email: cause.user_email,
        avatar: cause.user_avatar,
        bio: cause.user_bio || "",
        causesCreated: 0, // This would need a separate query
        totalRaised: 0, // This would need a separate query
        verified: false, // This would need a separate query
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
    
    // Provide more specific error information in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Failed to fetch cause details: ${error.message}`
      : "Failed to fetch cause details";
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const causeId = parseInt(id);
    const updateData = await request.json();

    // First, check if the cause exists and if the user is the owner
    const existingCauseResult = (await Database.query(
      "SELECT user_id, category_id FROM causes WHERE id = ?",
      [causeId],
    )) as any[];
    const existingCause = existingCauseResult[0];

    if (!existingCause) {
      return NextResponse.json({ error: "Cause not found" }, { status: 404 });
    }

    if (existingCause.user_id.toString() !== session.user.id.toString()) {
      return NextResponse.json(
        { error: "You can only edit your own causes" },
        { status: 403 },
      );
    }

    // Handle category update if provided
    let categoryId = null;
    if (updateData.category) {
      const categoryResult = (await Database.query(
        "SELECT id FROM categories WHERE name = ?",
        [updateData.category],
      )) as any[];
      if (categoryResult.length > 0) {
        categoryId = categoryResult[0].id;
      }
    }

    // Update main cause data
    const updateQuery = `
      UPDATE causes 
      SET title = ?, 
          description = ?, 
          short_description = ?,
          ${categoryId ? "category_id = ?," : ""}
          priority = ?, 
          location = ?, 
          contact_email = ?,
          contact_phone = ?,
          special_instructions = ?,
          gallery = ?,
          tags = ?,
          updated_at = NOW()
      WHERE id = ?
    `;

    const updateParams = [
      updateData.title ?? "",
      updateData.description ?? "",
      updateData.short_description ?? "",
    ];

    if (categoryId) {
      updateParams.push(categoryId);
    }

    updateParams.push(
      updateData.priority ?? "medium",
      updateData.location ?? "",
      updateData.contactEmail ?? "",
      updateData.contactPhone ?? null,
      updateData.special_instructions ?? null,
      JSON.stringify(updateData.images ?? []),
      JSON.stringify(updateData.tags ?? []),
      causeId,
    );

    await Database.query(updateQuery, updateParams);

    // Update category-specific details if provided
    if (updateData.categoryDetails) {
      const categoryDetails = updateData.categoryDetails;

      switch (updateData.category) {
        case "food":
          // Check if food details exist
          const existingFoodResult = (await Database.query(
            "SELECT id FROM food_details WHERE cause_id = ?",
            [causeId],
          )) as any[];
          const existingFood = existingFoodResult[0];

          if (existingFood) {
            // Update existing food details
            await Database.query(
              `
              UPDATE food_details 
              SET food_type = ?, 
                  cuisine_type = ?,
                  quantity = ?, 
                  unit = ?,
                  serving_size = ?,
                  dietary_restrictions = ?, 
                  allergens = ?,
                  expiration_date = ?,
                  preparation_date = ?,
                  storage_requirements = ?, 
                  temperature_requirements = ?,
                  pickup_instructions = ?,
                  delivery_available = ?,
                  delivery_radius = ?,
                  is_urgent = ?,
                  ingredients = ?,
                  nutritional_info = ?,
                  halal = ?,
                  kosher = ?,
                  vegan = ?,
                  vegetarian = ?,
                  organic = ?
              WHERE cause_id = ?
            `,
              [
                categoryDetails.foodType ?? "meals",
                categoryDetails.cuisineType ?? null,
                categoryDetails.quantity ?? 1,
                categoryDetails.unit ?? "servings",
                categoryDetails.servingSize ?? null,
                JSON.stringify(categoryDetails.dietaryRestrictions ?? []),
                JSON.stringify(categoryDetails.allergens ?? []),
                categoryDetails.expirationDate ?? null,
                categoryDetails.preparationDate ?? null,
                categoryDetails.storageRequirements ?? null,
                categoryDetails.temperatureRequirements ?? "room-temp",
                categoryDetails.pickupInstructions ?? null,
                categoryDetails.deliveryAvailable ?? false,
                categoryDetails.deliveryRadius ?? null,
                categoryDetails.isUrgent ?? false,
                categoryDetails.ingredients ?? null,
                JSON.stringify(categoryDetails.nutritionalInfo ?? {}),
                (categoryDetails.dietaryRestrictions && categoryDetails.dietaryRestrictions.includes('halal')) ?? false,
                (categoryDetails.dietaryRestrictions && categoryDetails.dietaryRestrictions.includes('kosher')) ?? false,
                (categoryDetails.dietaryRestrictions && categoryDetails.dietaryRestrictions.includes('vegan')) ?? false,
                (categoryDetails.dietaryRestrictions && categoryDetails.dietaryRestrictions.includes('vegetarian')) ?? false,
                false, // organic
                causeId,
              ],
            );
          } else {
            // Create new food details
            await Database.query(
              `
              INSERT INTO food_details 
              (cause_id, food_type, cuisine_type, quantity, unit, serving_size, dietary_restrictions, allergens,
               expiration_date, preparation_date, storage_requirements, temperature_requirements, pickup_instructions,
               delivery_available, delivery_radius, is_urgent, ingredients, nutritional_info, halal, kosher, vegan, vegetarian, organic)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
              [
                causeId,
                categoryDetails.foodType ?? "meals",
                categoryDetails.cuisineType ?? null,
                categoryDetails.quantity ?? 1,
                categoryDetails.unit ?? "servings",
                categoryDetails.servingSize ?? null,
                JSON.stringify(categoryDetails.dietaryRestrictions ?? []),
                JSON.stringify(categoryDetails.allergens ?? []),
                categoryDetails.expirationDate ?? null,
                categoryDetails.preparationDate ?? null,
                categoryDetails.storageRequirements ?? null,
                categoryDetails.temperatureRequirements ?? "room-temp",
                categoryDetails.pickupInstructions ?? null,
                categoryDetails.deliveryAvailable ?? false,
                categoryDetails.deliveryRadius ?? null,
                categoryDetails.isUrgent ?? false,
                categoryDetails.ingredients ?? null,
                JSON.stringify(categoryDetails.nutritionalInfo ?? {}),
                (categoryDetails.dietaryRestrictions && categoryDetails.dietaryRestrictions.includes('halal')) ?? false,
                (categoryDetails.dietaryRestrictions && categoryDetails.dietaryRestrictions.includes('kosher')) ?? false,
                (categoryDetails.dietaryRestrictions && categoryDetails.dietaryRestrictions.includes('vegan')) ?? false,
                (categoryDetails.dietaryRestrictions && categoryDetails.dietaryRestrictions.includes('vegetarian')) ?? false,
                false, // organic
              ],
            );
          }
          break;

        case "clothes":
          const existingClothesResult = (await Database.query(
            "SELECT id FROM clothes_details WHERE cause_id = ?",
            [causeId],
          )) as any[];
          const existingClothes = existingClothesResult[0];

          if (existingClothes) {
            await Database.query(
              `
              UPDATE clothes_details 
              SET clothes_type = ?, 
                  gender = ?,
                  age_group = ?,
                  size_range = ?, 
                  \`condition\` = ?,
                  season = ?, 
                  quantity = ?,
                  colors = ?,
                  brands = ?,
                  material_composition = ?,
                  care_instructions = ?,
                  special_requirements = ?,
                  pickup_instructions = ?,
                  delivery_available = ?,
                  delivery_radius = ?,
                  is_urgent = ?,
                  is_cleaned = ?,
                  donation_receipt_available = ?
              WHERE cause_id = ?
            `,
              [
                categoryDetails.clothesType ?? "shirts",
                categoryDetails.gender ?? "unisex",
                categoryDetails.ageGroup ?? "adult",
                JSON.stringify(categoryDetails.sizeRange ?? []),
                categoryDetails.condition ?? "good",
                categoryDetails.season ?? "all-season",
                categoryDetails.quantity ?? 1,
                JSON.stringify(categoryDetails.colors ?? []),
                JSON.stringify(categoryDetails.brands ?? []),
                categoryDetails.materialComposition ?? null,
                categoryDetails.careInstructions ?? null,
                categoryDetails.specialRequirements ?? null,
                categoryDetails.pickupInstructions ?? null,
                categoryDetails.deliveryAvailable ?? false,
                categoryDetails.deliveryRadius ?? null,
                categoryDetails.isUrgent ?? false,
                categoryDetails.isCleaned ?? false,
                categoryDetails.donationReceiptAvailable ?? false,
                causeId,
              ],
            );
          } else {
            await Database.query(
              `
              INSERT INTO clothes_details 
              (cause_id, clothes_type, gender, age_group, size_range, \`condition\`, season, quantity,
               colors, brands, material_composition, care_instructions, special_requirements, pickup_instructions,
               delivery_available, delivery_radius, is_urgent, is_cleaned, donation_receipt_available)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
              [
                causeId,
                categoryDetails.clothesType ?? "shirts",
                categoryDetails.gender ?? "unisex",
                categoryDetails.ageGroup ?? "adult",
                JSON.stringify(categoryDetails.sizeRange ?? []),
                categoryDetails.condition ?? "good",
                categoryDetails.season ?? "all-season",
                categoryDetails.quantity ?? 1,
                JSON.stringify(categoryDetails.colors ?? []),
                JSON.stringify(categoryDetails.brands ?? []),
                categoryDetails.materialComposition ?? null,
                categoryDetails.careInstructions ?? null,
                categoryDetails.specialRequirements ?? null,
                categoryDetails.pickupInstructions ?? null,
                categoryDetails.deliveryAvailable ?? false,
                categoryDetails.deliveryRadius ?? null,
                categoryDetails.isUrgent ?? false,
                categoryDetails.isCleaned ?? false,
                categoryDetails.donationReceiptAvailable ?? false,
              ],
            );
          }
          break;

        case "training":
          const existingTrainingResult = (await Database.query(
            "SELECT id FROM training_details WHERE cause_id = ?",
            [causeId],
          )) as any[];
          const existingTraining = existingTrainingResult[0];

          if (existingTraining) {
            // Handle multiple instructors
            const instructors = categoryDetails.instructors || [];
            const primaryInstructor = instructors[0] || { name: '', email: '', bio: '', qualifications: '' };
            
            await Database.query(
              `
              UPDATE training_details 
              SET training_type = ?, 
                  skill_level = ?, 
                  topics = ?, 
                  max_participants = ?, 
                  current_participants = ?,
                  duration_hours = ?, 
                  number_of_sessions = ?,
                  prerequisites = ?, 
                  learning_objectives = ?, 
                  curriculum = ?,
                  start_date = ?,
                  end_date = ?,
                  registration_deadline = ?,
                  schedule = ?,
                  delivery_method = ?,
                  location_details = ?,
                  meeting_platform = ?,
                  meeting_link = ?,
                  instructor_name = ?, 
                  instructor_email = ?, 
                  instructor_bio = ?,
                  instructor_qualifications = ?,
                  certification_provided = ?,
                  certification_body = ?,
                  materials_provided = ?,
                  materials_required = ?,
                  software_required = ?,
                  price = ?,
                  is_free = ?,
                  course_language = ?,
                  subtitles_available = ?,
                  difficulty_rating = ?,
                  course_materials_url = ?,
                  enrollment_status = ?
              WHERE cause_id = ?
            `,
              [
                categoryDetails.trainingType ?? "course",
                categoryDetails.skillLevel ?? "all-levels",
                JSON.stringify(categoryDetails.topics ?? []),
                categoryDetails.maxParticipants ?? 20,
                categoryDetails.currentParticipants ?? 0,
                categoryDetails.durationHours ?? 1,
                categoryDetails.numberOfSessions ?? 1,
                categoryDetails.prerequisites ?? null,
                categoryDetails.learningObjectives ?? null,
                categoryDetails.curriculum ?? null,
                categoryDetails.startDate ?? null,
                categoryDetails.endDate ?? null,
                categoryDetails.registrationDeadline ?? null,
                JSON.stringify(categoryDetails.schedule ?? []),
                categoryDetails.deliveryMethod ?? "in-person",
                categoryDetails.locationDetails ?? null,
                categoryDetails.meetingPlatform ?? null,
                categoryDetails.meetingLink ?? null,
                primaryInstructor.name ?? "",
                primaryInstructor.email ?? null,
                primaryInstructor.bio ?? null,
                primaryInstructor.qualifications ?? null,
                categoryDetails.certificationProvided ?? false,
                categoryDetails.certificationBody ?? null,
                JSON.stringify(categoryDetails.materialsProvided ?? []),
                JSON.stringify(categoryDetails.materialsRequired ?? []),
                JSON.stringify(categoryDetails.softwareRequired ?? []),
                categoryDetails.price ?? 0.0,
                categoryDetails.isFree ?? true,
                categoryDetails.courseLanguage ?? "English",
                JSON.stringify(categoryDetails.subtitlesAvailable ?? []),
                categoryDetails.difficultyRating ?? 1,
                categoryDetails.courseMaterialsUrl ?? null,
                categoryDetails.enrollmentStatus ?? "open",
                causeId,
              ],
            );
          } else {
            // Handle multiple instructors
            const instructors = categoryDetails.instructors || [];
            const primaryInstructor = instructors[0] || { name: '', email: '', bio: '', qualifications: '' };
            
            await Database.query(
              `
              INSERT INTO training_details 
              (cause_id, training_type, skill_level, topics, max_participants, current_participants,
               duration_hours, number_of_sessions, prerequisites, learning_objectives, curriculum,
               start_date, end_date, registration_deadline, schedule, delivery_method,
               location_details, meeting_platform, meeting_link,
               instructor_name, instructor_email, instructor_bio, instructor_qualifications,
               certification_provided, certification_body, materials_provided, materials_required,
               software_required, price, is_free, course_language, subtitles_available,
               difficulty_rating, course_materials_url, enrollment_status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
              [
                causeId,
                categoryDetails.trainingType ?? "course",
                categoryDetails.skillLevel ?? "all-levels",
                JSON.stringify(categoryDetails.topics ?? []),
                categoryDetails.maxParticipants ?? 20,
                categoryDetails.currentParticipants ?? 0,
                categoryDetails.durationHours ?? 1,
                categoryDetails.numberOfSessions ?? 1,
                categoryDetails.prerequisites ?? null,
                categoryDetails.learningObjectives ?? null,
                categoryDetails.curriculum ?? null,
                categoryDetails.startDate ?? null,
                categoryDetails.endDate ?? null,
                categoryDetails.registrationDeadline ?? null,
                JSON.stringify(categoryDetails.schedule ?? []),
                categoryDetails.deliveryMethod ?? "in-person",
                categoryDetails.locationDetails ?? null,
                categoryDetails.meetingPlatform ?? null,
                categoryDetails.meetingLink ?? null,
                primaryInstructor.name ?? "",
                primaryInstructor.email ?? null,
                primaryInstructor.bio ?? null,
                primaryInstructor.qualifications ?? null,
                categoryDetails.certificationProvided ?? false,
                categoryDetails.certificationBody ?? null,
                JSON.stringify(categoryDetails.materialsProvided ?? []),
                JSON.stringify(categoryDetails.materialsRequired ?? []),
                JSON.stringify(categoryDetails.softwareRequired ?? []),
                categoryDetails.price ?? 0.0,
                categoryDetails.isFree ?? true,
                categoryDetails.courseLanguage ?? "English",
                JSON.stringify(categoryDetails.subtitlesAvailable ?? []),
                categoryDetails.difficultyRating ?? 1,
                categoryDetails.courseMaterialsUrl ?? null,
                categoryDetails.enrollmentStatus ?? "open",
              ],
            );
          }
          break;
      }
    }

    // Fetch the updated cause
    const updatedCauseResult = (await Database.query(
      "SELECT * FROM causes WHERE id = ?",
      [causeId],
    )) as any[];
    const updatedCause = updatedCauseResult[0];

    return NextResponse.json({
      success: true,
      data: {
        cause: updatedCause,
        message: "Cause updated successfully",
      },
    });
  } catch (error) {
    console.error("Error updating cause:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update cause",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
