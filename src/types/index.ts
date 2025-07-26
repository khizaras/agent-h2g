// Core Types for Hands2gether Platform

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
  isVerified: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Category {
  id: number;
  name: 'food' | 'clothes' | 'education';
  displayName: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface BaseCause {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  categoryId: number;
  userId: number;
  location: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  gallery?: string[];
  status: 'active' | 'pending' | 'completed' | 'suspended' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  tags?: string[];
  contactPhone?: string;
  contactEmail?: string;
  contactPerson?: string;
  availabilityHours?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  completedAt?: string;
  user: User;
  category: Category;
}

export interface FoodDetails {
  id: number;
  causeId: number;
  foodType: 'perishable' | 'non-perishable' | 'prepared' | 'raw' | 'beverages' | 'snacks';
  cuisineType?: string;
  quantity: number;
  unit: 'kg' | 'lbs' | 'servings' | 'portions' | 'items' | 'packages';
  servingSize?: number;
  dietaryRestrictions?: string[];
  allergens?: string[];
  expirationDate?: string;
  preparationDate?: string;
  storageRequirements?: string;
  temperatureRequirements: 'frozen' | 'refrigerated' | 'room-temp' | 'hot';
  pickupInstructions?: string;
  deliveryAvailable: boolean;
  deliveryRadius?: number;
  isUrgent: boolean;
  nutritionalInfo?: Record<string, any>;
  ingredients?: string;
  packagingDetails?: string;
  halal: boolean;
  kosher: boolean;
  organic: boolean;
  createdAt: string;
}

export interface ClothesDetails {
  id: number;
  causeId: number;
  clothesType: 'men' | 'women' | 'children' | 'unisex' | 'infant' | 'maternity';
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'underwear' | 'shoes' | 'accessories' | 'uniforms';
  ageGroup: 'infant' | 'toddler' | 'child' | 'teen' | 'adult' | 'senior';
  sizeRange: string[];
  condition: 'new' | 'like-new' | 'gently-used' | 'used' | 'needs-repair';
  season: 'all-season' | 'summer' | 'winter' | 'spring' | 'fall';
  quantity: number;
  colors?: string[];
  brands?: string[];
  materialComposition?: string;
  careInstructions?: string;
  specialRequirements?: string;
  pickupInstructions?: string;
  deliveryAvailable: boolean;
  deliveryRadius?: number;
  isUrgent: boolean;
  isCleaned: boolean;
  donationReceipt: boolean;
  createdAt: string;
}

export interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
  topic?: string;
}

export interface LearningObjective {
  id: string;
  description: string;
  completed?: boolean;
}

export interface EducationDetails {
  id: number;
  causeId: number;
  educationType: 'course' | 'workshop' | 'seminar' | 'mentoring' | 'tutoring' | 'certification' | 'bootcamp';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'all-levels';
  topics: string[];
  maxTrainees: number;
  currentTrainees: number;
  durationHours: number;
  numberOfDays: number;
  prerequisites?: string;
  learningObjectives?: LearningObjective[];
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  schedule: ScheduleItem[];
  deliveryMethod: 'online' | 'in-person' | 'hybrid';
  locationDetails?: string;
  meetingPlatform?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  instructorName: string;
  instructorEmail?: string;
  instructorBio?: string;
  instructorQualifications?: string;
  instructorRating: number;
  certification: boolean;
  certificationBody?: string;
  materialsProvided?: string[];
  equipmentRequired?: string[];
  softwareRequired?: string[];
  price: number;
  isFree: boolean;
  courseLanguage: string;
  subtitlesAvailable?: string[];
  difficultyRating: number;
  createdAt: string;
}

export interface FoodCause extends BaseCause {
  foodDetails: FoodDetails;
}

export interface ClothesCause extends BaseCause {
  clothesDetails: ClothesDetails;
}

export interface EducationCause extends BaseCause {
  educationDetails: EducationDetails;
}

export type Cause = FoodCause | ClothesCause | EducationCause;

export interface Registration {
  id: number;
  educationId: number;
  userId: number;
  status: 'pending' | 'approved' | 'declined' | 'waitlisted' | 'completed' | 'dropped' | 'no-show';
  registrationDate: string;
  approvalDate?: string;
  completionDate?: string;
  attendancePercentage: number;
  finalGrade?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
  feedbackRating?: number;
  feedbackComment?: string;
  notes?: string;
  reminderSent: boolean;
  user: User;
  education: EducationCause;
}

export interface Comment {
  id: number;
  causeId: number;
  userId: number;
  parentId?: number;
  commentType: 'feedback' | 'question' | 'update' | 'review';
  content: string;
  rating?: number;
  isAnonymous: boolean;
  isApproved: boolean;
  isPinned: boolean;
  likeCount: number;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  replies?: Comment[];
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'cause_update' | 'registration' | 'reminder' | 'completion' | 'admin' | 'system';
  relatedCauseId?: number;
  relatedUserId?: number;
  actionUrl?: string;
  isRead: boolean;
  isSent: boolean;
  sendEmail: boolean;
  sendPush: boolean;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface UserInteraction {
  id: number;
  userId: number;
  causeId: number;
  interactionType: 'view' | 'like' | 'share' | 'follow' | 'contact';
  createdAt: string;
}

export interface Media {
  id: number;
  relatedType: 'cause' | 'user' | 'education' | 'comment';
  relatedId: number;
  fileType: 'image' | 'video' | 'document' | 'audio';
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  altText?: string;
  caption?: string;
  sortOrder: number;
  isPrimary: boolean;
  uploadedBy: number;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: number;
  userId?: number;
  sessionId: string;
  eventType: string;
  eventData?: Record<string, any>;
  pageUrl?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams extends PaginationParams {
  category?: string;
  location?: string;
  status?: string;
  priority?: string;
  search?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

// Form Types
export interface CreateCauseForm {
  title: string;
  description: string;
  shortDescription?: string;
  categoryId: number;
  location: string;
  image?: File;
  gallery?: File[];
  contactPhone?: string;
  contactEmail?: string;
  contactPerson?: string;
  availabilityHours?: string;
  specialInstructions?: string;
  tags?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface CreateFoodCauseForm extends CreateCauseForm {
  foodDetails: Omit<FoodDetails, 'id' | 'causeId' | 'createdAt'>;
}

export interface CreateClothesCauseForm extends CreateCauseForm {
  clothesDetails: Omit<ClothesDetails, 'id' | 'causeId' | 'createdAt'>;
}

export interface CreateEducationCauseForm extends CreateCauseForm {
  educationDetails: Omit<EducationDetails, 'id' | 'causeId' | 'createdAt' | 'currentTrainees' | 'instructorRating'>;
}

// UI State Types
export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

// Theme Types
export interface ThemeConfig {
  primaryColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  textColor: string;
  backgroundColor: string;
  borderRadius: number;
  fontFamily: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  adminOnly?: boolean;
  authRequired?: boolean;
}

// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  totalCauses: number;
  activeCauses: number;
  completedCauses: number;
  totalRegistrations: number;
  categoryDistribution: {
    food: number;
    clothes: number;
    education: number;
  };
  monthlyGrowth: {
    users: number;
    causes: number;
  };
  topLocations: Array<{
    location: string;
    count: number;
  }>;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }>;
}

// Search Types
export interface SearchResult {
  type: 'cause' | 'user' | 'education';
  id: number;
  title: string;
  description: string;
  image?: string;
  category?: string;
  location?: string;
  relevanceScore: number;
}

export interface SearchFilters {
  categories: string[];
  locations: string[];
  dateRange: {
    start: string;
    end: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  skillLevels: string[];
  deliveryOptions: string[];
}

// WebSocket Types
export interface SocketEvent {
  type: string;
  payload: any;
  timestamp: string;
  userId?: number;
}

export interface RealTimeUpdate {
  type: 'cause_update' | 'new_cause' | 'registration' | 'comment' | 'notification';
  data: any;
  timestamp: string;
}