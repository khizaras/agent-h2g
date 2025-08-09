"use client";

import React, { useState, useEffect } from "react";
import {
  Card, Form, Input, Button, Select, Upload, Typography, Row, Col, message,
  Image, Space, Tag, InputNumber, DatePicker, Switch, Divider, TimePicker,
  Steps, Skeleton
} from "antd";
import {
  FiPlus, FiUpload, FiMapPin, FiArrowLeft, FiInfo, FiUser, FiUsers,
  FiCalendar, FiClock, FiBook, FiTarget, FiDollarSign, FiAward, FiPackage,
  FiHeart, FiCheckCircle, FiArrowRight
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Step } = Steps;

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

export default function CreateCausePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCauseType, setSelectedCauseType] = useState<'wanted' | 'offered' | ''>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<any>({});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  const handleImageUpload = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUploadedImages(prev => [...prev, result.data.url]);
          message.success('Image uploaded successfully');
        } else {
          message.error(result.error || 'Failed to upload image');
        }
      } else {
        const errorResult = await response.json();
        message.error(errorResult.error || 'Failed to upload image');
      }
    } catch (error) {
      message.error('Failed to upload image');
    }
    
    return false; // Prevent default upload
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedCauseType('');
    setCategoryDetails({});
    setCurrentStep(1);
  };

  const handleCauseTypeSelect = (type: 'wanted' | 'offered') => {
    setSelectedCauseType(type);
    setCurrentStep(2);
  };

  const renderCategorySpecificField = (field: any) => {
    const value = categoryDetails[field.name];
    const onChange = (val: any) => {
      setCategoryDetails((prev: any) => ({ ...prev, [field.name]: val }));
    };

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
            value={value}
            onChange={onChange}
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
            value={value}
            onChange={onChange}
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
            value={value || []}
            onChange={onChange}
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
            value={value || []}
            onChange={onChange}
            style={{ 
              width: '100%',
              borderRadius: '8px',
            }}
          />
        );
      
      case 'date':
        return (
          <DatePicker
            value={value ? dayjs(value) : null}
            onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : null)}
            style={{ 
              width: '100%',
              borderRadius: '8px',
            }}
          />
        );
      
      case 'switch':
        return (
          <Switch
            checked={value || false}
            onChange={onChange}
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        );
      
      default:
        return (
          <Input
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          />
        );
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      message.error('Please select a category');
      return;
    }
    
    if (selectedCategory !== 'training' && !selectedCauseType) {
      message.error('Please select if you are offering or looking for support');
      return;
    }

    setLoading(true);
    try {
      const values = await form.validateFields();
      
      // Validate required category-specific fields
      const config = categoryFieldConfigs[selectedCategory as keyof typeof categoryFieldConfigs];
      if (config) {
        for (const field of config.fields) {
          if (field.required && !categoryDetails[field.name]) {
            message.error(`${field.label} is required`);
            setLoading(false);
            return;
          }
        }
      }
      
      const submitData = {
        ...values,
        category: selectedCategory,
        causeType: selectedCauseType || 'offered',
        images: uploadedImages,
        categoryDetails: categoryDetails,
      };

      const response = await fetch('/api/causes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        message.success('Your cause has been created successfully!');
        router.push(`/causes/${result.data.id}`);
      } else {
        throw new Error(result.error || 'Failed to create cause');
      }
    } catch (error) {
      console.error('Error creating cause:', error);
      message.error('Failed to create cause. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    beforeUpload: handleImageUpload,
    showUploadList: false,
    accept: 'image/*',
  };

  if (status === 'loading') {
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
            {selectedCategory && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{ marginBottom: "16px" }}
              >
                <Button
                  type="text"
                  icon={<FiArrowLeft />}
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedCauseType('');
                    setCategoryDetails({});
                    setCurrentStep(0);
                  }}
                  style={{
                    color: "white",
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: "500"
                  }}
                >
                  Back to Categories
                </Button>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Title 
                level={1} 
                style={{ 
                  color: "white",
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: "800",
                  marginBottom: "8px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  textShadow: "0 4px 20px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.8)"
                }}
              >
                Create Initiative
              </Title>
              <Text style={{ 
                color: "white", 
                fontSize: "18px",
                fontFamily: "Inter, system-ui, sans-serif",
                textShadow: "0 2px 10px rgba(0,0,0,0.8), 0 1px 5px rgba(0,0,0,0.6)"
              }}>
                Share resources and connect with your community
              </Text>
            </motion.div>

            {/* Progress Steps */}
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ marginTop: "32px" }}
              >
                <Steps
                  current={currentStep}
                  size="small"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <Step title="Category" />
                  {categories.find(c => c.value === selectedCategory)?.hasType && (
                    <Step title="Type" />
                  )}
                  <Step title="Details" />
                  <Step title="Review" />
                </Steps>
              </motion.div>
            )}
          </div>
        </div>
        
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
          <Form form={form} layout="vertical">
            <motion.div
              variants={premiumAnimations.containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Category Selection */}
              {!selectedCategory && (
                <motion.div variants={premiumAnimations.itemVariants}>
                  <Card
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "24px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      textAlign: "center",
                      padding: "40px 20px"
                    }}
                  >
                    <Title 
                      level={2} 
                      style={{ 
                        marginBottom: "32px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontWeight: "700"
                      }}
                    >
                      Choose a Category
                    </Title>
                    <Row gutter={[24, 24]}>
                      {categories.map((category) => (
                        <Col xs={24} sm={8} key={category.value}>
                          <motion.div
                            whileHover={premiumAnimations.cardHover}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              hoverable
                              style={{
                                background: "rgba(255,255,255,0.7)",
                                border: "1px solid rgba(102,126,234,0.1)",
                                borderRadius: "16px",
                                textAlign: "center",
                                cursor: "pointer",
                                height: "180px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                              }}
                              bodyStyle={{ padding: "24px" }}
                              onClick={() => handleCategorySelect(category.value)}
                            >
                              <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                                {category.icon}
                              </div>
                              <Title 
                                level={4} 
                                style={{ 
                                  marginBottom: "8px",
                                  color: "#1e293b",
                                  fontFamily: "Inter, system-ui, sans-serif",
                                  fontWeight: "600"
                                }}
                              >
                                {category.label}
                              </Title>
                              <Text style={{ 
                                color: "#64748b", 
                                fontSize: "14px",
                                fontFamily: "Inter, system-ui, sans-serif"
                              }}>
                                {category.description}
                              </Text>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </motion.div>
              )}

              {/* Cause Type Selection */}
              <AnimatePresence>
                {selectedCategory && categories.find(c => c.value === selectedCategory)?.hasType && !selectedCauseType && (
                  <motion.div
                    variants={premiumAnimations.itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Card
                      style={{
                        background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "24px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        textAlign: "center",
                        padding: "40px 20px"
                      }}
                    >
                      <div style={{ marginBottom: "32px" }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                          {categories.find(c => c.value === selectedCategory)?.icon}
                        </div>
                        <Title 
                          level={2} 
                          style={{ 
                            marginBottom: "8px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontWeight: "700"
                          }}
                        >
                          Are you offering or seeking {selectedCategory}?
                        </Title>
                      </div>
                      
                      <Row gutter={[32, 32]} justify="center">
                        <Col xs={24} sm={10}>
                          <motion.div
                            whileHover={premiumAnimations.cardHover}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              hoverable
                              style={{
                                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
                                border: "2px solid rgba(16, 185, 129, 0.2)",
                                borderRadius: "16px",
                                cursor: "pointer",
                                height: "140px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                              }}
                              bodyStyle={{ padding: "24px", textAlign: "center" }}
                              onClick={() => handleCauseTypeSelect('offered')}
                            >
                              <FiHeart style={{ fontSize: "32px", color: "#10b981", marginBottom: "12px" }} />
                              <Title level={4} style={{ 
                                marginBottom: "8px", 
                                color: "#10b981",
                                fontFamily: "Inter, system-ui, sans-serif",
                                fontWeight: "600"
                              }}>
                                Offering
                              </Title>
                              <Text style={{ 
                                color: "#64748b",
                                fontFamily: "Inter, system-ui, sans-serif"
                              }}>
                                I have {selectedCategory} to share
                              </Text>
                            </Card>
                          </motion.div>
                        </Col>
                        <Col xs={24} sm={10}>
                          <motion.div
                            whileHover={premiumAnimations.cardHover}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              hoverable
                              style={{
                                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
                                border: "2px solid rgba(59, 130, 246, 0.2)",
                                borderRadius: "16px",
                                cursor: "pointer",
                                height: "140px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                              }}
                              bodyStyle={{ padding: "24px", textAlign: "center" }}
                              onClick={() => handleCauseTypeSelect('wanted')}
                            >
                              <FiInfo style={{ fontSize: "32px", color: "#3b82f6", marginBottom: "12px" }} />
                              <Title level={4} style={{ 
                                marginBottom: "8px", 
                                color: "#3b82f6",
                                fontFamily: "Inter, system-ui, sans-serif",
                                fontWeight: "600"
                              }}>
                                Seeking
                              </Title>
                              <Text style={{ 
                                color: "#64748b",
                                fontFamily: "Inter, system-ui, sans-serif"
                              }}>
                                I need {selectedCategory} support
                              </Text>
                            </Card>
                          </motion.div>
                        </Col>
                      </Row>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Form */}
              <AnimatePresence>
                {selectedCategory && (selectedCauseType || selectedCategory === 'training') && (
                  <motion.div
                    variants={premiumAnimations.itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                      {/* Basic Information */}
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
                                placeholder={`e.g., ${selectedCategory === 'food' ? 'Fresh homemade meals for families in need' : selectedCategory === 'clothes' ? 'Winter coats for children aged 5-12' : 'Full-stack web development bootcamp'}`}
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
                                placeholder="Describe what you're offering or what you need. Include details about quantity, timing, and any special requirements."
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
                              initialValue="medium"
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
                              initialValue={session?.user?.email}
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

                      {/* Category-Specific Fields */}
                      {categoryFieldConfigs[selectedCategory as keyof typeof categoryFieldConfigs] && (
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
                            {categoryFieldConfigs[selectedCategory as keyof typeof categoryFieldConfigs].icon}
                            <span style={{ marginLeft: 8 }}>
                              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Details
                            </span>
                          </Title>
                          
                          <Row gutter={[24, 16]}>
                            {categoryFieldConfigs[selectedCategory as keyof typeof categoryFieldConfigs].fields.map((field) => (
                              <Col 
                                key={field.name} 
                                xs={24} 
                                sm={field.type === 'textarea' ? 24 : 12}
                                md={field.type === 'textarea' ? 24 : field.type === 'switch' ? 8 : 12}
                              >
                                <Form.Item
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
                      )}

                      {/* Images Upload */}
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
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        )}
                      </Card>

                      {/* Tags */}
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

                      {/* Submit Button */}
                      <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="primary"
                            size="large"
                            loading={loading}
                            onClick={handleSubmit}
                            icon={<FiCheckCircle />}
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
                            Create Initiative
                          </Button>
                        </motion.div>
                        
                        <div style={{ marginTop: 16 }}>
                          <Text style={{ 
                            fontSize: 14, 
                            color: "rgba(255,255,255,0.8)",
                            fontFamily: "Inter, system-ui, sans-serif"
                          }}>
                            Your initiative will be published immediately and visible to the community
                          </Text>
                        </div>
                      </div>
                    </Space>
                  </motion.div>
                )}
              </AnimatePresence>
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

        .ant-steps-item-finish .ant-steps-item-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border-color: #667eea !important;
        }

        .ant-steps-item-process .ant-steps-item-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border-color: #667eea !important;
        }
      `}</style>
    </MainLayout>
  );
}