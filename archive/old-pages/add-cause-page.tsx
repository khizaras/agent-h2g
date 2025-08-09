"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Upload,
  Typography,
  Row,
  Col,
  message,
  Radio,
  Image,
  Breadcrumb,
  Space,
  Tag,
  InputNumber,
  DatePicker,
  Switch,
  Divider,
  Checkbox,
  TimePicker,
  Tooltip,
} from "antd";
import {
  FiPlus,
  FiUpload,
  FiMapPin,
  FiArrowLeft,
  FiInfo,
  FiUser,
  FiUsers,
  FiCalendar,
  FiClock,
  FiBook,
  FiTarget,
  FiDollarSign,
  FiGlobe,
  FiAward,
  FiShirt,
  FiTrendingUp,
  FiPackage,
  FiHeart,
  FiStar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface CauseFormData {
  title: string;
  description: string;
  category: string;
  causeType: 'wanted' | 'offered';
  location: string;
  priority: string;
  contactEmail: string;
  contactPhone?: string;
  images?: string[];
  tags?: string[];
  
  // Category-specific details
  categoryDetails?: any;
}

const categories = [
  {
    value: 'food',
    label: 'Food Support',
    emoji: '🍽️',
    description: 'Share meals and food supplies with those in need',
    color: '#ff6b35',
    hasType: true,
  },
  {
    value: 'clothes',
    label: 'Clothing',
    emoji: '👕',
    description: 'Donate and request clothing items for all ages',
    color: '#4ecdc4',
    hasType: true,
  },
  {
    value: 'training',
    label: 'Training & Education',
    emoji: '📚',
    description: 'Share knowledge through courses and workshops',
    color: '#45b7d1',
    hasType: false,
  },
];

// Enhanced category-specific field configurations
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
      { name: 'servingSize', label: 'Serving Size', type: 'number', min: 1 },
      { name: 'temperatureRequirements', label: 'Temperature Requirements', type: 'select', required: true,
        options: ['hot', 'room-temp', 'refrigerated', 'frozen'] },
      { name: 'expirationDate', label: 'Expiration/Best Before Date', type: 'date' },
      { name: 'preparationDate', label: 'Preparation Date', type: 'date' },
      { name: 'dietaryRestrictions', label: 'Dietary Restrictions', type: 'multiselect',
        options: ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free', 'dairy-free', 'nut-free', 'sugar-free'] },
      { name: 'allergens', label: 'Contains Allergens', type: 'multiselect',
        options: ['nuts', 'dairy', 'eggs', 'gluten', 'soy', 'shellfish', 'fish', 'seeds'] },
      { name: 'ingredients', label: 'Main Ingredients', type: 'markdown', placeholder: 'List the main ingredients used...' },
      { name: 'storageRequirements', label: 'Storage Requirements', type: 'text' },
      { name: 'pickupInstructions', label: 'Pickup Instructions', type: 'markdown' },
      { name: 'deliveryAvailable', label: 'Delivery Available', type: 'switch' },
      { name: 'deliveryRadius', label: 'Delivery Radius (km)', type: 'number', min: 1, max: 50 },
      { name: 'isUrgent', label: 'Urgent Need', type: 'switch' },
      { name: 'nutritionalInfo', label: 'Nutritional Information', type: 'markdown', placeholder: 'Provide nutritional details if available...' },
    ]
  },
  clothes: {
    icon: <FiShirt />,
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
      { name: 'materialComposition', label: 'Material Composition', type: 'text', placeholder: 'e.g., 100% Cotton, 80% Polyester 20% Cotton' },
      { name: 'careInstructions', label: 'Care Instructions', type: 'markdown' },
      { name: 'specialRequirements', label: 'Special Requirements', type: 'markdown' },
      { name: 'pickupInstructions', label: 'Pickup Instructions', type: 'markdown' },
      { name: 'deliveryAvailable', label: 'Delivery Available', type: 'switch' },
      { name: 'deliveryRadius', label: 'Delivery Radius (km)', type: 'number', min: 1, max: 50 },
      { name: 'isUrgent', label: 'Urgent Need', type: 'switch' },
      { name: 'isCleaned', label: 'Items are Cleaned', type: 'switch' },
      { name: 'donationReceiptAvailable', label: 'Donation Receipt Available', type: 'switch' },
    ]
  },
  training: {
    icon: <FiBook />,
    fields: [
      { name: 'trainingType', label: 'Training Type', type: 'select', required: true,
        options: ['workshop', 'course', 'mentoring', 'seminar', 'bootcamp', 'certification', 'skills', 'academic'] },
      { name: 'skillLevel', label: 'Skill Level', type: 'select', required: true,
        options: ['beginner', 'intermediate', 'advanced', 'expert', 'all-levels'] },
      { name: 'topics', label: 'Topics Covered', type: 'multiselect', required: true,
        options: ['programming', 'web-development', 'data-science', 'design', 'marketing', 'business', 'languages', 'cooking', 'crafts', 'music', 'fitness', 'academic-subjects'] },
      { name: 'maxParticipants', label: 'Maximum Participants', type: 'number', required: true, min: 1, max: 500 },
      { name: 'currentParticipants', label: 'Current Participants', type: 'number', min: 0 },
      { name: 'durationHours', label: 'Duration (Hours)', type: 'number', required: true, min: 0.5, max: 1000 },
      { name: 'numberOfSessions', label: 'Number of Sessions', type: 'number', required: true, min: 1 },
      { name: 'prerequisites', label: 'Prerequisites', type: 'markdown', placeholder: 'List any required knowledge or skills...' },
      { name: 'learningObjectives', label: 'Learning Objectives', type: 'markdown', required: true, placeholder: 'What will participants learn? List the key objectives...' },
      { name: 'curriculum', label: 'Curriculum/Syllabus', type: 'markdown', required: true, placeholder: 'Detailed curriculum or session breakdown...' },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'End Date', type: 'date', required: true },
      { name: 'registrationDeadline', label: 'Registration Deadline', type: 'date' },
      { name: 'schedule', label: 'Schedule Details', type: 'markdown', placeholder: 'Class timings, days of the week, frequency...' },
      { name: 'deliveryMethod', label: 'Delivery Method', type: 'select', required: true,
        options: ['in-person', 'online', 'hybrid', 'self-paced'] },
      { name: 'locationDetails', label: 'Location Details', type: 'text' },
      { name: 'meetingPlatform', label: 'Meeting Platform', type: 'select',
        options: ['zoom', 'google-meet', 'microsoft-teams', 'skype', 'discord', 'custom', 'other'] },
      { name: 'meetingLink', label: 'Meeting Link', type: 'text' },
      { name: 'instructors', label: 'Instructors', type: 'instructor-list', required: true },
      { name: 'certificationProvided', label: 'Certification Provided', type: 'switch' },
      { name: 'certificationBody', label: 'Certification Body', type: 'text' },
      { name: 'materialsProvided', label: 'Materials Provided', type: 'multiselect',
        options: ['textbooks', 'workbooks', 'software', 'tools', 'certificates', 'recordings', 'presentations', 'assignments'] },
      { name: 'materialsRequired', label: 'Materials Required', type: 'multiselect',
        options: ['laptop', 'desktop', 'tablet', 'smartphone', 'notebook', 'pen', 'calculator', 'textbooks', 'software'] },
      { name: 'softwareRequired', label: 'Software Required', type: 'tags' },
      { name: 'price', label: 'Price', type: 'number', min: 0 },
      { name: 'isFree', label: 'Free Course', type: 'switch' },
      { name: 'courseLanguage', label: 'Course Language', type: 'select', required: true,
        options: ['english', 'hindi', 'spanish', 'french', 'german', 'chinese', 'japanese', 'arabic', 'other'] },
      { name: 'subtitlesAvailable', label: 'Subtitles Available', type: 'multiselect',
        options: ['english', 'hindi', 'spanish', 'french', 'german', 'chinese', 'japanese', 'arabic'] },
      { name: 'difficultyRating', label: 'Difficulty Rating (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'courseMaterialsUrl', label: 'Course Materials URL', type: 'text' },
      { name: 'enrollmentStatus', label: 'Enrollment Status', type: 'select', required: true,
        options: ['open', 'closed', 'waitlist', 'full'] },
    ]
  }
};

// Instructor input component for training
const InstructorInput = ({ value = [], onChange }) => {
  const [instructors, setInstructors] = useState(value || [{ name: '', email: '', phone: '', bio: '', qualifications: '' }]);

  const handleInstructorChange = (index, field, val) => {
    const newInstructors = [...instructors];
    newInstructors[index] = { ...newInstructors[index], [field]: val };
    setInstructors(newInstructors);
    onChange(newInstructors);
  };

  const addInstructor = () => {
    const newInstructors = [...instructors, { name: '', email: '', phone: '', bio: '', qualifications: '' }];
    setInstructors(newInstructors);
    onChange(newInstructors);
  };

  const removeInstructor = (index) => {
    if (instructors.length > 1) {
      const newInstructors = instructors.filter((_, i) => i !== index);
      setInstructors(newInstructors);
      onChange(newInstructors);
    }
  };

  return (
    <div>
      {instructors.map((instructor, index) => (
        <Card key={index} style={{ marginBottom: 16 }} size="small">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text strong>Instructor {index + 1}</Text>
            {instructors.length > 1 && (
              <Button size="small" danger onClick={() => removeInstructor(index)}>
                Remove
              </Button>
            )}
          </div>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12}>
              <Input
                placeholder="Full Name *"
                value={instructor.name}
                onChange={(e) => handleInstructorChange(index, 'name', e.target.value)}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                placeholder="Email *"
                type="email"
                value={instructor.email}
                onChange={(e) => handleInstructorChange(index, 'email', e.target.value)}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                placeholder="Phone"
                value={instructor.phone}
                onChange={(e) => handleInstructorChange(index, 'phone', e.target.value)}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                placeholder="Qualifications"
                value={instructor.qualifications}
                onChange={(e) => handleInstructorChange(index, 'qualifications', e.target.value)}
              />
            </Col>
            <Col xs={24}>
              <Input.TextArea
                placeholder="Bio/Experience"
                rows={2}
                value={instructor.bio}
                onChange={(e) => handleInstructorChange(index, 'bio', e.target.value)}
              />
            </Col>
          </Row>
        </Card>
      ))}
      <Button type="dashed" onClick={addInstructor} icon={<FiPlus />} style={{ width: '100%' }}>
        Add Another Instructor
      </Button>
    </div>
  );
};

export default function CreateCausePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
    setSelectedCauseType(''); // Reset cause type when category changes
    setCategoryDetails({}); // Reset category details
  };
  
  const handleCauseTypeSelect = (type: 'wanted' | 'offered') => {
    setSelectedCauseType(type);
  };

  const renderCategorySpecificField = (field, index) => {
    const value = categoryDetails[field.name];
    const onChange = (val) => {
      setCategoryDetails(prev => ({ ...prev, [field.name]: val }));
    };

    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="large"
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
            style={{ width: '100%' }}
            size="large"
          />
        );
      
      case 'select':
        return (
          <Select
            placeholder={`Select ${field.label.toLowerCase()}`}
            value={value}
            onChange={onChange}
            size="large"
            style={{ width: '100%' }}
          >
            {field.options.map(option => (
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
            size="large"
            style={{ width: '100%' }}
          >
            {field.options.map(option => (
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
            size="large"
            style={{ width: '100%' }}
          />
        );
      
      case 'date':
        return (
          <DatePicker
            value={value ? dayjs(value) : null}
            onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : null)}
            size="large"
            style={{ width: '100%' }}
          />
        );
      
      case 'time':
        return (
          <TimePicker
            value={value ? dayjs(value, 'HH:mm') : null}
            onChange={(time) => onChange(time ? time.format('HH:mm') : null)}
            size="large"
            style={{ width: '100%' }}
            format="HH:mm"
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
      
      case 'markdown':
        return (
          <MarkdownEditor
            value={value || ''}
            onChange={onChange}
            placeholder={field.placeholder}
            height={150}
          />
        );
      
      case 'instructor-list':
        return (
          <InstructorInput
            value={value}
            onChange={onChange}
          />
        );
      
      default:
        return (
          <Input
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="large"
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
      const config = categoryFieldConfigs[selectedCategory];
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
        causeType: selectedCauseType || 'offered', // Default for training
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
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <Text>Loading...</Text>
        </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        {/* Breadcrumb */}
        <Breadcrumb
          style={{ marginBottom: 24 }}
          items={[
            { title: 'Causes' },
            { title: 'Create new cause' },
          ]}
        />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 32 }}
        >
          <Title 
            level={1} 
            style={{ 
              fontSize: '32px',
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: 8,
            }}
          >
            Create a new cause
          </Title>
          <Text style={{ fontSize: 16, color: '#5f6368' }}>
            Share resources and connect with your community using our enhanced form
          </Text>
        </motion.div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Category Selection */}
          {!selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ marginBottom: 32 }}
            >
              <Card style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <Title level={3} style={{ color: '#1a1a1a', marginBottom: 24, textAlign: 'center' }}>
                  What would you like to share?
                </Title>
                <Row gutter={[20, 20]}>
                  {categories.map((category) => (
                    <Col xs={24} sm={8} key={category.value}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          hoverable
                          style={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            border: '2px solid #e8eaed',
                            borderRadius: 16,
                            transition: 'all 0.3s',
                            height: '100%',
                          }}
                          bodyStyle={{ padding: 24 }}
                          onClick={() => handleCategorySelect(category.value)}
                        >
                          <div style={{ fontSize: 48, marginBottom: 16 }}>
                            {category.emoji}
                          </div>
                          <Title level={4} style={{ margin: 0, marginBottom: 8, color: category.color }}>
                            {category.label}
                          </Title>
                          <Text style={{ color: '#5f6368', fontSize: 14, lineHeight: 1.5 }}>
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

          {/* Selected Category Content */}
          <AnimatePresence>
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', marginBottom: 24 }}>
                  {/* Category Header */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: 24,
                    padding: 20,
                    backgroundColor: `${categories.find(c => c.value === selectedCategory)?.color}15`,
                    borderRadius: 12,
                  }}>
                    <Button
                      type="text"
                      icon={<FiArrowLeft />}
                      onClick={() => {
                        setSelectedCategory('');
                        setSelectedCauseType('');
                        setCategoryDetails({});
                      }}
                      style={{ marginRight: 12 }}
                    />
                    <div style={{ fontSize: 32, marginRight: 16 }}>
                      {categories.find(c => c.value === selectedCategory)?.emoji}
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 18, display: 'block' }}>
                        {categories.find(c => c.value === selectedCategory)?.label}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#5f6368' }}>
                        {categories.find(c => c.value === selectedCategory)?.description}
                      </Text>
                    </div>
                  </div>

                  {/* Cause Type Selection for Food/Clothes */}
                  {categories.find(c => c.value === selectedCategory)?.hasType && !selectedCauseType && (
                    <div style={{ marginBottom: 32 }}>
                      <Title level={4} style={{ marginBottom: 20, textAlign: 'center' }}>
                        Are you offering or looking for {selectedCategory}?
                      </Title>
                      <Row gutter={[20, 20]}>
                        <Col xs={24} sm={12}>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Card
                              hoverable
                              style={{
                                cursor: 'pointer',
                                border: '2px solid #e8eaed',
                                borderRadius: 12,
                                transition: 'all 0.3s',
                              }}
                              bodyStyle={{ padding: 24, textAlign: 'center' }}
                              onClick={() => handleCauseTypeSelect('offered')}
                            >
                              <FiHeart style={{ fontSize: 32, color: '#52c41a', marginBottom: 12 }} />
                              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Offering</div>
                              <div style={{ fontSize: 14, color: '#5f6368' }}>
                                I have {selectedCategory} to share
                              </div>
                            </Card>
                          </motion.div>
                        </Col>
                        <Col xs={24} sm={12}>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Card
                              hoverable
                              style={{
                                cursor: 'pointer',
                                border: '2px solid #e8eaed',
                                borderRadius: 12,
                                transition: 'all 0.3s',
                              }}
                              bodyStyle={{ padding: 24, textAlign: 'center' }}
                              onClick={() => handleCauseTypeSelect('wanted')}
                            >
                              <FiInfo style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }} />
                              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Looking for</div>
                              <div style={{ fontSize: 14, color: '#5f6368' }}>
                                I need {selectedCategory} support
                              </div>
                            </Card>
                          </motion.div>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {/* Main Form Fields */}
                  {(selectedCauseType || selectedCategory === 'training') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {/* Basic Information */}
                      <Title level={4} style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
                        <FiInfo style={{ marginRight: 8 }} />
                        Basic Information
                      </Title>
                      
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <Form.Item
                            name="title"
                            label={<Text strong>Title</Text>}
                            rules={[
                              { required: true, message: 'Please enter a title' },
                              { min: 10, message: 'Title should be at least 10 characters' },
                            ]}
                          >
                            <Input
                              size="large"
                              placeholder={`e.g., ${selectedCategory === 'food' ? 'Fresh homemade meals for families in need' : selectedCategory === 'clothes' ? 'Winter coats for children aged 5-12' : 'Full-stack web development bootcamp'}`}
                              style={{ borderRadius: 8 }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <Form.Item
                            name="description"
                            label={<Text strong>Description</Text>}
                            rules={[
                              { required: true, message: 'Please provide a description' },
                              { min: 20, message: 'Description should be at least 20 characters' },
                            ]}
                          >
                            <MarkdownEditor
                              placeholder="Describe what you're offering or what you need. Include details about quantity, timing, and any special requirements. You can use markdown formatting for better presentation."
                              height={200}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="location"
                            label={<Text strong>Location</Text>}
                            rules={[{ required: true, message: 'Please enter location' }]}
                          >
                            <Input
                              size="large"
                              prefix={<FiMapPin style={{ color: '#5f6368' }} />}
                              placeholder="City, neighborhood, or specific address"
                              style={{ borderRadius: 8 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="priority"
                            label={<Text strong>Urgency</Text>}
                            rules={[{ required: true, message: 'Please select urgency level' }]}
                            initialValue="medium"
                          >
                            <Select size="large" style={{ borderRadius: 8 }}>
                              <Option value="low">Low - No rush</Option>
                              <Option value="medium">Medium - Within a week</Option>
                              <Option value="high">High - Within a few days</Option>
                              <Option value="urgent">Urgent - ASAP</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Contact Information */}
                      <Divider />
                      <Title level={4} style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
                        <FiUser style={{ marginRight: 8 }} />
                        Contact Information
                      </Title>
                      
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="contactEmail"
                            label={<Text strong>Contact Email</Text>}
                            rules={[
                              { required: true, message: 'Please enter email' },
                              { type: 'email', message: 'Please enter valid email' },
                            ]}
                            initialValue={session?.user?.email}
                          >
                            <Input size="large" style={{ borderRadius: 8 }} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="contactPhone"
                            label={<Text strong>Phone (optional)</Text>}
                          >
                            <Input
                              size="large"
                              placeholder="+1 (555) 123-4567"
                              style={{ borderRadius: 8 }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Category-Specific Fields */}
                      {categoryFieldConfigs[selectedCategory] && (
                        <>
                          <Divider />
                          <Title level={4} style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
                            {categoryFieldConfigs[selectedCategory].icon}
                            <span style={{ marginLeft: 8 }}>
                              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Details
                            </span>
                          </Title>
                          
                          <Row gutter={[16, 16]}>
                            {categoryFieldConfigs[selectedCategory].fields.map((field, index) => (
                              <Col 
                                key={field.name} 
                                xs={24} 
                                sm={field.type === 'markdown' || field.type === 'instructor-list' ? 24 : 12}
                                md={field.type === 'markdown' || field.type === 'instructor-list' ? 24 : field.type === 'switch' ? 8 : 12}
                              >
                                <Form.Item
                                  label={
                                    <Text strong>
                                      {field.label}
                                      {field.required && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
                                    </Text>
                                  }
                                >
                                  {renderCategorySpecificField(field, index)}
                                </Form.Item>
                              </Col>
                            ))}
                          </Row>
                        </>
                      )}

                      {/* Images */}
                      <Divider />
                      <Title level={4} style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
                        <FiUpload style={{ marginRight: 8 }} />
                        Images (optional)
                      </Title>
                      
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <Form.Item>
                            <Upload
                              {...uploadProps}
                              listType="picture-card"
                              className="enhanced-uploader"
                            >
                              {uploadedImages.length < 5 && (
                                <div style={{ textAlign: 'center' }}>
                                  <FiUpload style={{ fontSize: 24, marginBottom: 8 }} />
                                  <div>Upload Image</div>
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
                                            color="blue"
                                            style={{
                                              position: 'absolute',
                                              top: 4,
                                              left: 4,
                                              fontSize: 10,
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
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Tags */}
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <Form.Item
                            name="tags"
                            label={<Text strong>Tags (optional)</Text>}
                          >
                            <Select
                              mode="tags"
                              size="large"
                              placeholder="Add tags to help people find your cause"
                              style={{ borderRadius: 8 }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Submit Button */}
                      <Row>
                        <Col span={24}>
                          <div style={{ textAlign: 'center', marginTop: 32 }}>
                            <Button
                              type="primary"
                              htmlType="submit"
                              size="large"
                              loading={loading}
                              style={{
                                height: 56,
                                padding: '0 48px',
                                fontSize: 16,
                                borderRadius: 28,
                                fontWeight: 600,
                                boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)',
                              }}
                            >
                              Create Cause
                            </Button>
                            
                            <div style={{ marginTop: 16 }}>
                              <Text style={{ fontSize: 14, color: '#5f6368' }}>
                                Your cause will be published immediately and visible to the community
                              </Text>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Form>
      </div>
      
      <style jsx global>{`
        .enhanced-uploader .ant-upload-select-picture-card {
          border: 2px dashed #e8eaed !important;
          border-radius: 12px !important;
          background-color: #fafbfc !important;
          transition: all 0.3s !important;
        }
        
        .enhanced-uploader .ant-upload-select-picture-card:hover {
          border-color: #1890ff !important;
          background-color: #f0f8ff !important;
        }
        
        .ant-select-dropdown {
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
        }
        
        .ant-input:focus,
        .ant-input-focused {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
        
        .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: #1890ff !important;
        }
        
        .ant-select-focused .ant-select-selector {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }

        .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #1a1a1a !important;
        }
      `}</style>
      </div>
    </MainLayout>
  );
}