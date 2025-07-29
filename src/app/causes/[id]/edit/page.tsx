"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Typography,
  Row,
  Col,
  Steps,
  message,
  Divider,
  Progress,
  Alert,
  Spin,
} from "antd";
import {
  InfoCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  BookOutlined,
  FileTextOutlined,
  RightOutlined,
  LeftOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import dayjs from "dayjs";
import { MainLayout } from "@/components/layout/MainLayout";
import FoodDetailsForm from "@/components/forms/FoodDetailsForm";
import ClothesDetailsForm from "@/components/forms/ClothesDetailsForm";
import EducationDetailsForm from "@/components/forms/EducationDetailsForm";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CauseData {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  category_name: string;
  priority: string;
  location: string;
  expires_at?: string;
  gallery?: string[];
  user_id: number;
  creator_id?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CategoryDetails {
  // Food details
  food_type?: string;
  quantity?: number;
  dietary_restrictions?: string[];
  storage_requirements?: string;
  pickup_instructions?: string;

  // Clothes details
  clothes_type?: string;
  size_range?: string[];
  age_group?: string;
  season?: string;
  condition?: string;

  // Education details - basic fields
  education_type?: string;
  skill_level?: string;
  topics?: string[];
  max_trainees?: number;
  duration_hours?: number;
  number_of_days?: number;
  prerequisites?: string;
  learning_objectives?: string[];
  start_date?: string;
  end_date?: string;
  registration_deadline?: string;
  delivery_method?: string;
  location_details?: string;
  meeting_platform?: string;
  meeting_link?: string;
  meeting_id?: string;
  meeting_password?: string;
  instructor_name?: string;
  instructor_email?: string;
  instructor_bio?: string;
  instructor_qualifications?: string;
  certification?: boolean;
  certification_body?: string;
  materials_provided?: string[];
  equipment_required?: string[];
  software_required?: string[];
  price?: number;
  is_free?: boolean;
  course_language?: string;
  subtitles_available?: string[];
  difficulty_rating?: number;

  // Enhanced education fields
  course_modules?: any[];
  instructors?: any[];
  enhanced_prerequisites?: any[];
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
    icon: <HeartOutlined style={{ fontSize: "48px" }} />,
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

const priorityLevels = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "critical", label: "Critical" },
];

export default function EditCausePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [form] = Form.useForm();

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [causeData, setCauseData] = useState<CauseData | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<CategoryDetails>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [stepFormValues, setStepFormValues] = useState<any>({});

  // Enhanced education fields state
  const [enhancedEducationFields, setEnhancedEducationFields] = useState({
    courseModules: [],
    instructors: [],
    enhancedPrerequisites: [],
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
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
      const details = result.data.categoryDetails || {};

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
      setCategoryDetails(details);
      setSelectedCategory(cause.category_name);
      setImageUrls(cause.gallery || []);

      // Populate form with existing data
      const formValues = {
        title: cause.title,
        shortDescription: cause.short_description,
        description: cause.description,
        category: cause.category_name,
        priority: cause.priority,
        location: cause.location,
        deadline: cause.expires_at ? dayjs(cause.expires_at) : undefined,
        ...details,
      };

      // Handle education-specific date fields
      if (cause.category_name === "education" && details) {
        if (details.start_date) {
          formValues.startDate = dayjs(details.start_date);
        }
        if (details.end_date) {
          formValues.endDate = dayjs(details.end_date);
        }
        if (details.registration_deadline) {
          formValues.registrationDeadline = dayjs(
            details.registration_deadline,
          );
        }

        // Handle enhanced education fields
        setEnhancedEducationFields({
          courseModules: details.course_modules || [],
          instructors: details.instructors || [],
          enhancedPrerequisites: details.enhanced_prerequisites || [],
        });
      }

      form.setFieldsValue(formValues);
      setStepFormValues(formValues); // Store initial values for step navigation
    } catch (error) {
      console.error("Error fetching cause:", error);
      message.error("Failed to load cause details");
      router.push("/causes");
    } finally {
      setLoading(false);
    }
  };

  const getStepsForCategory = () => {
    const baseSteps = [
      {
        title: "Basic Info",
        description: "Update basic information",
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
          title: "Contact & Location",
          description: "Contact info and location",
          icon: <EnvironmentOutlined />,
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
          title: "Contact & Location",
          description: "Contact info and location",
          icon: <EnvironmentOutlined />,
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
          title: "Contact & Location",
          description: "Contact info and location",
          icon: <EnvironmentOutlined />,
        },
      ];
    }

    return baseSteps;
  };

  const steps = getStepsForCategory();

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfoStep();
      case 1:
        if (selectedCategory === "food") {
          return <FoodDetailsForm form={form} />;
        } else if (selectedCategory === "clothes") {
          return <ClothesDetailsForm form={form} />;
        } else if (selectedCategory === "education") {
          return (
            <EducationDetailsForm
              form={form}
              onEnhancedFieldsChange={setEnhancedEducationFields}
            />
          );
        }
        break;
      case 2:
        if (selectedCategory === "education") {
          return renderEducationScheduleStep();
        } else {
          return renderContactLocationStep();
        }
      case 3:
        if (selectedCategory === "education") {
          return renderContactLocationStep();
        }
        break;
      default:
        return renderBasicInfoStep();
    }
  };

  const renderBasicInfoStep = () => {
    return (
      <div className="modern-form-step">
        <div className="step-header">
          <InfoCircleOutlined className="step-icon" />
          <Title level={3}>Basic Information</Title>
          <Paragraph>
            Update the basic information about your{" "}
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
            placeholder="Provide comprehensive details about your cause..."
            showCount
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                size="large"
                disabled
                placeholder="Category (cannot be changed)"
              >
                {categories.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="priority"
              label="Priority Level"
              rules={[{ required: true, message: "Please select priority" }]}
            >
              <Select size="large" placeholder="Select priority level">
                {priorityLevels.map((level) => (
                  <Option key={level.value} value={level.value}>
                    {level.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="deadline" label="Deadline (Optional)">
          <DatePicker style={{ width: "100%" }} size="large" />
        </Form.Item>
      </div>
    );
  };

  const renderEducationScheduleStep = () => {
    return (
      <div className="modern-form-step">
        <div className="step-header">
          <CalendarOutlined className="step-icon" />
          <Title level={3}>Schedule & Delivery</Title>
          <Paragraph>
            Set up the schedule and delivery method for your course
          </Paragraph>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: "Please select end date" }]}
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="registrationDeadline"
              label="Registration Deadline"
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="delivery_method"
              label="Delivery Method"
              rules={[
                { required: true, message: "Please select delivery method" },
              ]}
            >
              <Select placeholder="Select delivery method" size="large">
                <Option value="online">Online</Option>
                <Option value="in-person">In-Person</Option>
                <Option value="hybrid">Hybrid</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="meeting_platform"
              label="Meeting Platform (if online)"
            >
              <Select placeholder="Select platform" size="large">
                <Option value="zoom">Zoom</Option>
                <Option value="teams">Microsoft Teams</Option>
                <Option value="meet">Google Meet</Option>
                <Option value="webex">Cisco Webex</Option>
                <Option value="skype">Skype</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="meeting_link" label="Meeting Link (Optional)">
              <Input placeholder="https://..." size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="price" label="Price ($)">
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_free" label="Free Course">
              <Select placeholder="Is this course free?" size="large">
                <Option value={true}>Yes, Free</Option>
                <Option value={false}>No, Paid</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  };

  const renderContactLocationStep = () => {
    return (
      <div className="modern-form-step">
        <div className="step-header">
          <EnvironmentOutlined className="step-icon" />
          <Title level={3}>Contact & Location</Title>
          <Paragraph>Provide location and contact information</Paragraph>
        </div>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input size="large" placeholder="City, State/Province, Country" />
        </Form.Item>

        {selectedCategory === "education" && (
          <Form.Item
            name="location_details"
            label="Detailed Location Information"
          >
            <TextArea
              rows={3}
              placeholder="Provide complete address and any special instructions"
            />
          </Form.Item>
        )}
      </div>
    );
  };

  const handleNext = async () => {
    try {
      const fieldsToValidate = getFieldsToValidate(currentStep);
      if (fieldsToValidate.length > 0) {
        await form.validateFields(fieldsToValidate);
      }
      
      // Store current step values
      const currentStepValues = form.getFieldsValue();
      setStepFormValues((prev: any) => ({
        ...prev,
        ...currentStepValues
      }));
      
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePrevious = () => {
    // Store current step values before going back
    const currentStepValues = form.getFieldsValue();
    setStepFormValues((prev: any) => ({
      ...prev,
      ...currentStepValues
    }));
    
    setCurrentStep(currentStep - 1);
  };

  const getFieldsToValidate = (step: number) => {
    if (selectedCategory === "education") {
      switch (step) {
        case 0: // Basic Info
          return [
            "title",
            "shortDescription",
            "description",
            "category",
            "priority",
          ];
        case 1: // Education Details
          return [
            "educationType",
            "skillLevel",
            "topics",
            "maxTrainees",
            "durationHours",
            "numberOfDays",
            "instructorName",
            "instructorEmail",
          ];
        case 2: // Schedule & Delivery
          return ["startDate", "endDate", "delivery_method"];
        case 3: // Contact & Location
          return ["location"];
        default:
          return [];
      }
    } else {
      switch (step) {
        case 0: // Basic Info
          return [
            "title",
            "shortDescription",
            "description",
            "category",
            "priority",
          ];
        case 2: // Contact & Location
          return ["location"];
        default:
          return [];
      }
    }
  };

  const getCategorySpecificData = (values: any) => {
    switch (selectedCategory) {
      case "food":
        return {
          food_type: values.foodType ?? "meals",
          quantity: values.quantity ?? 1,
          dietary_restrictions: values.dietaryRestrictions ?? [],
          storage_requirements: values.storageRequirements ?? "",
          pickup_instructions: values.pickupInstructions ?? "",
        };
      case "clothes":
        return {
          clothes_type: values.clothesType ?? "shirts",
          size_range: values.sizeRange ?? [],
          age_group: values.ageGroup ?? "adult",
          season: values.season ?? "all-season",
          condition: values.condition ?? "good",
        };
      case "education":
        return {
          education_type: values.educationType ?? "course",
          skill_level: values.skillLevel ?? "all-levels",
          topics: values.topics ?? [],
          max_trainees: values.maxTrainees ?? 20,
          current_trainees: values.currentTrainees ?? 0,
          duration_hours: values.durationHours ?? 1,
          number_of_days: values.numberOfDays ?? 1,
          prerequisites: values.prerequisites ?? "",
          learning_objectives: values.learningObjectives ?? [],
          start_date: values.startDate
            ? values.startDate.format("YYYY-MM-DD")
            : null,
          end_date: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
          registration_deadline: values.registrationDeadline
            ? values.registrationDeadline.format("YYYY-MM-DD")
            : null,
          schedule: values.schedule ?? [],
          delivery_method: values.delivery_method ?? "in-person",
          location_details: values.location_details ?? "",
          meeting_platform: values.meeting_platform ?? null,
          meeting_link: values.meeting_link ?? null,
          meeting_id: values.meeting_id ?? null,
          meeting_password: values.meeting_password ?? null,
          instructor_name: values.instructorName ?? "",
          instructor_email: values.instructorEmail ?? "",
          instructor_bio: values.instructorBio ?? "",
          instructor_qualifications: values.instructorQualifications ?? "",
          instructor_rating: values.instructorRating ?? 0,
          certification: values.certification ?? false,
          certification_body: values.certificationBody ?? null,
          materials_provided: values.materialsProvided ?? [],
          equipment_required: values.equipmentRequired ?? [],
          software_required: values.softwareRequired ?? [],
          price: values.price ?? 0,
          is_free: values.is_free ?? true,
          course_language: values.courseLanguage ?? "English",
          subtitles_available: values.subtitlesAvailable ?? [],
          difficulty_rating: values.difficultyRating ?? 1,
          course_modules: enhancedEducationFields.courseModules,
          instructors: enhancedEducationFields.instructors,
          enhanced_prerequisites: enhancedEducationFields.enhancedPrerequisites,
        };
      default:
        return {};
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      // Store final step values
      const currentStepValues = form.getFieldsValue();
      const allFormValues = {
        ...stepFormValues,
        ...currentStepValues
      };

      console.log("Submit function combined values:", allFormValues); // Debug log
      console.log("Step values stored:", stepFormValues); // Debug log
      console.log("Current step values:", currentStepValues); // Debug log
      console.log("Current selectedCategory:", selectedCategory); // Debug log

      const updateData = {
        title: allFormValues.title,
        description: allFormValues.description,
        detailedDescription: allFormValues.shortDescription,
        category: selectedCategory,
        urgencyLevel: allFormValues.priority,
        location: allFormValues.location,
        deadline: allFormValues.deadline
          ? allFormValues.deadline.format("YYYY-MM-DD")
          : null,
        gallery: imageUrls,
        categoryDetails: getCategorySpecificData(allFormValues),
      };

      console.log("Final payload being sent:", updateData);

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
        message.error(result.error || "Failed to update cause");
      }
    } catch (error) {
      console.error("Error updating cause:", error);
      message.error("Failed to update cause");
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <MainLayout>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>Loading cause details...</div>
        </div>
      </MainLayout>
    );
  }

  if (!causeData) {
    return (
      <MainLayout>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <Alert
            message="Cause not found"
            description="The cause you're trying to edit doesn't exist or you don't have permission to edit it."
            type="error"
            showIcon
          />
          <Button
            type="primary"
            onClick={() => router.push("/causes")}
            style={{ marginTop: "16px" }}
          >
            Back to Causes
          </Button>
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
              Edit Cause
            </Title>
            <Paragraph
              style={{
                fontSize: "16px",
                color: "#666",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Update your cause details and make necessary changes.
            </Paragraph>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Progress Bar */}
            <div style={{ marginBottom: "24px" }}>
              <Progress
                percent={((currentStep + 1) / steps.length) * 100}
                showInfo={false}
                strokeColor={{
                  "0%": "#87d068",
                  "100%": "#52c41a",
                }}
              />
            </div>

            {/* Steps */}
            <Card className="steps-card">
              <Steps current={currentStep} className="custom-steps">
                {steps.map((step, index) => (
                  <Steps.Step
                    key={index}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                  />
                ))}
              </Steps>
            </Card>

            {/* Form */}
            <Form
              form={form}
              layout="vertical"
              className="modern-form"
              size="middle"
            >
              <Card className="form-card">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="step-content"
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                <Divider />

                {/* Navigation */}
                <div className="form-navigation">
                  <div className="nav-left">
                    {currentStep > 0 && (
                      <Button
                        size="large"
                        onClick={handlePrevious}
                        icon={<LeftOutlined />}
                      >
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="nav-right">
                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleNext}
                        icon={<RightOutlined />}
                        iconPosition="end"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleSubmit}
                        loading={saving}
                        icon={<SaveOutlined />}
                      >
                        Update Cause
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </Form>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
