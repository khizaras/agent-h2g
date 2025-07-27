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
      shortDescription,
      category,
      location,
      contactEmail,
      contactPhone,
      contactPerson,
      priority = "medium",
      availabilityHours,
      specialInstructions,
      tags,
      images,
      // Category-specific fields will be handled separately
      ...categorySpecificData
    } = body;

    // Validate required fields
    if (!title || !description || !category || !location || !contactEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get category ID from category name
    const categoryQuery = `SELECT id FROM categories WHERE name = ?`;
    const categoryResult = await Database.query(categoryQuery, [category]) as any[];
    
    if (!categoryResult.length) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 },
      );
    }

    const categoryId = categoryResult[0].id;

    // Start transaction for atomic operation
    const result = await Database.transaction(async (connection) => {
      // Insert main cause record
      const insertCauseQuery = `
        INSERT INTO causes (
          user_id, title, description, short_description, category_id,
          location, image, tags, status, priority, contact_phone,
          contact_email, contact_person, availability_hours,
          special_instructions, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const causeResult = await connection.execute(insertCauseQuery, [
        session.user.id,
        title,
        description,
        shortDescription || null,
        categoryId,
        location,
        images?.[0]?.url || null, // Main image
        JSON.stringify(tags || []),
        priority,
        contactPhone || null,
        contactEmail,
        contactPerson || null,
        availabilityHours || null,
        specialInstructions || null,
      ]);

      const causeId = (causeResult as any).insertId;

      // Insert category-specific details
      if (category === 'food') {
        const foodQuery = `
          INSERT INTO food_details (
            cause_id, food_type, cuisine_type, quantity, unit, serving_size,
            dietary_restrictions, allergens, expiration_date, preparation_date,
            storage_requirements, temperature_requirements, pickup_instructions,
            delivery_available, delivery_radius, is_urgent, nutritional_info,
            ingredients, packaging_details, halal, kosher, organic
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(foodQuery, [
          causeId,
          categorySpecificData.foodType || null,
          categorySpecificData.cuisineType || null,
          categorySpecificData.quantity || null,
          categorySpecificData.unit || 'servings',
          categorySpecificData.servingSize || null,
          JSON.stringify(categorySpecificData.dietaryRestrictions || []),
          JSON.stringify(categorySpecificData.allergens || []),
          categorySpecificData.expirationDate || null,
          categorySpecificData.preparationDate || null,
          categorySpecificData.storageRequirements || null,
          categorySpecificData.temperatureRequirements || 'room-temp',
          categorySpecificData.pickupInstructions || null,
          Boolean(categorySpecificData.deliveryAvailable) || false,
          categorySpecificData.deliveryRadius || null,
          Boolean(categorySpecificData.isUrgent) || false,
          categorySpecificData.nutritionalInfo || null,
          categorySpecificData.ingredients || null,
          categorySpecificData.packagingDetails || null,
          Boolean(categorySpecificData.halal) || false,
          Boolean(categorySpecificData.kosher) || false,
          Boolean(categorySpecificData.organic) || false,
        ]);
      } else if (category === 'clothes') {
        const clothesQuery = `
          INSERT INTO clothes_details (
            cause_id, clothes_type, category, age_group, size_range, condition,
            season, quantity, colors, brands, material_composition,
            care_instructions, special_requirements, pickup_instructions,
            delivery_available, delivery_radius, is_urgent, is_cleaned,
            donation_receipt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(clothesQuery, [
          causeId,
          categorySpecificData.clothesType || null,
          categorySpecificData.clothesCategory || null,
          categorySpecificData.ageGroup || 'adult',
          JSON.stringify(categorySpecificData.sizeRange || []),
          categorySpecificData.condition || null,
          categorySpecificData.season || 'all-season',
          categorySpecificData.quantity || null,
          JSON.stringify(categorySpecificData.colors || []),
          JSON.stringify(categorySpecificData.brands || []),
          categorySpecificData.materialComposition || null,
          categorySpecificData.careInstructions || null,
          categorySpecificData.specialRequirements || null,
          categorySpecificData.pickupInstructions || null,
          Boolean(categorySpecificData.deliveryAvailable) || false,
          categorySpecificData.deliveryRadius || null,
          Boolean(categorySpecificData.isUrgent) || false,
          Boolean(categorySpecificData.isCleaned) || false,
          Boolean(categorySpecificData.donationReceipt) || false,
        ]);
      } else if (category === 'education') {
        const educationQuery = `
          INSERT INTO education_details (
            cause_id, education_type, skill_level, topics, max_trainees,
            duration_hours, number_of_days, prerequisites, learning_objectives,
            start_date, end_date, registration_deadline, schedule, delivery_method,
            location_details, meeting_platform, meeting_link, instructor_name,
            instructor_email, instructor_bio, instructor_qualifications,
            certification, certification_body, materials_provided,
            equipment_required, software_required, price, is_free,
            course_language, subtitles_available, difficulty_rating
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(educationQuery, [
          causeId,
          categorySpecificData.educationType || null,
          categorySpecificData.skillLevel || 'all-levels',
          JSON.stringify(categorySpecificData.topics || []),
          categorySpecificData.maxTrainees || null,
          categorySpecificData.durationHours || null,
          categorySpecificData.numberOfDays || null,
          categorySpecificData.prerequisites || null,
          JSON.stringify(categorySpecificData.learningObjectives || []),
          categorySpecificData.startDate || null,
          categorySpecificData.endDate || null,
          categorySpecificData.registrationDeadline || null,
          JSON.stringify(categorySpecificData.schedule || {}),
          categorySpecificData.deliveryMethod || null,
          categorySpecificData.locationDetails || null,
          categorySpecificData.meetingPlatform || null,
          categorySpecificData.meetingLink || null,
          categorySpecificData.instructorName || null,
          categorySpecificData.instructorEmail || null,
          categorySpecificData.instructorBio || null,
          categorySpecificData.instructorQualifications || null,
          Boolean(categorySpecificData.certification) || false,
          categorySpecificData.certificationBody || null,
          JSON.stringify(categorySpecificData.materialsProvided || []),
          JSON.stringify(categorySpecificData.equipmentRequired || []),
          JSON.stringify(categorySpecificData.softwareRequired || []),
          categorySpecificData.price || 0,
          Boolean(categorySpecificData.isFree) || false,
          categorySpecificData.courseLanguage || 'English',
          JSON.stringify(categorySpecificData.subtitlesAvailable || []),
          categorySpecificData.difficultyRating || 1,
        ]);
      }

      return { causeId };
    });

    // Fetch the created cause with related data
    const causeQuery = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        cat.name as category_name,
        cat.display_name as category_display_name
      FROM causes c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = ?
    `;

    const [cause] = (await Database.query(causeQuery, [
      result.causeId,
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
