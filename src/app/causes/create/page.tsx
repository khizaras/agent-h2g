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
  Tag,
  Space,
  Progress,
  Alert,
  Radio,
  TimePicker,
} from "antd";
import {
  InboxOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  BookOutlined,
  CameraOutlined,
  FileTextOutlined,
  RightOutlined,
  LeftOutlined,
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { MainLayout } from "@/components/layout/MainLayout";
import FoodDetailsForm from "@/components/forms/FoodDetailsForm";
import ClothesDetailsForm from "@/components/forms/ClothesDetailsForm";
import EducationDetailsForm from "@/components/forms/EducationDetailsForm";
import { useImageUpload } from "@/hooks/useImageUpload";

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

  // Enhanced education fields
  enhancedEducationFields?: {
    courseModules: Array<{
      title: string;
      description: string;
      duration: string;
      resources: string[];
      assessment: string;
    }>;
    instructors: Array<{
      name: string;
      email: string;
      phone?: string;
      bio?: string;
      qualifications?: string[];
      avatar?: string;
    }>;
    enhancedPrerequisites: Array<{
      title: string;
      description: string;
      resources: string[];
    }>;
  };

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
    icon: <HeartOutlined style={{ fontSize: "48px" }} />,
    color: "#FF6B35",
  },
  {
    value: "clothes",
    label: "Clothing Donation",
    description: "Donate and request clothing items for all ages",
    icon: <TeamOutlined style={{ fontSize: "48px" }} />,
    color: "#4ECDC4",
  },
  {
    value: "education",
    label: "Education & Training",
    description: "Share knowledge through courses, workshops, and mentoring",
    icon: <BookOutlined style={{ fontSize: "48px" }} />,
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
  const { uploading, uploadedImages, allImages, uploadImage, removeImage } =
    useImageUpload();

  // Enhanced education fields state
  const [enhancedEducationFields, setEnhancedEducationFields] = useState({
    courseModules: [],
    instructors: [],
    enhancedPrerequisites: [],
  });

  const handleEnhancedFieldsChange = (fields: any) => {
    setEnhancedEducationFields(fields);
  };

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Get all validated form values
      const values = await form.validateFields();

      console.log("Create form validated values:", values); // Debug log
      console.log("Current formData state:", formData); // Debug log
      console.log("Selected category:", selectedCategory); // Debug log

      const submitData = {
        ...formData,
        ...values,
        category: selectedCategory,
        images: uploadedImages,
      };

      // Add enhanced education fields if this is an education cause
      if (selectedCategory === "education") {
        submitData.enhancedEducationFields = enhancedEducationFields;
      }

      console.log("Final create payload:", submitData); // Debug log

      const response = await fetch("/api/causes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Your cause has been created successfully!");
        router.push(`/causes/${result.data.id}`);
      } else {
        throw new Error(result.error || "Failed to create cause");
      }
    } catch (error) {
      console.error("Error creating cause:", error);
      message.error("Failed to create cause. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file: any) => {
      const isValidType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp";
      if (!isValidType) {
        message.error("You can only upload JPG/PNG/WebP files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      if (allImages.length >= 5) {
        message.error("You can only upload up to 5 images!");
        return false;
      }
      // Upload immediately
      uploadImage(file);
      return false; // Prevent default upload
    },
    accept: "image/*",
    showUploadList: false, // We'll handle our own list
  };

  const renderStepContent = () => {
    // Category Selection Step
    if (currentStep === 0 && !showCategoryForm) {
      return (
        <div style={{ padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <BookOutlined
              style={{
                fontSize: "48px",
                color: "#52c41a",
                marginBottom: "16px",
              }}
            />
            <Title level={2} style={{ marginBottom: "8px" }}>
              What type of cause would you like to create?
            </Title>
            <Paragraph style={{ color: "#666", fontSize: "16px" }}>
              Choose the category that best fits your cause to get a customized
              form
            </Paragraph>
          </div>

          <Row gutter={[24, 24]} justify="center">
            {categories.map((category) => (
              <Col xs={24} sm={12} lg={8} key={category.value}>
                <Card
                  hoverable
                  className={`category-selection-card ${
                    selectedCategory === category.value ? "selected" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.value)}
                >
                  <div className="category-card-content">
                    <div
                      className="category-card-icon"
                      style={{ color: category.color }}
                    >
                      {category.icon}
                    </div>
                    <Title level={3} className="category-card-title">
                      {category.label}
                    </Title>
                    <Paragraph className="category-card-description">
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
              <Paragraph>
                Tell us about your{" "}
                {categories
                  .find((c) => c.value === selectedCategory)
                  ?.label.toLowerCase()}
              </Paragraph>
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
                {
                  max: 500,
                  message: "Description should not exceed 500 characters",
                },
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
                {
                  required: true,
                  message: "Please provide a detailed description",
                },
                {
                  min: 50,
                  message: "Description should be at least 50 characters",
                },
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
              rules={[
                { required: true, message: "Please select priority level" },
              ]}
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
          return <FoodDetailsForm form={form} />;
        } else if (selectedCategory === "clothes") {
          return <ClothesDetailsForm form={form} />;
        } else if (selectedCategory === "education") {
          return (
            <EducationDetailsForm
              form={form}
              onEnhancedFieldsChange={handleEnhancedFieldsChange}
            />
          );
        }
        return null;

      case 3:
      case 4:
        if (selectedCategory === "education" && currentStep === 4) {
          // Contact & Media for education (step 4)
        } else if (
          (selectedCategory === "food" || selectedCategory === "clothes") &&
          currentStep === 3
        ) {
          // Contact & Media for food and clothes (step 3)
        } else {
          return null;
        }
        return (
          <div className="modern-form-step">
            <div className="step-header">
              <CameraOutlined
                style={{
                  fontSize: "32px",
                  color: "#52c41a",
                  marginBottom: "16px",
                  display: "block",
                }}
              />
              <Title level={3}>Contact & Media</Title>
              <Text type="secondary">
                Add contact information and images to showcase your cause
              </Text>
            </div>

            <div className="form-section">
              <Title level={4}>Images</Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: "16px" }}
              >
                Upload images that showcase your cause. The first image will be
                used as the main photo.
              </Text>

              <Dragger {...uploadProps} className="modern-upload">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  {uploading
                    ? "Uploading..."
                    : "Click or drag images to upload"}
                </p>
                <p className="ant-upload-hint">
                  Support JPG, PNG, WebP. Max file size 5MB each. Up to 5
                  images.
                </p>
              </Dragger>

              {allImages.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <Text strong>Images ({allImages.length}/5):</Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginTop: "8px",
                    }}
                  >
                    {allImages.map((image, index) => {
                      const isUploading = !uploadedImages.find(
                        (img) => img.fileId === image.fileId,
                      );
                      return (
                        <div
                          key={image.fileId}
                          style={{ position: "relative" }}
                        >
                          <div style={{ position: "relative" }}>
                            <img
                              src={image.thumbnailUrl || image.url}
                              alt={image.name}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border:
                                  index === 0
                                    ? "2px solid #52c41a"
                                    : "1px solid #d9d9d9",
                                opacity: isUploading ? 0.6 : 1,
                              }}
                            />
                            {isUploading && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "rgba(0,0,0,0.3)",
                                  borderRadius: "8px",
                                  color: "white",
                                  fontSize: "12px",
                                }}
                              >
                                Uploading...
                              </div>
                            )}
                          </div>
                          {index === 0 && (
                            <Tag
                              color="green"
                              style={{
                                position: "absolute",
                                top: "-8px",
                                left: "-8px",
                                fontSize: "12px",
                              }}
                            >
                              Main
                            </Tag>
                          )}
                          <Button
                            size="small"
                            danger
                            style={{
                              position: "absolute",
                              top: "-8px",
                              right: "-8px",
                            }}
                            onClick={() => removeImage(image.fileId)}
                            disabled={isUploading}
                          >
                            ×
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="form-section">
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
                    <Input
                      size="large"
                      prefix={<PhoneOutlined />}
                      placeholder="+1 (555) 123-4567"
                    />
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

              <Form.Item
                name="specialInstructions"
                label="Special Instructions"
              >
                <TextArea
                  rows={3}
                  placeholder="Any special instructions for coordination, pickup, delivery, etc."
                />
              </Form.Item>
            </div>

            <div className="form-section">
              <Title level={4}>Tags & Keywords</Title>
              <Form.Item
                name="tags"
                label="Tags"
                help="Add relevant tags to help people find your cause"
              >
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Enter tags (press Enter to add)"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
          </div>
        );

      case 4:
      case 5:
        // Review step - adjust case number based on category
        const isReviewStep =
          (selectedCategory === "education" && currentStep === 5) ||
          ((selectedCategory === "food" || selectedCategory === "clothes") &&
            currentStep === 4);

        if (!isReviewStep) return null;

        return (
          <div className="modern-form-step">
            <div className="step-header">
              <CheckCircleOutlined className="step-icon" />
              <Title level={3}>Review Your Cause</Title>
              <Paragraph>
                Please review all information before publishing
              </Paragraph>
            </div>

            <Card title="Basic Information" className="review-card">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Category:</Text>
                  <div>
                    {
                      categories.find((c) => c.value === selectedCategory)
                        ?.label
                    }
                  </div>
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
                    <div>
                      {formData.quantity} {formData.unit}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Temperature:</Text>
                    <div className="capitalize">
                      {formData.temperatureRequirements}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Dietary Restrictions:</Text>
                    <div>
                      {formData.dietaryRestrictions?.join(", ") || "None"}
                    </div>
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
                    <div>
                      {formData.durationHours} hours over{" "}
                      {formData.numberOfDays} days
                    </div>
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
      <div className="modern-cause-create-page">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "40px" }}
          >
            <Title level={1} style={{ marginBottom: "16px" }}>
              Create a New Cause
            </Title>
            <Paragraph
              style={{
                fontSize: "16px",
                color: "#666",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Share your passion and create positive change in your community.
              Every great movement starts with a single step.
            </Paragraph>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Simplified Progress Header */}
            <Card
              style={{
                marginBottom: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                padding: "16px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <Title level={4} style={{ margin: 0, color: "#52c41a" }}>
                    {steps[currentStep]?.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    {steps[currentStep]?.description}
                  </Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text strong style={{ fontSize: "16px", color: "#52c41a" }}>
                    {currentStep + 1} / {steps.length}
                  </Text>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                    Complete
                  </div>
                </div>
              </div>
              <Progress
                percent={((currentStep + 1) / steps.length) * 100}
                showInfo={false}
                strokeColor={{
                  "0%": "#52c41a",
                  "100%": "#389e0d",
                }}
                trailColor="#f0f0f0"
                strokeWidth={8}
                style={{ marginBottom: "8px" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#999",
                }}
              >
                {steps.map((step, index) => (
                  <span
                    key={index}
                    style={{
                      color: index <= currentStep ? "#52c41a" : "#d9d9d9",
                      fontWeight: index === currentStep ? "bold" : "normal",
                    }}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </Card>

            {/* Form Content */}
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Form
                form={form}
                layout="vertical"
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
                        onClick={handleSubmit}
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
      </div>
    </MainLayout>
  );
}
