# Training Form Fixes - August 16, 2025

## Issues Fixed

### 1. **Inconsistent Form Fields Between Add and Edit Pages**

- **Problem**: Add cause page had basic field configuration while edit page had more sophisticated form components
- **Solution**: Updated both pages to use the dedicated `EducationCauseForm` component for training causes

### 2. **Slot Count Always Showing 20**

- **Problem**: API was hardcoded to use `max_participants: 20` regardless of form input
- **Solution**: Updated API to properly map form fields like `max_trainees` to database field `max_participants`

### 3. **Date Fields Not Being Set Properly**

- **Problem**: Date fields (start_date, end_date, registration_deadline) were not being saved/loaded correctly
- **Solution**: Added proper date handling with dayjs conversion and proper field mapping

## Technical Changes

### 1. Create Page (`/causes/create/page.tsx`)

- Added import for `EducationCauseForm`
- Added `handleEducationFormSubmit` handler
- Conditional rendering: Use `EducationCauseForm` for training, basic fields for other categories
- Skip basic information fields for training (since EducationCauseForm includes everything)

### 2. Edit Page (`/causes/[id]/edit/page.tsx`)

- Added import for `EducationCauseForm`
- Added `handleEducationFormSubmit` handler
- Conditional rendering: Use `EducationCauseForm` for training, basic fields for other categories
- Fixed TypeScript error with params handling

### 3. Create API (`/api/causes/route.ts`)

- Replaced hardcoded values with proper field mapping
- Added support for both underscore (`max_trainees`) and camelCase (`maxParticipants`) field names
- Proper date conversion using `new Date().toISOString().split('T')[0]`
- Comprehensive field mapping for all training details
- Fixed TypeScript errors with QueryResult casting

### 4. Edit API (`/api/causes/[id]/route.ts`)

- Updated to handle both underscore and camelCase field names
- Added proper parseInt/parseFloat conversions
- Improved date handling
- Fixed TypeScript errors with QueryResult casting

## Field Mapping

The API now properly maps these common field variations:

| Form Field (EducationCauseForm) | Database Field          | Alternative Form Field |
| ------------------------------- | ----------------------- | ---------------------- |
| `max_trainees`                  | `max_participants`      | `maxParticipants`      |
| `duration_hours`                | `duration_hours`        | `durationHours`        |
| `start_date`                    | `start_date`            | `startDate`            |
| `end_date`                      | `end_date`              | `endDate`              |
| `registration_deadline`         | `registration_deadline` | `registrationDeadline` |
| `skill_level`                   | `skill_level`           | `skillLevel`           |
| `education_type`                | `training_type`         | `trainingType`         |
| `instructor_name`               | `instructor_name`       | `instructorName`       |
| `delivery_method`               | `delivery_method`       | `deliveryMethod`       |
| `learning_objectives`           | `learning_objectives`   | `learningObjectives`   |
| `is_free`                       | `is_free`               | `isFree`               |
| `course_language`               | `course_language`       | `courseLanguage`       |

## Database Schema Support

The training_details table supports all required fields:

- Proper ENUM types for training_type, skill_level, delivery_method, enrollment_status
- JSON fields for topics, learning_objectives, materials, etc.
- DATE fields for start_date, end_date, registration_deadline
- Proper field types (INT, DECIMAL, BOOLEAN, TEXT, VARCHAR)

## Testing

To test the fixes:

1. **Create Training Cause**:
   - Go to `/causes/create`
   - Select "Training & Education" category
   - Fill out comprehensive form with max participants > 20
   - Set proper start/end dates and registration deadline
   - Verify all fields are saved correctly

2. **Edit Training Cause**:
   - Go to existing training cause edit page
   - Verify all fields are properly loaded
   - Update max participants and dates
   - Verify changes are saved correctly

3. **Database Verification**:
   - Check `training_details` table for proper values
   - Verify dates are saved in correct format (YYYY-MM-DD)
   - Verify participant counts are saved as integers
   - Verify JSON fields are properly formatted

## Result

- ✅ Slot count now updates properly (shows user-entered value, not hardcoded 20)
- ✅ All dates (start, end, registration deadline) are saved and loaded correctly
- ✅ Add and Edit pages now have consistent, comprehensive training form fields
- ✅ Both pages use the sophisticated `EducationCauseForm` component
- ✅ API handles both field naming conventions for backward compatibility
- ✅ TypeScript compilation errors resolved
- ✅ Database schema properly supports all fields
