import type { Rule } from 'antd/es/form';

// Common validation rules for forms
export const validationRules = {
  // Required field
  required: (message: string): Rule => ({
    required: true,
    message,
  }),

  // Email validation
  email: (message = 'Please enter a valid email address'): Rule => ({
    type: 'email',
    message,
  }),

  // URL validation
  url: (message = 'Please enter a valid URL'): Rule => ({
    type: 'url',
    message,
  }),

  // String length validation
  minLength: (min: number, message?: string): Rule => ({
    min,
    message: message || `Must be at least ${min} characters long`,
  }),

  maxLength: (max: number, message?: string): Rule => ({
    max,
    message: message || `Must not exceed ${max} characters`,
  }),

  // Number range validation
  minValue: (min: number, message?: string): Rule => ({
    type: 'number',
    min,
    message: message || `Must be at least ${min}`,
  }),

  maxValue: (max: number, message?: string): Rule => ({
    type: 'number',
    max,
    message: message || `Must not exceed ${max}`,
  }),

  // Phone number validation (basic)
  phone: (message = 'Please enter a valid phone number'): Rule => ({
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message,
  }),

  // Password strength validation
  strongPassword: (message = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'): Rule => ({
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message,
  }),

  // Custom regex validation
  pattern: (pattern: RegExp, message: string): Rule => ({
    pattern,
    message,
  }),

  // Array validation
  arrayMinLength: (min: number, message?: string): Rule => ({
    type: 'array',
    min,
    message: message || `Please select at least ${min} item${min > 1 ? 's' : ''}`,
  }),

  arrayMaxLength: (max: number, message?: string): Rule => ({
    type: 'array',
    max,
    message: message || `Please select no more than ${max} item${max > 1 ? 's' : ''}`,
  }),
};

// Form field validators
export const validators = {
  // Validate cause title
  causeTitle: [
    validationRules.required('Please enter a title for your cause'),
    validationRules.minLength(10, 'Title should be at least 10 characters long'),
    validationRules.maxLength(100, 'Title should not exceed 100 characters'),
  ],

  // Validate cause description
  causeDescription: [
    validationRules.required('Please provide a description'),
    validationRules.minLength(50, 'Description should be at least 50 characters long'),
    validationRules.maxLength(2000, 'Description should not exceed 2000 characters'),
  ],

  // Validate short description
  shortDescription: [
    validationRules.maxLength(200, 'Summary should not exceed 200 characters'),
  ],

  // Validate quantity
  quantity: [
    validationRules.required('Please enter a quantity'),
    validationRules.minValue(1, 'Quantity must be at least 1'),
  ],

  // Validate price
  price: [
    validationRules.minValue(0, 'Price cannot be negative'),
  ],

  // Validate email
  email: [
    validationRules.email(),
  ],

  // Validate phone
  phone: [
    validationRules.phone(),
  ],

  // Validate instructor name
  instructorName: [
    validationRules.required('Please enter the instructor name'),
    validationRules.minLength(2, 'Name should be at least 2 characters long'),
    validationRules.maxLength(100, 'Name should not exceed 100 characters'),
  ],

  // Validate course duration
  courseDuration: [
    validationRules.required('Please enter the course duration'),
    validationRules.minValue(0.5, 'Duration must be at least 0.5 hours'),
    validationRules.maxValue(40, 'Duration should not exceed 40 hours per day'),
  ],

  // Validate max participants
  maxParticipants: [
    validationRules.required('Please enter maximum participants'),
    validationRules.minValue(1, 'Must allow at least 1 participant'),
    validationRules.maxValue(1000, 'Maximum 1000 participants allowed'),
  ],

  // Validate delivery radius
  deliveryRadius: [
    validationRules.minValue(1, 'Delivery radius must be at least 1 km'),
    validationRules.maxValue(50, 'Delivery radius should not exceed 50 km'),
  ],

  // Validate topics array
  topics: [
    validationRules.arrayMinLength(1, 'Please select at least one topic'),
  ],

  // Validate size range array
  sizeRange: [
    validationRules.arrayMinLength(1, 'Please select at least one size'),
  ],
};

// Custom validation functions
export const customValidators = {
  // Validate future date
  futureDate: (_: any, value: any) => {
    if (!value) return Promise.resolve();
    
    const today = new Date();
    const selectedDate = new Date(value);
    
    if (selectedDate < today) {
      return Promise.reject(new Error('Date must be in the future'));
    }
    return Promise.resolve();
  },

  // Validate end date is after start date
  endDateAfterStart: (startDate: any) => (_: any, value: any) => {
    if (!value || !startDate) return Promise.resolve();
    
    const start = new Date(startDate);
    const end = new Date(value);
    
    if (end <= start) {
      return Promise.reject(new Error('End date must be after start date'));
    }
    return Promise.resolve();
  },

  // Validate registration deadline is before start date
  registrationBeforeStart: (startDate: any) => (_: any, value: any) => {
    if (!value || !startDate) return Promise.resolve();
    
    const start = new Date(startDate);
    const deadline = new Date(value);
    
    if (deadline >= start) {
      return Promise.reject(new Error('Registration deadline must be before start date'));
    }
    return Promise.resolve();
  },

  // Validate file size
  fileSize: (maxSizeMB: number) => (_: any, value: any) => {
    if (!value || !value.file) return Promise.resolve();
    
    const fileSizeMB = value.file.size / 1024 / 1024;
    
    if (fileSizeMB > maxSizeMB) {
      return Promise.reject(new Error(`File size must be less than ${maxSizeMB}MB`));
    }
    return Promise.resolve();
  },

  // Validate URL format
  urlFormat: (_: any, value: any) => {
    if (!value) return Promise.resolve();
    
    try {
      new URL(value);
      return Promise.resolve();
    } catch {
      return Promise.reject(new Error('Please enter a valid URL'));
    }
  },
};