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
  Spin,
  Alert,
  Checkbox,
  DatePicker,
  InputNumber,
  TimePicker,
  Divider,
  Switch,
} from "antd";
import {
  UploadOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  LoadingOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  FiHeart,
  FiShirt,
  FiBook,
  FiInfo,
  FiUpload,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import GoogleMeetHeader from "@/components/layout/GoogleMeetHeader";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
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
  // Category-specific details
  food_details?: any;
  clothes_details?: any;
  training_details?: any;
}

const categories = [
  {
    value: "food",
    label: "Food Support",
    emoji: "🍽️",
    description: "Share meals and food supplies with those in need",
  },
  {
    value: "clothes",
    label: "Clothing",
    emoji: "👕",
    description: "Donate and request clothing items for all ages",
  },
  {
    value: "training",
    label: "Training",
    emoji: "📚",
    description: "Share knowledge through courses and workshops",
  },
];

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
  const [instructors, setInstructors] = useState<any[]>([
    { name: "", email: "", bio: "", qualifications: "" },
  ]);

  // Instructor Input Component
  const InstructorInput = ({ value, onChange }) => {
    const handleInstructorChange = (index, field, val) => {
      const newInstructors = [...instructors];
      newInstructors[index] = { ...newInstructors[index], [field]: val };
      setInstructors(newInstructors);
      onChange?.(newInstructors);
    };

    const addInstructor = () => {
      const newInstructors = [...instructors, { name: "", email: "", bio: "", qualifications: "" }];
      setInstructors(newInstructors);
      onChange?.(newInstructors);
    };

    const removeInstructor = (index) => {
      if (instructors.length > 1) {
        const newInstructors = instructors.filter((_, i) => i !== index);
        setInstructors(newInstructors);
        onChange?.(newInstructors);
      }
    };

    return (
      <div>
        {instructors.map((instructor, index) => (
          <Card key={index} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Input
                  placeholder="Instructor Name"
                  value={instructor.name}
                  onChange={(e) => handleInstructorChange(index, 'name', e.target.value)}
                  style={{ marginBottom: 8 }}
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Email"
                  value={instructor.email}
                  onChange={(e) => handleInstructorChange(index, 'email', e.target.value)}
                  style={{ marginBottom: 8 }}
                />
              </Col>
              <Col span={24}>
                <TextArea
                  placeholder="Bio"
                  value={instructor.bio}
                  onChange={(e) => handleInstructorChange(index, 'bio', e.target.value)}
                  rows={2}
                  style={{ marginBottom: 8 }}
                />
              </Col>
              <Col span={20}>
                <Input
                  placeholder="Qualifications"
                  value={instructor.qualifications}
                  onChange={(e) => handleInstructorChange(index, 'qualifications', e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => removeInstructor(index)}
                  disabled={instructors.length === 1}
                />
              </Col>
            </Row>
          </Card>
        ))}
        <Button type="dashed" onClick={addInstructor} icon={<PlusOutlined />} block>
          Add Instructor
        </Button>
      </div>
    );
  };

  // Render Category Specific Field
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

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchCauseDetails();
  }, [params.id, session, status]);

  const fetchCauseDetails = async () => {
    try {
      const response = await fetch(`/api/causes/${params.id}`);
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
        router.push(`/causes/${params.id}`);
        return;
      }

      setCauseData(cause);
      setUploadedImages(cause.gallery || []);

      // Load category-specific details from API response
      const details = result.data.categoryDetails || {};
      setCategoryDetails(details);

      // For training, load instructors
      if (cause.category_name === "training" && details.instructor_name) {
        setInstructors([
          {
            name: details.instructor_name || "",
            email: details.instructor_email || "",
            bio: details.instructor_bio || "",
            qualifications: details.instructor_qualifications || "",
          },
        ]);
      }

      // Populate form
      form.setFieldsValue({
        title: cause.title,
        description: cause.description,
        location: cause.location,
        priority: cause.priority,
        contactEmail: cause.contact_email,
        contactPhone: cause.contact_phone,
        tags: cause.tags || [],
        specialInstructions: cause.special_instructions || "",
        // Category-specific fields will be populated separately
        ...details,
      });
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
          setUploadedImages((prev) => [...prev, result.data.url]);
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

    return false;
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmit = async () => {
    if (!causeData) return;

    setSaving(true);
    try {
      const values = await form.validateFields();

      // Prepare category-specific details
      let enhancedCategoryDetails = { ...categoryDetails };

      if (causeData.category_name === "training") {
        enhancedCategoryDetails = {
          ...enhancedCategoryDetails,
          instructors: instructors.filter((inst) => inst.name.trim()),
          prerequisites: categoryDetails.prerequisites || null,
          curriculum: categoryDetails.curriculum || null,
          startDate: categoryDetails.startDate
            ? dayjs(categoryDetails.startDate).format("YYYY-MM-DD")
            : null,
          endDate: categoryDetails.endDate
            ? dayjs(categoryDetails.endDate).format("YYYY-MM-DD")
            : null,
          registrationDeadline: categoryDetails.registrationDeadline
            ? dayjs(categoryDetails.registrationDeadline).format("YYYY-MM-DD")
            : null,
        };
      } else if (causeData.category_name === "food") {
        enhancedCategoryDetails = {
          ...enhancedCategoryDetails,
          expirationDate: categoryDetails.expirationDate
            ? dayjs(categoryDetails.expirationDate).format("YYYY-MM-DD")
            : null,
          preparationDate: categoryDetails.preparationDate
            ? dayjs(categoryDetails.preparationDate).format("YYYY-MM-DD")
            : null,
        };
      }

      const updateData = {
        title: values.title,
        description: values.description,
        category: causeData.category_name,
        causeType: causeData.cause_type,
        location: values.location,
        priority: values.priority,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        images: uploadedImages,
        tags: values.tags || [],
        special_instructions: values.specialInstructions,
        categoryDetails: enhancedCategoryDetails,
      };

      const response = await fetch(`/api/causes/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Cause updated successfully!");
        router.push(`/causes/${params.id}`);
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

  const addInstructor = () => {
    setInstructors([
      ...instructors,
      { name: "", email: "", bio: "", qualifications: "" },
    ]);
  };

  const removeInstructor = (index: number) => {
    if (instructors.length > 1) {
      setInstructors(instructors.filter((_, i) => i !== index));
    }
  };

  const updateInstructor = (index: number, field: string, value: string) => {
    const updated = [...instructors];
    updated[index] = { ...updated[index], [field]: value };
    setInstructors(updated);
  };

  const renderCategorySpecificFields = () => {
    if (!causeData) return null;

    const category = causeData.category_name;
    const config = categoryFieldConfigs[category];

    if (!config) return null;

    return (
      <>
        <Divider />
        <Title level={4} style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
          {config.icon}
          <span style={{ marginLeft: 8 }}>
            {category.charAt(0).toUpperCase() + category.slice(1)} Details
          </span>
        </Title>
        
        <Row gutter={[16, 16]}>
          {config.fields.map((field, index) => (
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
    );
  };

  const selectedCategory = categories.find(
    (c) => c.value === causeData?.category_name,
  );

  return (
    <MainLayout>
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>
          {/* Breadcrumb */}
          <Breadcrumb
            style={{ marginBottom: 24 }}
            items={[
              { title: "Causes" },
              { title: causeData?.title, href: `/causes/${causeData?.id}` },
              { title: "Edit" },
            ]}
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                <Text>Loading cause details...</Text>
              </div>
            </div>
          ) : !causeData ? (
            <Alert
              message="Cause not found"
              description="The cause you're trying to edit doesn't exist or you don't have permission to edit it."
              type="error"
              showIcon
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <Card style={{ marginBottom: 24, borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                      {selectedCategory?.emoji} Edit {selectedCategory?.label}
                    </Title>
                    <Text type="secondary">
                      Update your cause details and category-specific information
                    </Text>
                  </div>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                    size="large"
                  >
                    Back
                  </Button>
                </div>
              </Card>

              {/* Edit Form */}
              <Card style={{ borderRadius: 12 }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  style={{ width: '100%' }}
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
                        rules={[{ required: true, message: 'Please enter a title' }]}
                      >
                        <Input size="large" placeholder="Enter cause title..." />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label={<Text strong>Description</Text>}
                        rules={[{ required: true, message: 'Please enter a description' }]}
                      >
                        <MarkdownEditor
                          value={form.getFieldValue('description')}
                          onChange={(value) => form.setFieldValue('description', value)}
                          placeholder="Describe your cause in detail..."
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
                        <Input size="large" prefix={<EnvironmentOutlined />} placeholder="City, State" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="priority"
                        label={<Text strong>Priority</Text>}
                        rules={[{ required: true, message: 'Please select priority' }]}
                      >
                        <Select size="large" placeholder="Select priority">
                          <Option value="low">Low</Option>
                          <Option value="medium">Medium</Option>
                          <Option value="high">High</Option>
                          <Option value="urgent">Urgent</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="contactEmail"
                        label={<Text strong>Contact Email</Text>}
                        rules={[
                          { required: true, message: 'Please enter contact email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input size="large" placeholder="contact@example.com" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="contactPhone"
                        label={<Text strong>Contact Phone</Text>}
                      >
                        <Input size="large" placeholder="+1 (555) 123-4567" />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Category-Specific Fields */}
                  {renderCategorySpecificFields()}

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
                          listType="picture-card"
                          beforeUpload={handleImageUpload}
                          showUploadList={false}
                          accept="image/*"
                        >
                          {uploadedImages.length < 5 && (
                            <div style={{ textAlign: 'center' }}>
                              <UploadOutlined style={{ fontSize: 24, marginBottom: 8 }} />
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
                                          margin: 0,
                                          fontSize: 10
                                        }}
                                      >
                                        Primary
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
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Additional Information */}
                  <Divider />
                  <Title level={4} style={{ marginBottom: 20 }}>
                    Additional Information
                  </Title>
                  
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Form.Item
                        name="specialInstructions"
                        label={<Text strong>Special Instructions</Text>}
                      >
                        <TextArea
                          rows={4}
                          placeholder="Any special instructions or notes..."
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Form.Item
                        name="tags"
                        label={<Text strong>Tags</Text>}
                      >
                        <Select
                          mode="tags"
                          style={{ width: '100%' }}
                          placeholder="Add tags to help others find your cause"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Action Buttons */}
                  <div style={{ textAlign: 'right', marginTop: 32, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
                    <Space>
                      <Button 
                        size="large" 
                        onClick={() => router.back()}
                        style={{ minWidth: 100 }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="primary" 
                        size="large"
                        htmlType="submit"
                        loading={saving}
                        icon={<SaveOutlined />}
                        style={{ minWidth: 120 }}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Space>
                  </div>
                </Form>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
