"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Upload,
  DatePicker,
  InputNumber,
  Typography,
  Row,
  Col,
  Steps,
  message,
  Divider,
  Checkbox,
  Switch,
  Tag,
  Space,
  Progress,
  Alert,
  Tooltip,
  Radio,
  TimePicker,
} from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  TeamOutlined,
  BookOutlined,
  CameraOutlined,
  FileTextOutlined,
  RightOutlined,
  LeftOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  MailOutlined,
  GlobalOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { MainLayout } from "@/components/layout/MainLayout";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface CauseFormData {
  // Basic Info
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  location: string;
  contactEmail: string;
  contactPhone?: string;
  contactPerson?: string;
  
  // Food specific
  foodType?: string;
  cuisineType?: string;
  quantity?: number;
  unit?: string;
  servingSize?: number;
  dietaryRestrictions?: string[];
  allergens?: string[];
  expirationDate?: string;
  preparationDate?: string;
  storageRequirements?: string;
  temperatureRequirements?: string;
  pickupInstructions?: string;
  deliveryAvailable?: boolean;
  deliveryRadius?: number;
  isUrgent?: boolean;
  nutritionalInfo?: string;
  ingredients?: string;
  packagingDetails?: string;
  halal?: boolean;
  kosher?: boolean;
  organic?: boolean;

  // Clothes specific
  clothesType?: string;
  clothesCategory?: string;
  ageGroup?: string;
  sizeRange?: string[];
  condition?: string;
  season?: string;
  colors?: string[];
  brands?: string[];
  materialComposition?: string;
  careInstructions?: string;
  specialRequirements?: string;
  isCleaned?: boolean;
  donationReceipt?: boolean;

  // Education specific
  educationType?: string;
  skillLevel?: string;
  topics?: string[];
  maxTrainees?: number;
  durationHours?: number;
  numberOfDays?: number;
  prerequisites?: string;
  learningObjectives?: string[];
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  schedule?: any;
  deliveryMethod?: string;
  locationDetails?: string;
  meetingPlatform?: string;
  meetingLink?: string;
  instructorName?: string;
  instructorEmail?: string;
  instructorBio?: string;
  instructorQualifications?: string;
  certification?: boolean;
  certificationBody?: string;
  materialsProvided?: string[];
  equipmentRequired?: string[];
  softwareRequired?: string[];
  price?: number;
  isFree?: boolean;
  courseLanguage?: string;
  subtitlesAvailable?: string[];
  difficultyRating?: number;

  // Common
  images?: any[];
  availabilityHours?: string;
  specialInstructions?: string;
  priority?: string;
  tags?: string[];
  terms: boolean;
  updates: boolean;
}

const categories = [
  {
    value: "food",
    label: "Food Assistance",
    description: "Share meals and food supplies with those in need",
    icon: "🍽️",
    color: "#FF6B35",
  },
  {
    value: "clothes",
    label: "Clothing Donation", 
    description: "Donate and request clothing items for all ages",
    icon: "👕",
    color: "#4ECDC4",
  },
  {
    value: "education",
    label: "Education & Training",
    description: "Share knowledge through courses, workshops, and mentoring",
    icon: "🎓",
    color: "#45B7D1",
  },
];

export default function CreateCausePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CauseFormData>>({});
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, status, router]);

  const getStepsForCategory = () => {
    if (!selectedCategory || !showCategoryForm) {
      return [
        {
          title: "Category",
          description: "Choose your cause type",
          icon: <BookOutlined />,
        },
      ];
    }

    const baseSteps = [
      {
        title: "Category",
        description: "Choose your cause type",
        icon: <BookOutlined />,
      },
      {
        title: "Basic Info",
        description: "Tell us about your cause",
        icon: <InfoCircleOutlined />,
      },
    ];

    if (selectedCategory === "food") {
      return [
        ...baseSteps,
        {
          title: "Food Details",
          description: "Food-specific information",
          icon: <FileTextOutlined />,
        },
        {
          title: "Contact & Media",
          description: "Contact info and images",
          icon: <CameraOutlined />,
        },
        {
          title: "Review",
          description: "Final review",
          icon: <CheckCircleOutlined />,
        },
      ];
    } else if (selectedCategory === "clothes") {
      return [
        ...baseSteps,
        {
          title: "Clothing Details",
          description: "Clothing-specific information",
          icon: <FileTextOutlined />,
        },
        {
          title: "Contact & Media",
          description: "Contact info and images",
          icon: <CameraOutlined />,
        },
        {
          title: "Review",
          description: "Final review",
          icon: <CheckCircleOutlined />,
        },
      ];
    } else if (selectedCategory === "education") {
      return [
        ...baseSteps,
        {
          title: "Education Details",
          description: "Course and training information",
          icon: <FileTextOutlined />,
        },
        {
          title: "Schedule & Delivery",
          description: "Dates and delivery method",
          icon: <CalendarOutlined />,
        },
        {
          title: "Contact & Media",
          description: "Contact info and images",
          icon: <CameraOutlined />,
        },
        {
          title: "Review",
          description: "Final review",
          icon: <CheckCircleOutlined />,
        },
      ];
    }

    return baseSteps;
  };

  const steps = getStepsForCategory();

  const nextStep = async () => {
    try {
      if (currentStep === 0 && !showCategoryForm) {
        // Category selection step
        if (!selectedCategory) {
          message.error("Please select a category first");
          return;
        }
        setShowCategoryForm(true);
        setCurrentStep(1);
        return;
      }
      
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Auto-advance after category selection
    setTimeout(() => {
      setShowCategoryForm(true);
      setCurrentStep(1);
    }, 300);
  };

  const prevStep = () => {
    if (currentStep === 1 && showCategoryForm) {
      // Go back to category selection
      setShowCategoryForm(false);
      setCurrentStep(0);
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: CauseFormData) => {
    setLoading(true);
    try {
      // Add category to form data
      const submitData = { ...formData, ...values, category: selectedCategory };
      
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      message.success("Your cause has been created successfully!");
      router.push("/causes");
    } catch (error) {
      message.error("Failed to create cause. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    action: "/api/upload", // Mock endpoint
    beforeUpload: () => false, // Prevent auto upload
    accept: "image/*",
    onChange(info: any) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    },
  };

  const renderStepContent = () => {
    // Category Selection Step
    if (currentStep === 0 && !showCategoryForm) {
      return (
        <div className="modern-category-selection">
          <div className="selection-header">
            <BookOutlined className="header-icon" />
            <Title level={2}>What type of cause would you like to create?</Title>
            <Paragraph className="header-subtitle">
              Choose the category that best fits your cause to get a customized form
            </Paragraph>
          </div>

          <Row gutter={[24, 24]} justify="center">
            {categories.map((category) => (
              <Col xs={24} sm={12} lg={8} key={category.value}>
                <Card
                  hoverable
                  className={`modern-category-card ${
                    selectedCategory === category.value ? "selected" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.value)}
                >
                  <div className="category-content">
                    <div className="category-icon" style={{ color: category.color }}>
                      {category.icon}
                    </div>
                    <Title level={3} className="category-title">
                      {category.label}
                    </Title>
                    <Paragraph className="category-description">
                      {category.description}
                    </Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="modern-form-step">
            <div className="step-header">
              <InfoCircleOutlined className="step-icon" />
              <Title level={3}>Basic Information</Title>
              <Paragraph>Tell us about your {categories.find(c => c.value === selectedCategory)?.label.toLowerCase()}</Paragraph>
            </div>

            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: "Please enter a title" },
                { min: 10, message: "Title should be at least 10 characters" },
                { max: 255, message: "Title should not exceed 255 characters" },
              ]}
            >
              <Input
                size="large"
                placeholder="e.g., Fresh Meals for Homeless Shelter"
                showCount
                maxLength={255}
              />
            </Form.Item>

            <Form.Item
              name="shortDescription"
              label="Short Description"
              rules={[
                { required: true, message: "Please enter a short description" },
                { max: 500, message: "Description should not exceed 500 characters" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="A brief summary that will appear in listings"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Detailed Description"
              rules={[
                { required: true, message: "Please provide a detailed description" },
                { min: 50, message: "Description should be at least 50 characters" },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Provide detailed information about your cause..."
                showCount
              />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please enter the location" }]}
            >
              <Input
                size="large"
                prefix={<EnvironmentOutlined />}
                placeholder="City, State or specific address"
              />
            </Form.Item>

            <Form.Item
              name="priority"
              label="Priority Level"
              rules={[{ required: true, message: "Please select priority level" }]}
            >
              <Radio.Group size="large">
                <Radio.Button value="low">Low</Radio.Button>
                <Radio.Button value="medium">Medium</Radio.Button>
                <Radio.Button value="high">High</Radio.Button>
                <Radio.Button value="critical">Critical</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
        );

      case 2:
        if (selectedCategory === "food") {
          return (
            <div className="modern-form-step">
              <div className="step-header">
                <FileTextOutlined className="step-icon" />
                <Title level={3}>Food Details</Title>
                <Paragraph>Provide specific information about the food</Paragraph>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="foodType"
                    label="Food Type"
                    rules={[{ required: true, message: "Please select food type" }]}
                  >
                    <Select size="large" placeholder="Select food type">
                      <Option value="fresh-produce">Fresh Produce</Option>
                      <Option value="cooked-meals">Cooked Meals</Option>
                      <Option value="packaged-food">Packaged Food</Option>
                      <Option value="beverages">Beverages</Option>
                      <Option value="dairy">Dairy Products</Option>
                      <Option value="meat-seafood">Meat & Seafood</Option>
                      <Option value="baked-goods">Baked Goods</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="cuisineType" label="Cuisine Type">
                    <Input size="large" placeholder="e.g., Italian, Indian, Mexican" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: "Please enter quantity" }]}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      min={1}
                      placeholder="Number"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="unit"
                    label="Unit"
                    initialValue="servings"
                    rules={[{ required: true, message: "Please select unit" }]}
                  >
                    <Select size="large">
                      <Option value="servings">Servings</Option>
                      <Option value="kg">Kilograms</Option>
                      <Option value="lbs">Pounds</Option>
                      <Option value="pieces">Pieces</Option>
                      <Option value="boxes">Boxes</Option>
                      <Option value="bags">Bags</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="servingSize" label="Serving Size (people)">
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      min={1}
                      placeholder="e.g., 50"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item name="expirationDate" label="Expiration Date">
                    <DatePicker
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Select expiry date"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="temperatureRequirements" label="Storage Temperature" initialValue="room-temp">
                    <Select size="large">
                      <Option value="frozen">Frozen</Option>
                      <Option value="refrigerated">Refrigerated</Option>
                      <Option value="room-temp">Room Temperature</Option>
                      <Option value="hot">Hot/Warm</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="dietaryRestrictions" label="Dietary Restrictions">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select any dietary restrictions"
                  style={{ width: "100%" }}
                >
                  <Option value="vegetarian">Vegetarian</Option>
                  <Option value="vegan">Vegan</Option>
                  <Option value="gluten-free">Gluten Free</Option>
                  <Option value="nut-free">Nut Free</Option>
                  <Option value="dairy-free">Dairy Free</Option>
                  <Option value="low-sodium">Low Sodium</Option>
                  <Option value="diabetic-friendly">Diabetic Friendly</Option>
                </Select>
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item name="halal" valuePropName="checked">
                    <Checkbox>Halal Certified</Checkbox>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="kosher" valuePropName="checked">
                    <Checkbox>Kosher Certified</Checkbox>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="organic" valuePropName="checked">
                    <Checkbox>Organic</Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="ingredients" label="Ingredients">
                <TextArea
                  rows={3}
                  placeholder="List main ingredients..."
                />
              </Form.Item>

              <Form.Item name="pickupInstructions" label="Pickup Instructions">
                <TextArea
                  rows={3}
                  placeholder="Special instructions for pickup..."
                />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item name="deliveryAvailable" valuePropName="checked">
                    <Checkbox>Delivery Available</Checkbox>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="isUrgent" valuePropName="checked">
                    <Checkbox>Urgent Pickup Required</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          );
        } else if (selectedCategory === "clothes") {
          return (
            <div className="modern-form-step">
              <div className="step-header">
                <FileTextOutlined className="step-icon" />
                <Title level={3}>Clothing Details</Title>
                <Paragraph>Provide specific information about the clothing items</Paragraph>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="clothesType"
                    label="Clothing Type"
                    rules={[{ required: true, message: "Please select clothing type" }]}
                  >
                    <Select size="large" placeholder="Select clothing type">
                      <Option value="donation">Donation (Giving Away)</Option>
                      <Option value="request">Request (Need Items)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="clothesCategory"
                    label="Category"
                    rules={[{ required: true, message: "Please select category" }]}
                  >
                    <Select size="large" placeholder="Select category">
                      <Option value="tops">Tops & Shirts</Option>
                      <Option value="bottoms">Bottoms & Pants</Option>
                      <Option value="dresses">Dresses & Skirts</Option>
                      <Option value="outerwear">Outerwear & Jackets</Option>
                      <Option value="shoes">Shoes & Footwear</Option>
                      <Option value="accessories">Accessories</Option>
                      <Option value="undergarments">Undergarments</Option>
                      <Option value="formal">Formal Wear</Option>
                      <Option value="sleepwear">Sleepwear</Option>
                      <Option value="sportswear">Sportswear</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="ageGroup"
                    label="Age Group"
                    initialValue="adult"
                    rules={[{ required: true, message: "Please select age group" }]}
                  >
                    <Select size="large">
                      <Option value="newborn">Newborn (0-3 months)</Option>
                      <Option value="infant">Infant (3-12 months)</Option>
                      <Option value="toddler">Toddler (1-3 years)</Option>
                      <Option value="child">Child (4-12 years)</Option>
                      <Option value="teen">Teen (13-17 years)</Option>
                      <Option value="adult">Adult (18+ years)</Option>
                      <Option value="senior">Senior (65+ years)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="condition"
                    label="Condition"
                    rules={[{ required: true, message: "Please select condition" }]}
                  >
                    <Select size="large">
                      <Option value="new">New with Tags</Option>
                      <Option value="excellent">Excellent</Option>
                      <Option value="good">Good</Option>
                      <Option value="fair">Fair</Option>
                      <Option value="worn">Well Worn</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="season"
                    label="Season"
                    initialValue="all-season"
                    rules={[{ required: true, message: "Please select season" }]}
                  >
                    <Select size="large">
                      <Option value="spring">Spring</Option>
                      <Option value="summer">Summer</Option>
                      <Option value="fall">Fall</Option>
                      <Option value="winter">Winter</Option>
                      <Option value="all-season">All Season</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="sizeRange"
                label="Size Range"
                rules={[{ required: true, message: "Please select sizes" }]}
              >
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select sizes available"
                  style={{ width: "100%" }}
                >
                  <Option value="xs">XS</Option>
                  <Option value="s">S</Option>
                  <Option value="m">M</Option>
                  <Option value="l">L</Option>
                  <Option value="xl">XL</Option>
                  <Option value="xxl">XXL</Option>
                  <Option value="xxxl">XXXL</Option>
                  <Option value="0-3m">0-3 months</Option>
                  <Option value="3-6m">3-6 months</Option>
                  <Option value="6-12m">6-12 months</Option>
                  <Option value="12-18m">12-18 months</Option>
                  <Option value="18-24m">18-24 months</Option>
                  <Option value="2t">2T</Option>
                  <Option value="3t">3T</Option>
                  <Option value="4t">4T</Option>
                  <Option value="5t">5T</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "Please enter quantity" }]}
              >
                <InputNumber
                  size="large"
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="Number of items"
                />
              </Form.Item>

              <Form.Item name="colors" label="Colors Available">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select colors"
                  style={{ width: "100%" }}
                >
                  <Option value="black">Black</Option>
                  <Option value="white">White</Option>
                  <Option value="gray">Gray</Option>
                  <Option value="blue">Blue</Option>
                  <Option value="red">Red</Option>
                  <Option value="green">Green</Option>
                  <Option value="yellow">Yellow</Option>
                  <Option value="purple">Purple</Option>
                  <Option value="pink">Pink</Option>
                  <Option value="brown">Brown</Option>
                  <Option value="navy">Navy</Option>
                  <Option value="beige">Beige</Option>
                </Select>
              </Form.Item>

              <Form.Item name="materialComposition" label="Material Composition">
                <Input
                  size="large"
                  placeholder="e.g., 100% Cotton, 80% Cotton 20% Polyester"
                />
              </Form.Item>

              <Form.Item name="careInstructions" label="Care Instructions">
                <TextArea
                  rows={2}
                  placeholder="Washing and care instructions..."
                />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item name="isCleaned" valuePropName="checked">
                    <Checkbox>Items are cleaned</Checkbox>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="deliveryAvailable" valuePropName="checked">
                    <Checkbox>Delivery Available</Checkbox>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="donationReceipt" valuePropName="checked">
                    <Checkbox>Donation Receipt Available</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          );
        } else if (selectedCategory === "education") {
          return (
            <div className="modern-form-step">
              <div className="step-header">
                <FileTextOutlined className="step-icon" />
                <Title level={3}>Education Details</Title>
                <Paragraph>Provide information about your course or training</Paragraph>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="educationType"
                    label="Education Type"
                    rules={[{ required: true, message: "Please select education type" }]}
                  >
                    <Select size="large" placeholder="Select type">
                      <Option value="course">Online Course</Option>
                      <Option value="workshop">Workshop</Option>
                      <Option value="seminar">Seminar</Option>
                      <Option value="bootcamp">Bootcamp</Option>
                      <Option value="mentoring">1-on-1 Mentoring</Option>
                      <Option value="certification">Certification Program</Option>
                      <Option value="tutoring">Tutoring</Option>
                      <Option value="webinar">Webinar</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="skillLevel"
                    label="Skill Level"
                    initialValue="all-levels"
                    rules={[{ required: true, message: "Please select skill level" }]}
                  >
                    <Select size="large">
                      <Option value="beginner">Beginner</Option>
                      <Option value="intermediate">Intermediate</Option>
                      <Option value="advanced">Advanced</Option>
                      <Option value="all-levels">All Levels</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="topics"
                label="Topics Covered"
                rules={[{ required: true, message: "Please select topics" }]}
              >
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select topics covered"
                  style={{ width: "100%" }}
                >
                  <Option value="programming">Programming</Option>
                  <Option value="web-development">Web Development</Option>
                  <Option value="data-science">Data Science</Option>
                  <Option value="design">Design</Option>
                  <Option value="marketing">Marketing</Option>
                  <Option value="business">Business</Option>
                  <Option value="language">Language Learning</Option>
                  <Option value="mathematics">Mathematics</Option>
                  <Option value="science">Science</Option>
                  <Option value="arts">Arts & Crafts</Option>
                  <Option value="music">Music</Option>
                  <Option value="cooking">Cooking</Option>
                  <Option value="photography">Photography</Option>
                  <Option value="writing">Writing</Option>
                  <Option value="fitness">Fitness & Health</Option>
                </Select>
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="maxTrainees"
                    label="Max Participants"
                    rules={[{ required: true, message: "Please enter max participants" }]}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      min={1}
                      max={1000}
                      placeholder="e.g., 20"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="durationHours"
                    label="Duration (Hours)"
                    rules={[{ required: true, message: "Please enter duration" }]}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      min={1}
                      placeholder="Total hours"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="numberOfDays"
                    label="Number of Days"
                    rules={[{ required: true, message: "Please enter number of days" }]}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      min={1}
                      placeholder="e.g., 5"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="instructorName"
                label="Instructor Name"
                rules={[{ required: true, message: "Please enter instructor name" }]}
              >
                <Input
                  size="large"
                  placeholder="Name of the instructor"
                />
              </Form.Item>

              <Form.Item name="instructorBio" label="Instructor Bio">
                <TextArea
                  rows={3}
                  placeholder="Brief bio about the instructor's background and experience..."
                />
              </Form.Item>

              <Form.Item name="learningObjectives" label="Learning Objectives">
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Enter learning objectives (press Enter to add)"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item name="prerequisites" label="Prerequisites">
                <TextArea
                  rows={2}
                  placeholder="Any prerequisites or requirements for participants..."
                />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="price"
                    label="Price ($)"
                    initialValue={0}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      min={0}
                      placeholder="0 for free"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="isFree" valuePropName="checked" initialValue={true}>
                    <Checkbox>This is a free course</Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item name="certification" valuePropName="checked">
                    <Checkbox>Certificate provided upon completion</Checkbox>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="courseLanguage"
                    label="Course Language"
                    initialValue="English"
                  >
                    <Select size="large">
                      <Option value="English">English</Option>
                      <Option value="Spanish">Spanish</Option>
                      <Option value="French">French</Option>
                      <Option value="German">German</Option>
                      <Option value="Arabic">Arabic</Option>
                      <Option value="Chinese">Chinese</Option>
                      <Option value="Hindi">Hindi</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          );
        }
        return null;

      case 3:
        if (selectedCategory === "education") {
          return (
            <div className="modern-form-step">
              <div className="step-header">
                <CalendarOutlined className="step-icon" />
                <Title level={3}>Schedule & Delivery</Title>
                <Paragraph>Set up the course schedule and delivery method</Paragraph>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="startDate"
                    label="Start Date"
                    rules={[{ required: true, message: "Please select start date" }]}
                  >
                    <DatePicker
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Select start date"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="endDate"
                    label="End Date"
                    rules={[{ required: true, message: "Please select end date" }]}
                  >
                    <DatePicker
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Select end date"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="registrationDeadline" label="Registration Deadline">
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="Last day for registration"
                />
              </Form.Item>

              <Form.Item
                name="deliveryMethod"
                label="Delivery Method"
                rules={[{ required: true, message: "Please select delivery method" }]}
              >
                <Radio.Group size="large">
                  <Radio.Button value="online">Online</Radio.Button>
                  <Radio.Button value="in-person">In-Person</Radio.Button>
                  <Radio.Button value="hybrid">Hybrid</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="locationDetails" label="Location Details">
                <TextArea
                  rows={2}
                  placeholder="For in-person: provide address. For online: meeting details will be shared separately."
                />
              </Form.Item>

              <Form.Item name="meetingPlatform" label="Meeting Platform (for online)">
                <Select size="large" placeholder="Select platform">
                  <Option value="zoom">Zoom</Option>
                  <Option value="teams">Microsoft Teams</Option>
                  <Option value="meet">Google Meet</Option>
                  <Option value="webex">Cisco Webex</Option>
                  <Option value="discord">Discord</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item name="materialsProvided" label="Materials Provided">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select materials included"
                  style={{ width: "100%" }}
                >
                  <Option value="slides">Presentation Slides</Option>
                  <Option value="notes">Course Notes</Option>
                  <Option value="worksheets">Worksheets</Option>
                  <Option value="recordings">Session Recordings</Option>
                  <Option value="resources">Additional Resources</Option>
                  <Option value="assignments">Practice Assignments</Option>
                  <Option value="software">Software/Tools Access</Option>
                </Select>
              </Form.Item>

              <Form.Item name="equipmentRequired" label="Equipment Required">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="What participants need"
                  style={{ width: "100%" }}
                >
                  <Option value="computer">Computer/Laptop</Option>
                  <Option value="webcam">Webcam</Option>
                  <Option value="microphone">Microphone</Option>
                  <Option value="internet">Stable Internet</Option>
                  <Option value="smartphone">Smartphone</Option>
                  <Option value="notebook">Notebook & Pen</Option>
                  <Option value="calculator">Calculator</Option>
                </Select>
              </Form.Item>
            </div>
          );
        }
        // Fall through to Contact & Media for other categories
      case 4:
        if (selectedCategory === "education" && currentStep === 4) {
          // Contact & Media for education
        } else if (currentStep === 3) {
          // Contact & Media for food and clothes
        }
        return (
          <div className="modern-form-step">
            <div className="step-header">
              <CameraOutlined className="step-icon" />
              <Title level={3}>Contact & Media</Title>
              <Paragraph>Add contact information and images</Paragraph>
            </div>

            <Form.Item
              name="images"
              label="Images"
              help="Upload images that showcase your cause. First image will be the main photo."
            >
              <Dragger {...uploadProps} className="modern-upload">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag images to upload
                </p>
                <p className="ant-upload-hint">
                  Support JPG, PNG. Max file size 5MB each.
                </p>
              </Dragger>
            </Form.Item>

            <Divider />

            <Title level={4}>Contact Information</Title>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="contactEmail"
                  label="Contact Email"
                  rules={[
                    { required: true, message: "Please enter contact email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                  initialValue={session?.user?.email}
                >
                  <Input size="large" prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="contactPhone" label="Contact Phone">
                  <Input size="large" prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="contactPerson" label="Contact Person">
              <Input
                size="large"
                placeholder="Name of primary contact person"
              />
            </Form.Item>

            <Form.Item name="availabilityHours" label="Availability Hours">
              <Input
                size="large"
                placeholder="e.g., Mon-Fri 9AM-5PM, Weekends by appointment"
              />
            </Form.Item>

            <Form.Item name="specialInstructions" label="Special Instructions">
              <TextArea
                rows={3}
                placeholder="Any special instructions for coordination, pickup, delivery, etc."
              />
            </Form.Item>
          </div>
        );

      case 5:
      case 6:
        // Review step - adjust case number based on category
        const isReviewStep = (selectedCategory === "education" && currentStep === 5) ||
                            (selectedCategory !== "education" && currentStep === 4);
        
        if (!isReviewStep) return null;

        return (
          <div className="modern-form-step">
            <div className="step-header">
              <CheckCircleOutlined className="step-icon" />
              <Title level={3}>Review Your Cause</Title>
              <Paragraph>Please review all information before publishing</Paragraph>
            </div>

            <Card title="Basic Information" className="review-card">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Category:</Text>
                  <div>{categories.find(c => c.value === selectedCategory)?.label}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Title:</Text>
                  <div>{formData.title}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Location:</Text>
                  <div>{formData.location}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Priority:</Text>
                  <div className="capitalize">{formData.priority}</div>
                </Col>
                <Col span={24}>
                  <Text strong>Description:</Text>
                  <div>{formData.shortDescription}</div>
                </Col>
              </Row>
            </Card>

            {selectedCategory === "food" && (
              <Card title="Food Details" className="review-card">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Food Type:</Text>
                    <div className="capitalize">{formData.foodType}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Quantity:</Text>
                    <div>{formData.quantity} {formData.unit}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Temperature:</Text>
                    <div className="capitalize">{formData.temperatureRequirements}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Dietary Restrictions:</Text>
                    <div>{formData.dietaryRestrictions?.join(", ") || "None"}</div>
                  </Col>
                </Row>
              </Card>
            )}

            {selectedCategory === "clothes" && (
              <Card title="Clothing Details" className="review-card">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Type:</Text>
                    <div className="capitalize">{formData.clothesType}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Category:</Text>
                    <div className="capitalize">{formData.clothesCategory}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Age Group:</Text>
                    <div className="capitalize">{formData.ageGroup}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Sizes:</Text>
                    <div>{formData.sizeRange?.join(", ")}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Condition:</Text>
                    <div className="capitalize">{formData.condition}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Quantity:</Text>
                    <div>{formData.quantity} items</div>
                  </Col>
                </Row>
              </Card>
            )}

            {selectedCategory === "education" && (
              <Card title="Education Details" className="review-card">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Type:</Text>
                    <div className="capitalize">{formData.educationType}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Skill Level:</Text>
                    <div className="capitalize">{formData.skillLevel}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Duration:</Text>
                    <div>{formData.durationHours} hours over {formData.numberOfDays} days</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Max Participants:</Text>
                    <div>{formData.maxTrainees}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Instructor:</Text>
                    <div>{formData.instructorName}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Price:</Text>
                    <div>{formData.isFree ? "Free" : `$${formData.price}`}</div>
                  </Col>
                </Row>
              </Card>
            )}

            <Card title="Legal & Preferences" className="review-card">
              <div className="terms-section">
                <Form.Item
                  name="terms"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("You must agree to the terms"),
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    I agree to the{" "}
                    <a href="/terms" target="_blank" className="text-blue-600">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      className="text-blue-600"
                    >
                      Privacy Policy
                    </a>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="updates"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Checkbox>
                    Send me updates about my cause and tips for success
                  </Checkbox>
                </Form.Item>
              </div>
            </Card>

            <Alert
              message="Review Complete"
              description="Once you publish your cause, it will be reviewed by our team and go live within 24 hours."
              type="info"
              showIcon
              className="review-alert"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (status === "loading") {
    return (
      <MainLayout>
        <div className="modern-loading-page">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <Text>Loading...</Text>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="modern-home-page">
        {/* Hero Section */}
        <section className="modern-hero">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-text"
            >
              <Title level={1} className="modern-hero-title">
                Create a New 
                <span className="title-highlight"> Cause</span>
              </Title>
              
              <Paragraph className="modern-hero-subtitle">
                Share your passion and create positive change in your community.
                Every great movement starts with a single step.
              </Paragraph>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="modern-content-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >

              {/* Progress Steps */}
              <Card className="modern-cause-card">
                <Steps
                  current={currentStep}
                  size="small"
                  className="modern-steps"
                  items={steps.map((step, index) => ({
                    title: step.title,
                    description: step.description,
                    icon: step.icon,
                  }))}
                />
                <Progress
                  percent={((currentStep + 1) / steps.length) * 100}
                  showInfo={false}
                  strokeColor="#52c41a"
                  className="modern-progress-bar"
                />
                <div className="progress-text">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </Card>

              {/* Form Content */}
              <Card className="modern-cause-card">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={formData}
                  size="large"
                >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="form-navigation">
                  <div>
                    {(currentStep > 0 || showCategoryForm) && (
                      <Button
                        size="large"
                        onClick={prevStep}
                        icon={<LeftOutlined />}
                        className="nav-btn secondary"
                      >
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="nav-right">
                    <Button
                      size="large"
                      onClick={() => router.push("/causes")}
                      className="nav-btn secondary"
                    >
                      Save as Draft
                    </Button>

                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="primary"
                        size="large"
                        onClick={nextStep}
                        className="nav-btn primary"
                      >
                        Next Step
                        <RightOutlined />
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        className="nav-btn primary"
                        icon={<CheckCircleOutlined />}
                      >
                        Publish Cause
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}