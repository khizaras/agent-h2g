import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { DatabaseService } from '@/lib/prisma'

// Query parameters schema for GET requests
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  category: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['active', 'pending', 'completed', 'suspended', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  sort: z.enum(['createdAt', 'updatedAt', 'title', 'viewCount', 'likeCount']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  featured: z.coerce.boolean().optional(),
  userId: z.coerce.number().optional(),
})

// Create cause schema
const createCauseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(500, 'Short description too long').optional(),
  categoryId: z.number().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  tags: z.array(z.string()).optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPerson: z.string().optional(),
  availabilityHours: z.string().optional(),
  specialInstructions: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  
  // Category-specific details
  foodDetails: z.object({
    foodType: z.enum(['perishable', 'non-perishable', 'prepared', 'raw', 'beverages', 'snacks']),
    cuisineType: z.string().optional(),
    quantity: z.number().min(1),
    unit: z.enum(['kg', 'lbs', 'servings', 'portions', 'items', 'packages']).default('servings'),
    servingSize: z.number().optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
    expirationDate: z.string().datetime().optional(),
    preparationDate: z.string().datetime().optional(),
    storageRequirements: z.string().optional(),
    temperatureRequirements: z.enum(['frozen', 'refrigerated', 'room-temp', 'hot']).default('room-temp'),
    pickupInstructions: z.string().optional(),
    deliveryAvailable: z.boolean().default(false),
    deliveryRadius: z.number().optional(),
    isUrgent: z.boolean().default(false),
    nutritionalInfo: z.record(z.any()).optional(),
    ingredients: z.string().optional(),
    packagingDetails: z.string().optional(),
    halal: z.boolean().default(false),
    kosher: z.boolean().default(false),
    organic: z.boolean().default(false),
  }).optional(),

  clothesDetails: z.object({
    clothesType: z.enum(['men', 'women', 'children', 'unisex', 'infant', 'maternity']),
    category: z.enum(['tops', 'bottoms', 'dresses', 'outerwear', 'underwear', 'shoes', 'accessories', 'uniforms']),
    ageGroup: z.enum(['infant', 'toddler', 'child', 'teen', 'adult', 'senior']).default('adult'),
    sizeRange: z.array(z.string()).min(1, 'At least one size is required'),
    condition: z.enum(['new', 'like-new', 'gently-used', 'used', 'needs-repair']),
    season: z.enum(['all-season', 'summer', 'winter', 'spring', 'fall']).default('all-season'),
    quantity: z.number().min(1),
    colors: z.array(z.string()).optional(),
    brands: z.array(z.string()).optional(),
    materialComposition: z.string().optional(),
    careInstructions: z.string().optional(),
    specialRequirements: z.string().optional(),
    pickupInstructions: z.string().optional(),
    deliveryAvailable: z.boolean().default(false),
    deliveryRadius: z.number().optional(),
    isUrgent: z.boolean().default(false),
    isCleaned: z.boolean().default(false),
    donationReceipt: z.boolean().default(false),
  }).optional(),

  educationDetails: z.object({
    educationType: z.enum(['course', 'workshop', 'seminar', 'mentoring', 'tutoring', 'certification', 'bootcamp']),
    skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'all-levels']).default('all-levels'),
    topics: z.array(z.string()).min(1, 'At least one topic is required'),
    maxTrainees: z.number().min(1, 'Max trainees must be at least 1'),
    durationHours: z.number().min(1, 'Duration must be at least 1 hour'),
    numberOfDays: z.number().min(1, 'Number of days must be at least 1'),
    prerequisites: z.string().optional(),
    learningObjectives: z.array(z.string()).optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    registrationDeadline: z.string().datetime().optional(),
    schedule: z.array(z.object({
      day: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      topic: z.string().optional(),
    })),
    deliveryMethod: z.enum(['online', 'in-person', 'hybrid']),
    locationDetails: z.string().optional(),
    meetingPlatform: z.string().optional(),
    meetingLink: z.string().url().optional(),
    meetingId: z.string().optional(),
    meetingPassword: z.string().optional(),
    instructorName: z.string().min(1, 'Instructor name is required'),
    instructorEmail: z.string().email().optional(),
    instructorBio: z.string().optional(),
    instructorQualifications: z.string().optional(),
    certification: z.boolean().default(false),
    certificationBody: z.string().optional(),
    materialsProvided: z.array(z.string()).optional(),
    equipmentRequired: z.array(z.string()).optional(),
    softwareRequired: z.array(z.string()).optional(),
    price: z.number().min(0).default(0),
    isFree: z.boolean().default(true),
    courseLanguage: z.string().default('English'),
    subtitlesAvailable: z.array(z.string()).optional(),
    difficultyRating: z.number().min(1).max(5).default(1),
  }).optional(),
})

// GET /api/causes - Fetch causes with filtering, pagination, and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams)
    
    // Validate query parameters
    const validatedParams = querySchema.parse(params)
    
    const {
      page,
      limit,
      category,
      location,
      status,
      priority,
      search,
      tags,
      sort,
      order,
      featured,
      userId,
    } = validatedParams

    // Build where conditions
    const whereConditions: any = {}

    if (category) {
      whereConditions.category = { name: category }
    }

    if (location) {
      whereConditions.location = { contains: location, mode: 'insensitive' }
    }

    if (status) {
      whereConditions.status = status
    } else {
      // Default to showing only active causes for public requests
      whereConditions.status = 'active'
    }

    if (priority) {
      whereConditions.priority = priority
    }

    if (featured !== undefined) {
      whereConditions.isFeatured = featured
    }

    if (userId) {
      whereConditions.userId = userId
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim())
      whereConditions.tags = {
        array_contains: tagArray,
      }
    }

    // Handle search
    if (search) {
      whereConditions.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build order by
    const orderBy: any = {}
    orderBy[sort] = order

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch causes
    const result = await DatabaseService.findCauses({
      skip,
      take: limit,
      where: whereConditions,
      orderBy,
    })

    // Log search analytics if search query provided
    if (search) {
      const session = await getServerSession(authOptions)
      await DatabaseService.createAnalyticsEvent({
        userId: session?.user?.id ? parseInt(session.user.id) : undefined,
        sessionId: `search-${Date.now()}`,
        eventType: 'cause_search',
        eventData: {
          query: search,
          filters: { category, location, status, priority },
          resultCount: result.total,
        },
        pageUrl: request.url,
        userAgent: request.headers.get('user-agent') || undefined,
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || undefined,
      })
    }

    return NextResponse.json({
      success: true,
      data: result.causes,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
      },
    })

  } catch (error) {
    console.error('Fetch causes error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid query parameters',
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to fetch causes' },
      { status: 500 }
    )
  }
}

// POST /api/causes - Create a new cause
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!session.user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Email verification required to create causes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createCauseSchema.parse(body)

    // Prepare cause data
    const causeData = {
      title: validatedData.title,
      description: validatedData.description,
      shortDescription: validatedData.shortDescription,
      categoryId: validatedData.categoryId,
      userId: parseInt(session.user.id),
      location: validatedData.location,
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
      priority: validatedData.priority,
      tags: validatedData.tags,
      contactPhone: validatedData.contactPhone,
      contactEmail: validatedData.contactEmail || session.user.email,
      contactPerson: validatedData.contactPerson || session.user.name,
      availabilityHours: validatedData.availabilityHours,
      specialInstructions: validatedData.specialInstructions,
      expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
      status: 'pending', // All new causes start as pending for moderation
      foodDetails: validatedData.foodDetails,
      clothesDetails: validatedData.clothesDetails,
      educationDetails: validatedData.educationDetails,
    }

    // Create cause
    const cause = await DatabaseService.createCause(causeData)

    // Create analytics event
    await DatabaseService.createAnalyticsEvent({
      userId: parseInt(session.user.id),
      sessionId: `create-cause-${Date.now()}`,
      eventType: 'cause_created',
      eventData: {
        causeId: cause.id,
        category: cause.category.name,
        priority: cause.priority,
      },
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || undefined,
    })

    // Create notification for admins about new cause pending approval
    // TODO: Implement admin notification logic

    return NextResponse.json({
      success: true,
      message: 'Cause created successfully and is pending approval',
      data: cause,
    }, { status: 201 })

  } catch (error) {
    console.error('Create cause error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }))
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create cause' },
      { status: 500 }
    )
  }
}