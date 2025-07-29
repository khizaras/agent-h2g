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

    // Debug: Log the category specific data for education/training
    if (category === "education" || category === "training") {
      console.log(
        "Education/Training categorySpecificData:",
        JSON.stringify(categorySpecificData, null, 2),
      );
    }

    // Validate required fields
    if (!title || !description || !category || !location || !contactEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get category ID from category name
    // Map "training" to "education" for backwards compatibility
    const categoryName = category === "training" ? "education" : category;
    const categoryQuery = `SELECT id FROM categories WHERE name = ?`;
    const categoryResult = (await Database.query(categoryQuery, [
      categoryName,
    ])) as any[];

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
          location, image, gallery, tags, status, priority, contact_phone,
          contact_email, contact_person, availability_hours,
          special_instructions, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const causeResult = await connection.execute(insertCauseQuery, [
        session.user.id,
        title,
        description,
        shortDescription || null,
        categoryId,
        location,
        images?.[0]?.url || null, // Main image
        JSON.stringify(images || []), // All images in gallery
        JSON.stringify(tags || []),
        priority,
        contactPhone || null,
        contactEmail,
        contactPerson || null,
        availabilityHours || null,
        specialInstructions || null,
      ]);

      // Debug: Log the causeResult to understand its structure
      console.log("causeResult:", JSON.stringify(causeResult, null, 2));
      console.log("causeResult type:", typeof causeResult);
      console.log("causeResult keys:", Object.keys(causeResult || {}));

      // MySQL2 returns [ResultSetHeader, FieldPacket[]] from execute()
      const resultHeader = Array.isArray(causeResult)
        ? causeResult[0]
        : causeResult;
      const causeId = resultHeader.insertId;

      // Debug: Log the extracted causeId
      console.log("ResultHeader:", JSON.stringify(resultHeader, null, 2));
      console.log("Extracted causeId:", causeId, "Type:", typeof causeId);

      if (!causeId) {
        throw new Error("Failed to get causeId from database insert");
      }

      // Insert category-specific details
      if (category === "food") {
        // Debug: Log the food categorySpecificData
        console.log(
          "Food categorySpecificData:",
          JSON.stringify(categorySpecificData, null, 2),
        );

        // Validate required food fields
        if (!categorySpecificData.foodType) {
          console.warn('No foodType provided, using default "general"');
        }
        if (
          !categorySpecificData.quantity ||
          categorySpecificData.quantity <= 0
        ) {
          console.warn("No valid quantity provided, using default 1");
        }

        const foodQuery = `
          INSERT INTO food_details (
            cause_id, food_type, cuisine_type, quantity, unit, serving_size,
            dietary_restrictions, allergens, expiration_date, preparation_date,
            storage_requirements, temperature_requirements, pickup_instructions,
            delivery_available, delivery_radius, is_urgent, nutritional_info,
            ingredients, packaging_details, halal, kosher, organic
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const foodParams = [
          causeId,
          categorySpecificData.foodType || "general", // NOT NULL - provide default
          categorySpecificData.cuisineType || null,
          categorySpecificData.quantity || 1, // NOT NULL - provide default of 1
          categorySpecificData.unit || "servings",
          categorySpecificData.servingSize || null,
          JSON.stringify(categorySpecificData.dietaryRestrictions || []),
          JSON.stringify(categorySpecificData.allergens || []),
          categorySpecificData.expirationDate || null,
          categorySpecificData.preparationDate || null,
          categorySpecificData.storageRequirements || null,
          categorySpecificData.temperatureRequirements || "room-temp",
          categorySpecificData.pickupInstructions || null,
          categorySpecificData.deliveryAvailable ? true : false,
          categorySpecificData.deliveryRadius || null,
          categorySpecificData.isUrgent ? true : false,
          categorySpecificData.nutritionalInfo
            ? JSON.stringify(categorySpecificData.nutritionalInfo)
            : null,
          categorySpecificData.ingredients || null,
          categorySpecificData.packagingDetails || null,
          categorySpecificData.halal ? true : false,
          categorySpecificData.kosher ? true : false,
          categorySpecificData.organic ? true : false,
        ];

        // Debug: Check for undefined values in food params
        const undefinedFoodParams = foodParams
          .map((param, index) => ({
            index,
            param,
            isUndefined: param === undefined,
          }))
          .filter((item) => item.isUndefined);

        if (undefinedFoodParams.length > 0) {
          console.error(
            "Found undefined food parameters:",
            undefinedFoodParams,
          );
          throw new Error(
            `Undefined food parameters found at indices: ${undefinedFoodParams.map((p) => p.index).join(", ")}`,
          );
        }

        await connection.execute(foodQuery, foodParams);
      } else if (category === "clothes") {
        // Debug: Log the clothes categorySpecificData
        console.log(
          "Clothes categorySpecificData:",
          JSON.stringify(categorySpecificData, null, 2),
        );

        // Validate required clothes fields
        if (!categorySpecificData.clothesType) {
          console.warn('No clothesType provided, using default "general"');
        }
        if (!categorySpecificData.clothesCategory) {
          console.warn('No clothesCategory provided, using default "general"');
        }
        if (!categorySpecificData.condition) {
          console.warn('No condition provided, using default "good"');
        }
        if (
          !categorySpecificData.quantity ||
          categorySpecificData.quantity <= 0
        ) {
          console.warn("No valid quantity provided, using default 1");
        }
        if (
          !categorySpecificData.sizeRange ||
          categorySpecificData.sizeRange.length === 0
        ) {
          console.warn('No sizeRange provided, using default ["one-size"]');
        }

        const clothesQuery = `
          INSERT INTO clothes_details (
            cause_id, clothes_type, category, age_group, size_range, condition,
            season, quantity, colors, brands, material_composition,
            care_instructions, special_requirements, pickup_instructions,
            delivery_available, delivery_radius, is_urgent, is_cleaned,
            donation_receipt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const clothesParams = [
          causeId,
          categorySpecificData.clothesType || "general", // NOT NULL - provide default
          categorySpecificData.clothesCategory || "general", // NOT NULL - provide default
          categorySpecificData.ageGroup || "adult",
          JSON.stringify(categorySpecificData.sizeRange || ["one-size"]), // NOT NULL - provide default
          categorySpecificData.condition || "good", // NOT NULL - provide default
          categorySpecificData.season || "all-season",
          categorySpecificData.quantity || 1, // NOT NULL - provide default of 1
          JSON.stringify(categorySpecificData.colors || []),
          JSON.stringify(categorySpecificData.brands || []),
          categorySpecificData.materialComposition || null,
          categorySpecificData.careInstructions || null,
          categorySpecificData.specialRequirements || null,
          categorySpecificData.pickupInstructions || null,
          categorySpecificData.deliveryAvailable ? true : false,
          categorySpecificData.deliveryRadius || null,
          categorySpecificData.isUrgent ? true : false,
          categorySpecificData.isCleaned ? true : false,
          categorySpecificData.donationReceipt ? true : false,
        ];

        // Debug: Check for undefined values in clothes params
        const undefinedClothesParams = clothesParams
          .map((param, index) => ({
            index,
            param,
            isUndefined: param === undefined,
          }))
          .filter((item) => item.isUndefined);

        if (undefinedClothesParams.length > 0) {
          console.error(
            "Found undefined clothes parameters:",
            undefinedClothesParams,
          );
          throw new Error(
            `Undefined clothes parameters found at indices: ${undefinedClothesParams.map((p) => p.index).join(", ")}`,
          );
        }

        await connection.execute(clothesQuery, clothesParams);
      } else if (category === "education" || category === "training") {
        // Debug: Log the education categorySpecificData
        console.log(
          "Education categorySpecificData:",
          JSON.stringify(categorySpecificData, null, 2),
        );

        // Validate required education fields
        if (!categorySpecificData.educationType) {
          console.warn('No educationType provided, using default "training"');
        }
        if (
          !categorySpecificData.topics ||
          categorySpecificData.topics.length === 0
        ) {
          console.warn('No topics provided, using default ["general"]');
        }
        if (
          !categorySpecificData.maxTrainees ||
          categorySpecificData.maxTrainees <= 0
        ) {
          console.warn("No valid maxTrainees provided, using default 10");
        }
        if (
          !categorySpecificData.durationHours ||
          categorySpecificData.durationHours <= 0
        ) {
          console.warn("No valid durationHours provided, using default 2");
        }
        if (
          !categorySpecificData.numberOfDays ||
          categorySpecificData.numberOfDays <= 0
        ) {
          console.warn("No valid numberOfDays provided, using default 1");
        }
        if (!categorySpecificData.startDate) {
          console.warn("No startDate provided, using tomorrow as default");
        }
        if (!categorySpecificData.endDate) {
          console.warn("No endDate provided, using startDate as default");
        }
        if (!categorySpecificData.deliveryMethod) {
          console.warn('No deliveryMethod provided, using default "online"');
        }
        if (!categorySpecificData.instructorName) {
          console.warn('No instructorName provided, using default "TBD"');
        }

        const educationQuery = `
          INSERT INTO education_details (
            cause_id, education_type, skill_level, topics, max_trainees,
            duration_hours, number_of_days, prerequisites, learning_objectives,
            start_date, end_date, registration_deadline, schedule, delivery_method,
            location_details, meeting_platform, meeting_link, instructor_name,
            instructor_email, instructor_bio, instructor_qualifications,
            certification, certification_body, materials_provided,
            equipment_required, software_required, price, is_free,
            course_language, subtitles_available, difficulty_rating,
            course_modules, instructors, enhanced_prerequisites
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Calculate default dates
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD format

        const defaultStartDate = categorySpecificData.startDate || tomorrowStr;
        const defaultEndDate = categorySpecificData.endDate || defaultStartDate;

        const educationParams = [
          causeId,
          categorySpecificData.educationType || "training", // NOT NULL - provide default
          categorySpecificData.skillLevel || "all-levels",
          JSON.stringify(categorySpecificData.topics || ["general"]), // NOT NULL - provide default
          categorySpecificData.maxTrainees || 10, // NOT NULL - provide default
          categorySpecificData.durationHours || 2, // NOT NULL - provide default
          categorySpecificData.numberOfDays || 1, // NOT NULL - provide default
          categorySpecificData.prerequisites || null,
          JSON.stringify(categorySpecificData.learningObjectives || []),
          defaultStartDate, // NOT NULL - provide default
          defaultEndDate, // NOT NULL - provide default
          categorySpecificData.registrationDeadline || null,
          JSON.stringify(categorySpecificData.schedule || {}), // NOT NULL - provide default
          categorySpecificData.deliveryMethod || "online", // NOT NULL - provide default
          categorySpecificData.locationDetails || null,
          categorySpecificData.meetingPlatform || null,
          categorySpecificData.meetingLink || null,
          categorySpecificData.instructorName || "TBD", // NOT NULL - provide default
          categorySpecificData.instructorEmail || null,
          categorySpecificData.instructorBio || null,
          categorySpecificData.instructorQualifications || null,
          categorySpecificData.certification ? true : false,
          categorySpecificData.certificationBody || null,
          JSON.stringify(categorySpecificData.materialsProvided || []),
          JSON.stringify(categorySpecificData.equipmentRequired || []),
          JSON.stringify(categorySpecificData.softwareRequired || []),
          categorySpecificData.price || 0,
          categorySpecificData.isFree ? true : false,
          categorySpecificData.courseLanguage || "English",
          JSON.stringify(categorySpecificData.subtitlesAvailable || []),
          categorySpecificData.difficultyRating || 1,
          // Enhanced education fields
          categorySpecificData.enhancedEducationFields?.courseModules
            ? JSON.stringify(
                categorySpecificData.enhancedEducationFields.courseModules,
              )
            : null,
          categorySpecificData.enhancedEducationFields?.instructors
            ? JSON.stringify(
                categorySpecificData.enhancedEducationFields.instructors,
              )
            : null,
          categorySpecificData.enhancedEducationFields?.enhancedPrerequisites
            ? JSON.stringify(
                categorySpecificData.enhancedEducationFields
                  .enhancedPrerequisites,
              )
            : null,
        ];

        // Debug: Check for undefined values
        const undefinedParams = educationParams
          .map((param, index) => ({
            index,
            param,
            isUndefined: param === undefined,
          }))
          .filter((item) => item.isUndefined);

        if (undefinedParams.length > 0) {
          console.error("Found undefined parameters:", undefinedParams);
          throw new Error(
            `Undefined parameters found at indices: ${undefinedParams.map((p) => p.index).join(", ")}`,
          );
        }

        await connection.execute(educationQuery, educationParams);
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
