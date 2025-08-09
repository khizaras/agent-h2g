"use client";

import React, { useState, useEffect } from "react";
import {
  Card, Form, Input, Button, Select, Upload, Typography, Row, Col, message,
  Image, Space, Tag, InputNumber, DatePicker, Switch, Divider, Skeleton,
  Alert, Spin
} from "antd";
import {
  FiPlus, FiUpload, FiMapPin, FiArrowLeft, FiInfo, FiUser, FiUsers,
  FiCalendar, FiClock, FiBook, FiTarget, FiDollarSign, FiAward, FiPackage,
  FiHeart, FiCheckCircle, FiArrowRight, FiSave
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface CauseData {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  category_name: string;
  cause_type: "wanted" | "offered";
  priority: string;
  location: string;
  contact_email: string;
  contact_phone?: string;
  gallery?: string[];
  user_id: number;
  creator_id?: number;
  status: string;
  tags?: string[];
  special_instructions?: string;
  food_details?: any;
  clothes_details?: any;
  training_details?: any;
}

// Premium animation variants
const premiumAnimations = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  itemVariants: {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  },
  cardHover: {
    y: -4,
    scale: 1.02,
    boxShadow: "0 15px 35px rgba(102, 126, 234, 0.1)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Clean category definitions with comprehensive fields
const categories = [
  {
    value: 'food',
    label: 'Food Support',
    icon: '🍽️',
    description: 'Share meals and food supplies with those in need',
    hasType: true,
  },
  {
    value: 'clothes',
    label: 'Clothing',
    icon: '👕',
    description: 'Donate and request clothing items for all ages',
    hasType: true,
  },
  {
    value: 'training',
    label: 'Training & Education',
    icon: '📚',
    description: 'Share knowledge through courses and workshops',
    hasType: false,
  },
];

// Comprehensive category-specific field configurations
const categoryFieldConfigs = {
  food: {
    icon: <FiHeart />,
    fields: [
      { name: 'foodType', label: 'Food Type', type: 'select', required: true, 
        options: ['meals', 'fresh-produce', 'packaged-goods', 'beverages', 'snacks', 'baby-food', 'other'] },
      { name: 'cuisineType', label: 'Cuisine Type', type: 'select', 
        options: ['indian', 'chinese', 'italian', 'mexican', 'american', 'continental', 'local', 'mixed'] },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1 },
      { name: 'unit', label: 'Unit', type: 'select', required: true,
        options: ['servings', 'plates', 'kilograms', 'pounds', 'packages', 'boxes', 'bags'] },
      { name: 'servingSize', label: 'Serving Size (People)', type: 'number', min: 1 },
      { name: 'temperatureRequirements', label: 'Storage Temperature', type: 'select', required: true,
        options: ['hot', 'room-temperature', 'refrigerated', 'frozen'] },
      { name: 'expirationDate', label: 'Expiration Date', type: 'date' },
      { name: 'preparationDate', label: 'Preparation Date', type: 'date' },
      { name: 'dietaryRestrictions', label: 'Dietary Restrictions', type: 'multiselect',
        options: ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free', 'dairy-free', 'nut-free', 'sugar-free'] },
      { name: 'allergens', label: 'Contains Allergens', type: 'multiselect',
        options: ['nuts', 'dairy', 'eggs', 'gluten', 'soy', 'shellfish', 'fish', 'seeds'] },
      { name: 'ingredients', label: 'Main Ingredients', type: 'textarea', placeholder: 'List the main ingredients used...' },
      { name: 'nutritionalInfo', label: 'Nutritional Information', type: 'textarea', placeholder: 'Calories, nutrients, etc.' },
      { name: 'storageRequirements', label: 'Storage Requirements', type: 'text' },
      { name: 'pickupInstructions', label: 'Pickup Instructions', type: 'textarea' },
      { name: 'deliveryAvailable', label: 'Delivery Available', type: 'switch' },
      { name: 'deliveryRadius', label: 'Delivery Radius (km)', type: 'number', min: 1, max: 50 },
      { name: 'contactPreference', label: 'Contact Preference', type: 'select',
        options: ['phone', 'email', 'whatsapp', 'any'] },
    ]
  },
  clothes: {
    icon: <FiPackage />,
    fields: [
      { name: 'clothesType', label: 'Clothing Type', type: 'select', required: true,
        options: ['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'underwear', 'accessories', 'uniforms', 'formal-wear', 'sportswear'] },
      { name: 'gender', label: 'Gender', type: 'select', required: true,
        options: ['men', 'women', 'unisex', 'boys', 'girls'] },
      { name: 'ageGroup', label: 'Age Group', type: 'select', required: true,
        options: ['infant', 'toddler', 'child', 'teen', 'adult', 'senior'] },
      { name: 'sizeRange', label: 'Size Range', type: 'multiselect', required: true,
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '28', '30', '32', '34', '36', '38', '40', '42', '44'] },
      { name: 'condition', label: 'Condition', type: 'select', required: true,
        options: ['new', 'like-new', 'good', 'fair', 'poor'] },
      { name: 'season', label: 'Season', type: 'select', required: true,
        options: ['spring', 'summer', 'fall', 'winter', 'all-season'] },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1 },
      { name: 'colors', label: 'Available Colors', type: 'multiselect',
        options: ['black', 'white', 'gray', 'brown', 'blue', 'red', 'green', 'yellow', 'pink', 'purple', 'orange', 'multi-color'] },
      { name: 'brands', label: 'Brands', type: 'tags' },
      { name: 'materialComposition', label: 'Material', type: 'text', placeholder: 'e.g., 100% Cotton, 80% Polyester 20% Cotton' },
      { name: 'careInstructions', label: 'Care Instructions', type: 'textarea' },
      { name: 'specialFeatures', label: 'Special Features', type: 'multiselect',
        options: ['waterproof', 'breathable', 'insulated', 'UV-protection', 'anti-microbial', 'wrinkle-free'] },
      { name: 'pickupInstructions', label: 'Pickup Instructions', type: 'textarea' },
      { name: 'deliveryAvailable', label: 'Delivery Available', type: 'switch' },
      { name: 'deliveryRadius', label: 'Delivery Radius (km)', type: 'number', min: 1, max: 50 },
      { name: 'isCleaned', label: 'Items are Cleaned', type: 'switch' },
      { name: 'donationReceiptAvailable', label: 'Donation Receipt Available', type: 'switch' },
    ]
  },
  training: {
    icon: <FiBook />,
    fields: [
      { name: 'trainingType', label: 'Training Type', type: 'select', required: true,
        options: ['workshop', 'course', 'mentoring', 'seminar', 'bootcamp', 'certification', 'skills-training', 'academic-tutoring'] },
      { name: 'skillLevel', label: 'Skill Level', type: 'select', required: true,
        options: ['beginner', 'intermediate', 'advanced', 'expert', 'all-levels'] },
      { name: 'topics', label: 'Topics Covered', type: 'multiselect', required: true,
        options: ['programming', 'web-development', 'data-science', 'design', 'marketing', 'business', 'languages', 'cooking', 'crafts', 'music', 'fitness', 'academic-subjects'] },
      { name: 'maxParticipants', label: 'Maximum Participants', type: 'number', required: true, min: 1, max: 500 },
      { name: 'durationHours', label: 'Total Duration (Hours)', type: 'number', required: true, min: 0.5, max: 1000 },
      { name: 'numberOfSessions', label: 'Number of Sessions', type: 'number', required: true, min: 1 },
      { name: 'sessionDuration', label: 'Session Duration (Hours)', type: 'number', min: 0.5, max: 8 },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'End Date', type: 'date', required: true },
      { name: 'registrationDeadline', label: 'Registration Deadline', type: 'date' },
      { name: 'schedule', label: 'Schedule Details', type: 'textarea', placeholder: 'Class timings, days of the week, frequency...' },
      { name: 'deliveryMethod', label: 'Delivery Method', type: 'select', required: true,
        options: ['in-person', 'online', 'hybrid', 'self-paced'] },
      { name: 'locationDetails', label: 'Location Details', type: 'text' },
      { name: 'meetingPlatform', label: 'Online Platform', type: 'select',
        options: ['zoom', 'google-meet', 'microsoft-teams', 'skype', 'discord', 'custom-platform', 'other'] },
      { name: 'prerequisites', label: 'Prerequisites', type: 'textarea', placeholder: 'List any required knowledge or skills...' },
      { name: 'learningObjectives', label: 'Learning Objectives', type: 'textarea', required: true, placeholder: 'What will participants learn?' },
      { name: 'curriculum', label: 'Curriculum Overview', type: 'textarea', required: true, placeholder: 'Brief outline of topics to be covered...' },
      { name: 'instructorName', label: 'Instructor Name', type: 'text', required: true },
      { name: 'instructorEmail', label: 'Instructor Email', type: 'email' },
      { name: 'instructorPhone', label: 'Instructor Phone', type: 'text' },
      { name: 'instructorQualifications', label: 'Instructor Qualifications', type: 'textarea' },
      { name: 'certificationProvided', label: 'Certification Provided', type: 'switch' },
      { name: 'certificationBody', label: 'Certification Body', type: 'text' },
      { name: 'materialsProvided', label: 'Materials Provided', type: 'multiselect',
        options: ['textbooks', 'workbooks', 'software-access', 'tools', 'certificates', 'recordings', 'presentations', 'assignments'] },
      { name: 'materialsRequired', label: 'Materials Required by Students', type: 'multiselect',
        options: ['laptop', 'desktop', 'tablet', 'smartphone', 'notebook', 'pen', 'calculator', 'textbooks', 'software'] },
      { name: 'price', label: 'Price (₹)', type: 'number', min: 0 },
      { name: 'isFree', label: 'Free Course', type: 'switch' },
      { name: 'courseLanguage', label: 'Course Language', type: 'select', required: true,
        options: ['english', 'hindi', 'spanish', 'french', 'german', 'chinese', 'japanese', 'arabic', 'other'] },
      { name: 'difficultyRating', label: 'Difficulty Rating (1-5)', type: 'number', min: 1, max: 5 },
    ]
  }
};

export default function EditCausePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [causeData, setCauseData] = useState<CauseData | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<any>({});

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      if (status === "loading") return;
      if (!session) {
        router.push("/auth/signin");
        return;
      }
      fetchCauseDetails(resolvedParams.id);
    }
    getParams();
  }, [session, status, router]);

  const fetchCauseDetails = async (causeId: string) => {
    try {
      const response = await fetch(`/api/causes/${causeId}`);
      const result = await response.json();

      if (!result.success) {
        message.error("Failed to load cause details");
        router.push("/causes");
        return;
      }

      const cause = result.data.cause;

      // Check ownership
      const sessionUserId = session?.user?.id;
      const causeCreatorId = cause.creator_id || cause.user_id;

      if (
        sessionUserId &&
        causeCreatorId &&
        sessionUserId.toString() !== causeCreatorId.toString()
      ) {
        message.error("You can only edit your own causes");
        router.push(`/causes/${causeId}`);
        return;
      }

      setCauseData(cause);
      setUploadedImages(cause.gallery || []);

      // Load category-specific details from API response
      const details = result.data.categoryDetails || {};
      console.log("Loading category details:", details); // Debug log
      console.log("Full API response:", result.data); // Debug log
      setCategoryDetails(details);

      // Populate form with all available data
      // Map database field names to form field names
      const mappedDetails: any = {};
      if (details) {
        // Map common database fields to form fields
        Object.keys(details).forEach(key => {
          const value = details[key];
          
          // Handle common field name mappings
          switch (key) {
            // Training fields
            case 'instructor_name':
              mappedDetails.instructorName = value;
              break;
            case 'instructor_email':
              mappedDetails.instructorEmail = value;
              break;
            case 'instructor_qualifications':
              mappedDetails.instructorQualifications = value;
              break;
            case 'instructor_bio':
              mappedDetails.instructorBio = value;
              break;
            case 'max_participants':
              mappedDetails.maxParticipants = value;
              break;
            case 'duration_hours':
              mappedDetails.durationHours = value;
              break;
            case 'number_of_sessions':
              mappedDetails.numberOfSessions = value;
              break;
            case 'session_duration':
              mappedDetails.sessionDuration = value;
              break;
            case 'start_date':
              mappedDetails.startDate = value ? dayjs(value) : null;
              break;
            case 'end_date':
              mappedDetails.endDate = value ? dayjs(value) : null;
              break;
            case 'registration_deadline':
              mappedDetails.registrationDeadline = value ? dayjs(value) : null;
              break;
            case 'delivery_method':
              mappedDetails.deliveryMethod = value;
              break;
            case 'meeting_platform':
              mappedDetails.meetingPlatform = value;
              break;
            case 'learning_objectives':
              mappedDetails.learningObjectives = value;
              break;
            case 'skill_level':
              mappedDetails.skillLevel = value;
              break;
            case 'training_type':
              mappedDetails.trainingType = value;
              break;
            case 'certification_provided':
              mappedDetails.certificationProvided = value;
              break;
            case 'certification_body':
              mappedDetails.certificationBody = value;
              break;
            case 'materials_provided':
              mappedDetails.materialsProvided = value;
              break;
            case 'materials_required':
              mappedDetails.materialsRequired = value;
              break;
            case 'is_free':
              mappedDetails.isFree = value;
              break;
            case 'course_language':
              mappedDetails.courseLanguage = value;
              break;
            case 'difficulty_rating':
              mappedDetails.difficultyRating = value;
              break;
            case 'location_details':
              mappedDetails.locationDetails = value;
              break;
            
            // Food fields
            case 'food_type':
              mappedDetails.foodType = value;
              break;
            case 'cuisine_type':
              mappedDetails.cuisineType = value;
              break;
            case 'serving_size':
              mappedDetails.servingSize = value;
              break;
            case 'dietary_restrictions':
              mappedDetails.dietaryRestrictions = value;
              break;
            case 'temperature_requirements':
              mappedDetails.temperatureRequirements = value;
              break;
            case 'expiration_date':
              mappedDetails.expirationDate = value ? dayjs(value) : null;
              break;
            case 'preparation_date':
              mappedDetails.preparationDate = value ? dayjs(value) : null;
              break;
            case 'delivery_available':
              mappedDetails.deliveryAvailable = value;
              break;
            case 'delivery_radius':
              mappedDetails.deliveryRadius = value;
              break;
            case 'pickup_instructions':
              mappedDetails.pickupInstructions = value;
              break;
            case 'storage_requirements':
              mappedDetails.storageRequirements = value;
              break;
            case 'nutritional_info':
              mappedDetails.nutritionalInfo = value;
              break;

            // Clothes fields  
            case 'clothes_type':
              mappedDetails.clothesType = value;
              break;
            case 'age_group':
              mappedDetails.ageGroup = value;
              break;
            case 'size_range':
              mappedDetails.sizeRange = value;
              break;
            case 'material_composition':
              mappedDetails.materialComposition = value;
              break;
            case 'care_instructions':
              mappedDetails.careInstructions = value;
              break;
            case 'special_features':
              mappedDetails.specialFeatures = value;
              break;
            case 'is_cleaned':
              mappedDetails.isCleaned = value;
              break;
            case 'donation_receipt_available':
              mappedDetails.donationReceiptAvailable = value;
              break;

            // Common fields - use camelCase form field names  
            default:
              // Convert snake_case to camelCase for any unmapped fields
              const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
              mappedDetails[camelCaseKey] = value;
              break;
          }
        });
      }

      const formData = {
        title: cause.title,
        description: cause.description,
        location: cause.location,
        priority: cause.priority,
        contactEmail: cause.contact_email,
        contactPhone: cause.contact_phone,
        tags: cause.tags || [],
        // Spread mapped category details to form fields
        ...mappedDetails,
      };
      
      console.log("Setting form values:", formData); // Debug log
      console.log("Mapped details:", mappedDetails); // Debug log
      form.setFieldsValue(formData);
    } catch (error) {
      console.error("Error fetching cause:", error);
      message.error("Failed to load cause details");
      router.push("/causes");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUploadedImages(prev => [...prev, result.data.url]);
          message.success("Image uploaded successfully");
        } else {
          message.error(result.error || "Failed to upload image");
        }
      } else {
        const errorResult = await response.json();
        message.error(errorResult.error || "Failed to upload image");
      }
    } catch (error) {
      message.error("Failed to upload image");
    }
    
    return false; // Prevent default upload
  };

  const renderCategorySpecificField = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            placeholder={field.placeholder}
            type={field.type}
            style={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          />
        );
      
      case 'textarea':
        return (
          <Input.TextArea
            placeholder={field.placeholder}
            rows={3}
            style={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          />
        );
      
      case 'number':
        return (
          <InputNumber
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            style={{ 
              width: '100%',
              borderRadius: '8px',
            }}
          />
        );
      
      case 'select':
        return (
          <Select
            placeholder={`Select ${field.label.toLowerCase()}`}
            style={{ 
              width: '100%',
              borderRadius: '8px',
            }}
          >
            {field.options.map((option: string) => (
              <Option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1).replace(/-/g, ' ')}
              </Option>
            ))}
          </Select>
        );
      
      case 'multiselect':
        return (
          <Select
            mode="multiple"
            placeholder={`Select ${field.label.toLowerCase()}`}
            style={{ 
              width: '100%',
              borderRadius: '8px',
            }}
          >
            {field.options.map((option: string) => (
              <Option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1).replace(/-/g, ' ')}
              </Option>
            ))}
          </Select>
        );
      
      case 'tags':
        return (
          <Select
            mode="tags"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            style={{ 
              width: '100%',
              borderRadius: '8px',
            }}
          />
        );
      
      case 'date':
        return (
          <DatePicker
            style={{ 
              width: '100%',
              borderRadius: '8px',
            }}
            format="YYYY-MM-DD"
          />
        );
      
      case 'switch':
        return (
          <Switch
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        );
      
      default:
        return (
          <Input
            placeholder={field.placeholder}
            style={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          />
        );
    }
  };

  const handleSubmit = async () => {
    if (!causeData) return;

    setSaving(true);
    try {
      const values = await form.validateFields();
      const resolvedParams = await params;
      
      // Extract category-specific data from form values
      const config = categoryFieldConfigs[causeData.category_name as keyof typeof categoryFieldConfigs];
      let categoryDetails: any = {};
      
      if (config) {
        // Build category details from form values
        config.fields.forEach(field => {
          if (values[field.name] !== undefined) {
            categoryDetails[field.name] = values[field.name];
          }
        });
        
        // Validate required fields
        for (const field of config.fields) {
          if (field.required && !values[field.name]) {
            message.error(`${field.label} is required`);
            setSaving(false);
            return;
          }
        }
      }
      
      // Separate basic cause data from category-specific data
      const { title, description, location, priority, contactEmail, contactPhone, tags, ...categoryData } = values;
      
      const updateData = {
        title,
        description,
        location,
        priority,
        contactEmail,
        contactPhone,
        tags: tags || [],
        category: causeData.category_name,
        causeType: causeData.cause_type,
        images: uploadedImages,
        categoryDetails: categoryDetails,
      };

      const response = await fetch(`/api/causes/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Your cause has been updated successfully!");
        router.push(`/causes/${resolvedParams.id}`);
      } else {
        throw new Error(result.error || "Failed to update cause");
      }
    } catch (error) {
      console.error("Error updating cause:", error);
      message.error("Failed to update cause. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const uploadProps = {
    name: 'file',
    beforeUpload: handleImageUpload,
    showUploadList: false,
    accept: 'image/*',
  };

  if (status === 'loading' || loading) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "100vh",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              border: "none",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!causeData) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "100vh",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              border: "none",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <Alert
              message="Cause not found"
              description="The cause you're trying to edit doesn't exist or you don't have permission to edit it."
              type="error"
              showIcon
            />
          </Card>
        </div>
      </MainLayout>
    );
  }

  const selectedCategory = categories.find(c => c.value === causeData.category_name);

  return (
    <MainLayout>
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{ marginBottom: "16px" }}
            >
              <Button
                type="text"
                icon={<FiArrowLeft />}
                onClick={() => router.back()}
                style={{
                  color: "white",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: "500"
                }}
              >
                Back to Initiative
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ fontSize: "32px", marginRight: "12px" }}>
                  {selectedCategory?.icon}
                </div>
                <Title 
                  level={1} 
                  style={{ 
                    color: "white",
                    fontSize: "clamp(28px, 4vw, 42px)",
                    fontWeight: "800",
                    marginBottom: "0",
                    fontFamily: "Inter, system-ui, sans-serif",
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                  }}
                >
                  Edit Initiative
                </Title>
              </div>
              <Text style={{ 
                color: "rgba(255,255,255,0.9)", 
                fontSize: "18px",
                fontFamily: "Inter, system-ui, sans-serif"
              }}>
                Update your {selectedCategory?.label.toLowerCase()} initiative details
              </Text>
            </motion.div>
          </div>
        </div>
        
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
          <Form form={form} layout="vertical">
            <motion.div
              variants={premiumAnimations.containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {/* Basic Information */}
                <motion.div variants={premiumAnimations.itemVariants}>
                  <Card
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "20px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Title level={3} style={{ 
                      marginBottom: "24px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center"
                    }}>
                      <FiInfo style={{ marginRight: "8px" }} />
                      Basic Information
                    </Title>
                    
                    <Row gutter={[24, 24]}>
                      <Col span={24}>
                        <Form.Item
                          name="title"
                          label={<Text strong style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Title</Text>}
                          rules={[
                            { required: true, message: 'Please enter a title' },
                            { min: 10, message: 'Title should be at least 10 characters' },
                          ]}
                        >
                          <Input
                            placeholder="Enter initiative title..."
                            style={{
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              padding: '12px'
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="description"
                          label={<Text strong style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Description</Text>}
                          rules={[
                            { required: true, message: 'Please provide a description' },
                            { min: 20, message: 'Description should be at least 20 characters' },
                          ]}
                        >
                          <MarkdownEditor
                            placeholder="Describe your initiative in detail..."
                            height={150}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="location"
                          label={<Text strong style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Location</Text>}
                          rules={[{ required: true, message: 'Please enter location' }]}
                        >
                          <Input
                            prefix={<FiMapPin style={{ color: '#64748b' }} />}
                            placeholder="City, neighborhood, or specific address"
                            style={{
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="priority"
                          label={<Text strong style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Priority</Text>}
                          rules={[{ required: true, message: 'Please select priority level' }]}
                        >
                          <Select style={{ borderRadius: '8px' }}>
                            <Option value="low">Low - No rush</Option>
                            <Option value="medium">Medium - Within a week</Option>
                            <Option value="high">High - Within a few days</Option>
                            <Option value="urgent">Urgent - ASAP</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Contact Information */}
                    <Divider style={{ margin: "32px 0" }} />
                    <Title level={4} style={{ 
                      marginBottom: "20px",
                      color: "#1e293b",
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center"
                    }}>
                      <FiUser style={{ marginRight: "8px" }} />
                      Contact Information
                    </Title>
                    
                    <Row gutter={[24, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="contactEmail"
                          label={<Text strong style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Contact Email</Text>}
                          rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter valid email' },
                          ]}
                        >
                          <Input style={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                          }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="contactPhone"
                          label={<Text strong style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Phone (optional)</Text>}
                        >
                          <Input
                            placeholder="+1 (555) 123-4567"
                            style={{
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>

                {/* Category-Specific Fields */}
                {categoryFieldConfigs[causeData.category_name as keyof typeof categoryFieldConfigs] && (
                  <motion.div variants={premiumAnimations.itemVariants}>
                    <Card
                      style={{
                        background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "20px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Title level={3} style={{ 
                        marginBottom: "24px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        {categoryFieldConfigs[causeData.category_name as keyof typeof categoryFieldConfigs].icon}
                        <span style={{ marginLeft: 8 }}>
                          {causeData.category_name.charAt(0).toUpperCase() + causeData.category_name.slice(1)} Details
                        </span>
                      </Title>
                      
                      <Row gutter={[24, 16]}>
                        {categoryFieldConfigs[causeData.category_name as keyof typeof categoryFieldConfigs].fields.map((field) => (
                          <Col 
                            key={field.name} 
                            xs={24} 
                            sm={field.type === 'textarea' ? 24 : 12}
                            md={field.type === 'textarea' ? 24 : field.type === 'switch' ? 8 : 12}
                          >
                            <Form.Item
                              name={field.name}
                              label={
                                <Text strong style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                                  {field.label}
                                  {field.required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
                                </Text>
                              }
                            >
                              {renderCategorySpecificField(field)}
                            </Form.Item>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </motion.div>
                )}

                {/* Images Upload */}
                <motion.div variants={premiumAnimations.itemVariants}>
                  <Card
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "20px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Title level={3} style={{ 
                      marginBottom: "24px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center"
                    }}>
                      <FiUpload style={{ marginRight: "8px" }} />
                      Images (Optional)
                    </Title>
                    
                    <Upload
                      {...uploadProps}
                      listType="picture-card"
                      className="premium-uploader"
                    >
                      {uploadedImages.length < 5 && (
                        <div style={{ textAlign: 'center' }}>
                          <FiUpload style={{ fontSize: 24, marginBottom: 8, color: "#667eea" }} />
                          <div style={{ color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
                            Upload Image
                          </div>
                        </div>
                      )}
                    </Upload>
                    
                    {uploadedImages.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <Row gutter={[12, 12]}>
                          {uploadedImages.map((url, index) => (
                            <Col key={index} xs={12} sm={8} md={6}>
                              <div style={{ position: 'relative' }}>
                                <Image
                                  src={url}
                                  alt={`Upload ${index + 1}`}
                                  width="100%"
                                  height={100}
                                  style={{ 
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                  }}
                                />
                                {index === 0 && (
                                  <Tag 
                                    style={{
                                      position: 'absolute',
                                      top: 4,
                                      left: 4,
                                      fontSize: 10,
                                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                      color: "white",
                                      border: "none"
                                    }}
                                  >
                                    Main
                                  </Tag>
                                )}
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  style={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    width: 24,
                                    height: 24,
                                    padding: 0,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                  }}
                                  onClick={() => {
                                    const newImages = uploadedImages.filter((_, i) => i !== index);
                                    setUploadedImages(newImages);
                                  }}
                                >
                                  ×
                                </Button>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </Card>
                </motion.div>

                {/* Tags */}
                <motion.div variants={premiumAnimations.itemVariants}>
                  <Card
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "20px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Row gutter={[24, 16]}>
                      <Col span={24}>
                        <Form.Item
                          name="tags"
                          label={<Text strong style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Tags (Optional)</Text>}
                        >
                          <Select
                            mode="tags"
                            placeholder="Add tags to help people find your cause"
                            style={{ 
                              borderRadius: '8px',
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>

                {/* Submit Button */}
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      loading={saving}
                      onClick={handleSubmit}
                      icon={<FiSave />}
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        borderRadius: "12px",
                        height: "56px",
                        padding: "0 48px",
                        fontSize: "16px",
                        fontWeight: "600",
                        fontFamily: "Inter, system-ui, sans-serif",
                        boxShadow: "0 8px 20px rgba(102,126,234,0.3)",
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </motion.div>
                  
                  <div style={{ marginTop: 16 }}>
                    <Text style={{ 
                      fontSize: 14, 
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: "Inter, system-ui, sans-serif"
                    }}>
                      Your updated initiative will be visible to the community immediately
                    </Text>
                  </div>
                </div>
              </Space>
            </motion.div>
          </Form>
        </div>
      </div>
      
      <style jsx global>{`
        .premium-uploader .ant-upload-select-picture-card {
          border: 2px dashed rgba(102,126,234,0.3) !important;
          border-radius: 12px !important;
          background: rgba(102,126,234,0.05) !important;
          transition: all 0.3s !important;
        }
        
        .premium-uploader .ant-upload-select-picture-card:hover {
          border-color: #667eea !important;
          background: rgba(102,126,234,0.1) !important;
        }
        
        .ant-select-dropdown {
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
        }
        
        .ant-input, .ant-select-selector {
          border-color: #e2e8f0 !important;
        }
        
        .ant-input:focus, .ant-input-focused {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102,126,234,0.2) !important;
        }
        
        .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: #667eea !important;
        }
        
        .ant-select-focused .ant-select-selector {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102,126,234,0.2) !important;
        }

        .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #1e293b !important;
          font-family: 'Inter', system-ui, sans-serif !important;
        }
      `}</style>
    </MainLayout>
  );
}
