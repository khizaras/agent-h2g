import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper functions for common database operations
export class DatabaseService {
  // User operations
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        sessions: true,
      },
    })
  }

  static async findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        causes: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            category: true,
            _count: {
              select: {
                comments: true,
                interactions: true,
              },
            },
          },
        },
        activities: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            cause: {
              select: {
                id: true,
                title: true,
                category: {
                  select: {
                    name: true,
                    displayName: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            causes: true,
            activities: true,
            comments: true,
            notifications: {
              where: { isRead: false },
            },
          },
        },
      },
    })
  }

  static async createUser(data: {
    name: string
    email: string
    password?: string
    avatar?: string
    isVerified?: boolean
  }) {
    return prisma.user.create({
      data,
    })
  }

  // Cause operations
  static async findCauses(params: {
    skip?: number
    take?: number
    where?: any
    orderBy?: any
    include?: any
  }) {
    const { skip = 0, take = 12, where = {}, orderBy = { createdAt: 'desc' }, include } = params

    const defaultInclude = {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          displayName: true,
          color: true,
        },
      },
      foodDetails: true,
      clothesDetails: true,
      educationDetails: true,
      _count: {
        select: {
          comments: true,
          interactions: true,
          activities: true,
        },
      },
    }

    const [causes, total] = await Promise.all([
      prisma.cause.findMany({
        skip,
        take,
        where,
        orderBy,
        include: include || defaultInclude,
      }),
      prisma.cause.count({ where }),
    ])

    return {
      causes,
      total,
      hasMore: skip + take < total,
      totalPages: Math.ceil(total / take),
    }
  }

  static async findCauseById(id: number) {
    return prisma.cause.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            createdAt: true,
          },
        },
        category: true,
        foodDetails: true,
        clothesDetails: true,
        educationDetails: {
          include: {
            registrations: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        comments: {
          where: { parentId: null },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        media: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            comments: true,
            interactions: true,
            activities: true,
          },
        },
      },
    })
  }

  static async createCause(data: any) {
    const { foodDetails, clothesDetails, educationDetails, ...causeData } = data

    return prisma.cause.create({
      data: {
        ...causeData,
        ...(foodDetails && {
          foodDetails: {
            create: foodDetails,
          },
        }),
        ...(clothesDetails && {
          clothesDetails: {
            create: clothesDetails,
          },
        }),
        ...(educationDetails && {
          educationDetails: {
            create: educationDetails,
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        foodDetails: true,
        clothesDetails: true,
        educationDetails: true,
      },
    })
  }

  static async updateCause(id: number, data: any) {
    const { foodDetails, clothesDetails, educationDetails, ...causeData } = data

    return prisma.cause.update({
      where: { id },
      data: {
        ...causeData,
        ...(foodDetails && {
          foodDetails: {
            upsert: {
              create: foodDetails,
              update: foodDetails,
            },
          },
        }),
        ...(clothesDetails && {
          clothesDetails: {
            upsert: {
              create: clothesDetails,
              update: clothesDetails,
            },
          },
        }),
        ...(educationDetails && {
          educationDetails: {
            upsert: {
              create: educationDetails,
              update: educationDetails,
            },
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        foodDetails: true,
        clothesDetails: true,
        educationDetails: true,
      },
    })
  }

  static async deleteCause(id: number) {
    return prisma.cause.delete({
      where: { id },
    })
  }

  // Category operations
  static async findCategories(activeOnly = true) {
    return prisma.category.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            causes: {
              where: { status: 'active' },
            },
          },
        },
      },
    })
  }

  // Analytics operations
  static async createAnalyticsEvent(data: {
    userId?: number
    sessionId: string
    eventType: string
    eventData?: any
    pageUrl?: string
    userAgent?: string
    ipAddress?: string
  }) {
    return prisma.analyticsEvent.create({
      data,
    })
  }

  static async getDashboardStats() {
    const [
      totalUsers,
      totalCauses,
      activeCauses,
      completedCauses,
      totalRegistrations,
      categoryStats,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.cause.count(),
      prisma.cause.count({ where: { status: 'active' } }),
      prisma.cause.count({ where: { status: 'completed' } }),
      prisma.registration.count(),
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              causes: {
                where: { status: 'active' },
              },
            },
          },
        },
      }),
    ])

    const categoryDistribution = categoryStats.reduce((acc, category) => {
      acc[category.name] = category._count.causes
      return acc
    }, {} as Record<string, number>)

    return {
      totalUsers,
      totalCauses,
      activeCauses,
      completedCauses,
      totalRegistrations,
      categoryDistribution,
    }
  }

  // Search operations
  static async searchCauses(query: string, filters: any = {}) {
    const searchConditions = {
      AND: [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { description: { contains: query, mode: 'insensitive' as const } },
            { tags: { array_contains: query } },
          ],
        },
        ...Object.entries(filters).map(([key, value]) => ({
          [key]: value,
        })),
      ],
    }

    return this.findCauses({
      where: searchConditions,
      orderBy: { createdAt: 'desc' },
    })
  }

  // Notification operations
  static async createNotification(data: {
    userId: number
    title: string
    message: string
    type: string
    relatedCauseId?: number
    actionUrl?: string
  }) {
    return prisma.notification.create({
      data,
    })
  }

  static async markNotificationAsRead(id: number) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
  }

  static async getUserNotifications(userId: number, limit = 20) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        relatedCause: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
      },
    })
  }

  // Transaction helper
  static async transaction<T>(callback: (prisma: PrismaClient) => Promise<T>) {
    return prisma.$transaction(callback)
  }

  // Health check
  static async healthCheck() {
    try {
      await prisma.$queryRaw`SELECT 1`
      return { status: 'healthy', timestamp: new Date().toISOString() }
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() }
    }
  }
}

export default prisma