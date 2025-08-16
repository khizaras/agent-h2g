// Revamped Causes API Route
// Clean implementation for the new cause management system with markdown support

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Database } from "@/lib/database";

// Helper function to convert undefined to null for SQL compatibility
const nullifyUndefined = (value: any) => (value === undefined ? null : value);

// Types
interface CauseFilters {
  category?: string;
  cause_type?: "wanted" | "offered";
  location?: string;
  search?: string;
  status?: string;
  priority?: string;
  is_featured?: boolean;
  is_urgent?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// GET /api/causes - Fetch causes with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filters from query parameters
    const filters: CauseFilters = {
      category: searchParams.get("category") || undefined,
      cause_type:
        (searchParams.get("cause_type") as "wanted" | "offered") || undefined,
      location: searchParams.get("location") || undefined,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || "active",
      priority: searchParams.get("priority") || undefined,
      is_featured:
        searchParams.get("is_featured") === "true" ? true : undefined,
      is_urgent: searchParams.get("is_urgent") === "true" ? true : undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: Math.min(parseInt(searchParams.get("limit") || "12"), 50), // Max 50 per page
      sort_by: searchParams.get("sort_by") || "created_at",
      sort_order: (searchParams.get("sort_order") as "asc" | "desc") || "desc",
    };

    // Build the base query
    let query = `
      SELECT 
        c.*,
        u.name as creator_name,
        u.avatar as creator_avatar,
        cat.name as category_name,
        cat.display_name as category_display_name,
        cat.color as category_color,
        cat.icon as category_icon
      FROM causes c
      JOIN users u ON c.user_id = u.id
      JOIN categories cat ON c.category_id = cat.id
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    // Add filters to query
    if (filters.status) {
      query += ` AND c.status = ?`;
      queryParams.push(filters.status);
    }

    if (filters.category) {
      query += ` AND cat.name = ?`;
      queryParams.push(filters.category);
    }

    if (filters.cause_type) {
      query += ` AND c.cause_type = ?`;
      queryParams.push(filters.cause_type);
    }

    if (filters.location) {
      query += ` AND c.location LIKE ?`;
      queryParams.push(`%${filters.location}%`);
    }

    if (filters.priority) {
      query += ` AND c.priority = ?`;
      queryParams.push(filters.priority);
    }

    if (filters.is_featured === true) {
      query += ` AND c.is_featured = 1`;
    }

    if (filters.search) {
      query += ` AND (
        MATCH(c.title, c.description, c.short_description) AGAINST (? IN NATURAL LANGUAGE MODE)
        OR c.title LIKE ?
        OR c.description LIKE ?
        OR c.short_description LIKE ?
        OR c.location LIKE ?
        OR u.name LIKE ?
      )`;
      const searchTerm = `%${filters.search}%`;
      queryParams.push(
        filters.search,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
      );
    }

    // Handle urgent filter for food and clothes
    if (filters.is_urgent === true) {
      query += ` AND (
        c.category_id IN (
          SELECT id FROM categories WHERE name IN ('food', 'clothes')
        )
      )`;
    }

    // Count total records for pagination
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as filtered_causes`;
    const countResult = await Database.query(countQuery, queryParams);
    const total = (countResult as any[])[0]?.total || 0;

    // Add sorting
    const validSortColumns = [
      "created_at",
      "updated_at",
      "view_count",
      "like_count",
      "priority",
      "title",
    ];
    const sortBy = validSortColumns.includes(filters.sort_by || "")
      ? filters.sort_by
      : "created_at";
    const sortOrder = filters.sort_order === "asc" ? "ASC" : "DESC";

    // Special sorting for priority
    if (sortBy === "priority") {
      query += ` ORDER BY 
        CASE c.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
        END ${sortOrder}`;
    } else {
      query += ` ORDER BY c.${sortBy} ${sortOrder}`;
    }

    // Add pagination
    const page = Math.max(1, filters.page || 1);
    const limit = filters.limit || 12;
    const offset = (page - 1) * limit;

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    // Execute main query
    const causes = await Database.query(query, queryParams);

    // Get additional details for each cause based on category
    const causesWithDetails = await Promise.all(
      (causes as any[]).map(async (cause: any) => {
        try {
          let details = null;

          switch (cause.category_name) {
            case "food":
              const foodDetails = await Database.query(
                "SELECT * FROM food_details WHERE cause_id = ?",
                [cause.id],
              );
              details = (foodDetails as any[])[0] || null;
              break;

            case "clothes":
              const clothesDetails = await Database.query(
                "SELECT * FROM clothes_details WHERE cause_id = ?",
                [cause.id],
              );
              details = (clothesDetails as any[])[0] || null;
              break;

            case "training":
              const trainingDetails = await Database.query(
                "SELECT * FROM training_details WHERE cause_id = ?",
                [cause.id],
              );
              details = (trainingDetails as any[])[0] || null;
              break;
          }

          return {
            ...cause,
            [`${cause.category_name}_details`]: details,
          };
        } catch (error) {
          console.error(`Error fetching details for cause ${cause.id}:`, error);
          return cause;
        }
      }),
    );

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    };

    return NextResponse.json({
      success: true,
      data: {
        causes: causesWithDetails,
        pagination,
        filters: filters,
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

// POST /api/causes - Create a new cause
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category, // Accept category name from form
      category_id, // Also accept direct category_id for backward compatibility
      causeType, // Form sends causeType, map to cause_type
      cause_type,
      location,
      latitude,
      longitude,
      image,
      images, // Form sends images array
      gallery,
      priority = "medium",
      contactPhone, // Form field names
      contactEmail,
      contact_phone,
      contact_email,
      contact_person,
      availability_hours,
      special_instructions,
      tags,
      expires_at,

      // Category-specific details
      categoryDetails, // Form sends nested categoryDetails
      food_details,
      clothes_details,
      training_details,
    } = body;

    // Validate required fields
    if (!title || !description || (!category && !category_id) || !location) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: title, description, category, location",
        },
        { status: 400 },
      );
    }

    // Map category name to category_id if needed
    let finalCategoryId = category_id;
    if (!finalCategoryId && category) {
      const categoryResult = await Database.query(
        "SELECT id, name FROM categories WHERE name = ? AND is_active = 1",
        [category],
      );

      if ((categoryResult as any[]).length === 0) {
        return NextResponse.json(
          { success: false, error: "Invalid category" },
          { status: 400 },
        );
      }
      finalCategoryId = (categoryResult as any[])[0].id;
    }

    // Validate final category_id exists
    const categoryResult = await Database.query(
      "SELECT id, name FROM categories WHERE id = ? AND is_active = 1",
      [finalCategoryId],
    );

    if ((categoryResult as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 },
      );
    }

    const categoryInfo = (categoryResult as any[])[0];

    // Map form fields to database fields
    const finalCauseType = causeType || cause_type;
    const finalContactPhone = contactPhone || contact_phone;
    const finalContactEmail = contactEmail || contact_email;
    const finalGallery = images || gallery || [];

    // Validate cause_type for food and clothes
    if (["food", "clothes"].includes(categoryInfo.name) && !finalCauseType) {
      return NextResponse.json(
        {
          success: false,
          error: "cause_type is required for food and clothes categories",
        },
        { status: 400 },
      );
    }

    // Use database transaction for cause creation
    const result = await Database.transaction(async (connection) => {
      // Insert main cause record
      console.log("Attempting to insert cause with parameters:", {
        title,
        description,
        finalCategoryId,
        userId: session.user.id,
        finalCauseType,
        location,
        priority,
      });

      const causeInsertResult = await connection.execute(
        `
        INSERT INTO causes (
          title, description, short_description, category_id, user_id, cause_type,
          location, latitude, longitude, image, gallery, priority,
          contact_phone, contact_email, contact_person, availability_hours,
          special_instructions, tags, expires_at, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `,
        [
          title,
          description,
          description, // Use description as short_description if not provided separately
          finalCategoryId,
          session.user.id,
          finalCauseType || "wanted",
          location,
          latitude || null,
          longitude || null,
          finalGallery.length > 0 ? finalGallery[0] : null, // First image as main image
          finalGallery.length > 0 ? JSON.stringify(finalGallery) : null,
          priority,
          finalContactPhone || null,
          finalContactEmail || session.user.email,
          contact_person || session.user.name,
          availability_hours || null,
          special_instructions || null,
          tags ? JSON.stringify(tags) : null,
          expires_at || null,
        ],
      );

      console.log("Cause insert result:", causeInsertResult);
      const causeId = (causeInsertResult as any)[0].insertId;
      console.log("Extracted causeId:", causeId);

      // Validate causeId before proceeding
      if (!causeId) {
        console.error("Insert result:", causeInsertResult);
        throw new Error(
          "Failed to get cause ID from database insertion. Insert result: " +
            JSON.stringify(causeInsertResult),
        );
      }

      // Insert enhanced category-specific details
      const details = categoryDetails || {};

      switch (categoryInfo.name) {
        case "food":
          console.log("Creating enhanced food details for causeId:", causeId);

          await connection.execute(
            `
            INSERT INTO food_details (
              cause_id, food_type, cuisine_type, quantity, unit, serving_size,
              dietary_restrictions, allergens, expiration_date, preparation_date,
              storage_requirements, temperature_requirements, pickup_instructions,
              delivery_available, delivery_radius, is_urgent, ingredients,
              nutritional_info, halal, kosher, vegan, vegetarian, organic
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              causeId,
              details.foodType || "meals",
              details.cuisineType || null,
              details.quantity || 1,
              details.unit || "servings",
              details.servingSize || null,
              details.dietaryRestrictions
                ? JSON.stringify(details.dietaryRestrictions)
                : null,
              details.allergens ? JSON.stringify(details.allergens) : null,
              details.expirationDate || null,
              details.preparationDate || null,
              details.storageRequirements || null,
              details.temperatureRequirements || "room-temp",
              details.pickupInstructions || null,
              details.deliveryAvailable || false,
              details.deliveryRadius || null,
              details.isUrgent || priority === "urgent",
              details.ingredients || null,
              details.nutritionalInfo
                ? JSON.stringify(details.nutritionalInfo)
                : null,
              (details.dietaryRestrictions &&
                details.dietaryRestrictions.includes("halal")) ||
                false,
              (details.dietaryRestrictions &&
                details.dietaryRestrictions.includes("kosher")) ||
                false,
              (details.dietaryRestrictions &&
                details.dietaryRestrictions.includes("vegan")) ||
                false,
              (details.dietaryRestrictions &&
                details.dietaryRestrictions.includes("vegetarian")) ||
                false,
              false, // organic - can be enhanced later
            ],
          );
          break;

        case "clothes":
          console.log(
            "Creating enhanced clothes details for causeId:",
            causeId,
          );

          await connection.execute(
            `
            INSERT INTO clothes_details (
              cause_id, clothes_type, gender, age_group, size_range, \`condition\`,
              season, quantity, colors, brands, material_composition, care_instructions,
              special_requirements, pickup_instructions, delivery_available, delivery_radius,
              is_urgent, is_cleaned, donation_receipt_available
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              causeId,
              details.clothesType || "shirts",
              details.gender || "unisex",
              details.ageGroup || "adult",
              details.sizeRange
                ? JSON.stringify(details.sizeRange)
                : JSON.stringify(["M", "L"]),
              details.condition || "good",
              details.season || "all-season",
              details.quantity || 1,
              details.colors ? JSON.stringify(details.colors) : null,
              details.brands ? JSON.stringify(details.brands) : null,
              details.materialComposition || null,
              details.careInstructions || null,
              details.specialRequirements || null,
              details.pickupInstructions || null,
              details.deliveryAvailable || false,
              details.deliveryRadius || null,
              details.isUrgent || priority === "urgent",
              details.isCleaned || false,
              details.donationReceiptAvailable || false,
            ],
          );
          break;

        case "training":
          console.log(
            "Creating enhanced training details for causeId:",
            causeId,
          );
          console.log("Training details object:", details);

          // Handle multiple instructors
          const instructors = details.instructors || [
            {
              name: session.user.name || "Instructor",
              email: session.user.email,
            },
          ];
          const primaryInstructor = instructors[0];

          // Validate required fields
          if (
            !details.trainingType ||
            ![
              "workshop",
              "course",
              "mentoring",
              "seminar",
              "bootcamp",
              "certification",
              "skills",
              "academic",
            ].includes(details.trainingType)
          ) {
            details.trainingType = "course";
          }

          if (
            !details.skillLevel ||
            ![
              "beginner",
              "intermediate",
              "advanced",
              "expert",
              "all-levels",
            ].includes(details.skillLevel)
          ) {
            details.skillLevel = "all-levels";
          }

          if (
            !details.deliveryMethod ||
            !["in-person", "online", "hybrid", "self-paced"].includes(
              details.deliveryMethod,
            )
          ) {
            details.deliveryMethod = "in-person";
          }

          // Extract training details with proper mapping
          console.log("Processing training details from:", details);

          const trainingData = {
            training_type:
              details.education_type || details.trainingType || "course",
            skill_level:
              details.skill_level || details.skillLevel || "all-levels",
            topics: Array.isArray(details.topics)
              ? JSON.stringify(details.topics)
              : details.topics
                ? JSON.stringify([details.topics])
                : JSON.stringify(["general"]),
            max_participants: parseInt(
              details.max_trainees || details.maxParticipants || "20",
            ),
            current_participants: parseInt(
              details.current_trainees || details.currentParticipants || "0",
            ),
            duration_hours: parseFloat(
              details.duration_hours || details.durationHours || "1",
            ),
            number_of_sessions: parseInt(
              details.number_of_days || details.numberOfSessions || "1",
            ),
            start_date: details.start_date
              ? new Date(details.start_date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            end_date: details.end_date
              ? new Date(details.end_date).toISOString().split("T")[0]
              : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0],
            registration_deadline: details.registration_deadline
              ? new Date(details.registration_deadline)
                  .toISOString()
                  .split("T")[0]
              : null,
            schedule: details.schedule
              ? JSON.stringify([details.schedule])
              : JSON.stringify([]),
            delivery_method:
              details.delivery_method || details.deliveryMethod || "in-person",
            instructor_name:
              details.instructor_name ||
              details.instructorName ||
              session.user.name ||
              "Instructor",
            instructor_email:
              details.instructor_email || details.instructorEmail || null,
            instructor_bio:
              details.instructor_bio || details.instructorBio || null,
            instructor_qualifications:
              details.instructor_qualifications ||
              details.instructorQualifications ||
              null,
            price: parseFloat(details.price || "0"),
            is_free:
              details.is_free !== undefined
                ? details.is_free
                : details.isFree !== undefined
                  ? details.isFree
                  : true,
            course_language:
              details.course_language || details.courseLanguage || "English",
            difficulty_rating: parseInt(
              details.difficulty_rating || details.difficultyRating || "1",
            ),
            prerequisites: details.prerequisites || null,
            learning_objectives: details.learning_objectives
              ? Array.isArray(details.learning_objectives)
                ? JSON.stringify(details.learning_objectives)
                : JSON.stringify([details.learning_objectives])
              : null,
            materials_provided: details.materials_provided
              ? Array.isArray(details.materials_provided)
                ? JSON.stringify(details.materials_provided)
                : JSON.stringify([details.materials_provided])
              : null,
            equipment_required: details.equipment_required
              ? Array.isArray(details.equipment_required)
                ? JSON.stringify(details.equipment_required)
                : JSON.stringify([details.equipment_required])
              : null,
            certification:
              details.certification || details.certificationProvided || false,
            certification_body:
              details.certification_body || details.certificationBody || null,
            location_details:
              details.location_details || details.locationDetails || null,
            meeting_platform:
              details.meeting_platform || details.meetingPlatform || null,
            meeting_link: details.meeting_link || details.meetingLink || null,
            enrollment_status: "open",
          };

          console.log("Mapped training data:", trainingData);

          await connection.execute(
            `
            INSERT INTO training_details (
              cause_id, training_type, skill_level, topics, max_participants,
              current_participants, duration_hours, number_of_sessions,
              start_date, end_date, registration_deadline, schedule, delivery_method, 
              instructor_name, instructor_email, instructor_bio, instructor_qualifications,
              price, is_free, course_language, difficulty_rating, prerequisites,
              learning_objectives, materials_provided, equipment_required,
              certification, certification_body, location_details, meeting_platform,
              meeting_link, enrollment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
            [
              causeId,
              trainingData.training_type,
              trainingData.skill_level,
              trainingData.topics,
              trainingData.max_participants,
              trainingData.current_participants,
              trainingData.duration_hours,
              trainingData.number_of_sessions,
              trainingData.start_date,
              trainingData.end_date,
              trainingData.registration_deadline,
              trainingData.schedule,
              trainingData.delivery_method,
              trainingData.instructor_name,
              trainingData.instructor_email,
              trainingData.instructor_bio,
              trainingData.instructor_qualifications,
              trainingData.price,
              trainingData.is_free,
              trainingData.course_language,
              trainingData.difficulty_rating,
              trainingData.prerequisites,
              trainingData.learning_objectives,
              trainingData.materials_provided,
              trainingData.equipment_required,
              trainingData.certification,
              trainingData.certification_body,
              trainingData.location_details,
              trainingData.meeting_platform,
              trainingData.meeting_link,
              trainingData.enrollment_status,
            ],
          );

          // If there are multiple instructors, store them separately (for future enhancement)
          if (instructors.length > 1) {
            for (let i = 1; i < instructors.length; i++) {
              // For now, we can store additional instructors in a separate table or JSON field
              // This can be implemented later as needed
            }
          }
          break;
      }

      return causeId;
    });

    // Fetch the created cause with all details
    const createdCause = await Database.query(
      `
      SELECT 
        c.*,
        u.name as creator_name,
        u.avatar as creator_avatar,
        cat.name as category_name,
        cat.display_name as category_display_name,
        cat.color as category_color,
        cat.icon as category_icon
      FROM causes c
      JOIN users u ON c.user_id = u.id
      JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = ?
    `,
      [result],
    );

    if ((createdCause as any[]).length === 0) {
      throw new Error("Failed to fetch created cause");
    }

    return NextResponse.json(
      {
        success: true,
        data: (createdCause as any[])[0],
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
