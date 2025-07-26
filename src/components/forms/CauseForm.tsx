"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Typography,
  Card,
  Steps,
  Divider,
  Alert,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
  EnvironmentOutlined,
  ContactsOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { FoodCauseForm } from "./FoodCauseForm";
import { ClothingCauseForm } from "./ClothingCauseForm";
import { EducationCauseForm } from "./EducationCauseForm";
import type {
  Cause,
  FoodDetails,
  ClothesDetails,
  EducationDetails,
} from "@/types";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CauseFormProps {
  initialValues?: Partial<Cause>;
  onSubmit: (values: Cause) => void;
  loading?: boolean;
  mode?: "create" | "edit";
}

const categories = [
  {
    id: "food",
    name: "Food Assistance",
    description: "Share meals and food supplies with those in need",
    icon: "🍽️",
    color: "#FF6B35",
  },
  {
    id: "clothes",
    name: "Clothing Donation",
    description: "Donate and request clothing items for all ages",
    icon: "👕",
    color: "#4ECDC4",
  },
  {
    id: "education",
    name: "Education & Training",
    description: "Share knowledge through courses, workshops, and mentoring",
    icon: "🎓",
    color: "#45B7D1",
  },
];

const priorityLevels = [
  {
    value: "low",
    label: "Low Priority",
    color: "#52c41a",
    description: "Not urgent, can wait",
  },
  {
    value: "medium",
    label: "Medium Priority",
    color: "#1890ff",
    description: "Moderately important",
  },
  {
    value: "high",
    label: "High Priority",
    color: "#faad14",
    description: "Important, needs attention",
  },
  {
    value: "urgent",
    label: "Urgent",
    color: "#ff4d4f",
    description: "Requires immediate action",
  },
];

export function CauseForm({
  initialValues,
  onSubmit,
  loading = false,
  mode = "create",
}: CauseFormProps) {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [basicInfo, setBasicInfo] = useState<any>({});

  useEffect(() => {
    if (initialValues) {
      setSelectedCategory(initialValues.category_id?.toString() || "");
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const steps = [
    {
      title: "Basic Information",
      description: "Tell us about your cause",
      icon: <InfoCircleOutlined />,
    },
    {
      title: "Category Details",
      description: "Specific details for your category",
      icon: <ContactsOutlined />,
    },
    {
      title: "Location & Contact",
      description: "Where and how to reach you",
      icon: <EnvironmentOutlined />,
    },
  ];

  const handleBasicInfoSubmit = async (values: any) => {
    setBasicInfo(values);
    setSelectedCategory(values.category_id);
    setCurrentStep(1);
  };

  const handleCategoryDetailsSubmit = async (
    categoryDetails: FoodDetails | ClothesDetails | EducationDetails,
  ) => {
    const completeData = {
      ...basicInfo,
      category_details: categoryDetails,
    };
    setCurrentStep(2);

    // For now, we'll proceed to the final step
    // In a real implementation, you might want to collect additional info
    await onSubmit(completeData as Cause);
  };

  const renderCategoryForm = () => {
    const category = categories.find((cat) => cat.id === selectedCategory);
    if (!category) return null;

    const commonProps = {
      onSubmit: handleCategoryDetailsSubmit,
      loading,
      initialValues: initialValues?.category_details,
    };

    switch (selectedCategory) {
      case "food":
        return <FoodCauseForm {...commonProps} />;
      case "clothes":
        return <ClothingCauseForm {...commonProps} />;
      case "education":
        return <EducationCauseForm {...commonProps} />;
      default:
        return null;
    }
  };

  const stepContent = [
    // Step 0: Basic Information
    <motion.div
      key="basic-info"
      className="animate-fade-in"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg border-0">
        <div className="mb-8">
          <Title level={2}>Basic Cause Information</Title>
          <Paragraph className="text-gray-600 text-lg">
            Let's start with the essential details about your cause.
          </Paragraph>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleBasicInfoSubmit}
          initialValues={initialValues}
          className="space-y-6"
        >
          {/* Category Selection */}
          <Form.Item
            name="category_id"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                  onClick={() => {
                    form.setFieldsValue({ category_id: category.id });
                    setSelectedCategory(category.id);
                  }}
                >
                  <Card
                    className={`text-center transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "border-2 border-blue-500 shadow-lg"
                        : "border border-gray-200 hover:border-blue-300"
                    }`}
                    style={{
                      backgroundColor:
                        selectedCategory === category.id
                          ? `${category.color}15`
                          : "white",
                    }}
                  >
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <Title level={4} className="mb-2">
                      {category.name}
                    </Title>
                    <Text className="text-gray-600">
                      {category.description}
                    </Text>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Form.Item>

          {/* Title */}
          <Form.Item
            name="title"
            label="Cause Title"
            rules={[
              { required: true, message: "Please enter a title" },
              { min: 10, message: "Title should be at least 10 characters" },
              { max: 100, message: "Title should not exceed 100 characters" },
            ]}
          >
            <Input
              size="large"
              placeholder="Give your cause a clear, descriptive title"
              showCount
              maxLength={100}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item
            name="description"
            label="Detailed Description"
            rules={[
              { required: true, message: "Please enter a description" },
              {
                min: 50,
                message: "Description should be at least 50 characters",
              },
              {
                max: 2000,
                message: "Description should not exceed 2000 characters",
              },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Provide a detailed description of your cause, what you're offering or need, and why it matters"
              showCount
              maxLength={2000}
              className="resize-none"
            />
          </Form.Item>

          {/* Short Description */}
          <Form.Item
            name="short_description"
            label="Short Summary (Optional)"
            rules={[
              { max: 200, message: "Summary should not exceed 200 characters" },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="A brief summary that will appear in search results and previews"
              showCount
              maxLength={200}
              className="resize-none"
            />
          </Form.Item>

          {/* Priority Level */}
          <Form.Item
            name="priority"
            label="Priority Level"
            rules={[
              { required: true, message: "Please select priority level" },
            ]}
          >
            <Select size="large" placeholder="How urgent is this cause?">
              {priorityLevels.map((priority) => (
                <Option key={priority.value} value={priority.value}>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: priority.color }}
                    />
                    <div>
                      <div className="font-medium">{priority.label}</div>
                      <div className="text-sm text-gray-500">
                        {priority.description}
                      </div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Tags */}
          <Form.Item name="tags" label="Tags (Optional)">
            <Select
              mode="tags"
              size="large"
              placeholder="Add relevant tags to help people find your cause"
              className="w-full"
              maxTagCount="responsive"
            />
          </Form.Item>

          <Form.Item className="text-center pt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:shadow-lg transition-all duration-300 px-8"
            >
              Continue to Category Details
              <ArrowRightOutlined />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>,

    // Step 1: Category Details
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => setCurrentStep(0)}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Basic Information
        </Button>
      </div>
      {renderCategoryForm()}
    </motion.div>,

    // Step 2: Success/Confirmation (simplified for this implementation)
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <div className="text-6xl mb-6">🎉</div>
      <Title level={2} className="text-green-600 mb-4">
        {mode === "create"
          ? "Cause Created Successfully!"
          : "Cause Updated Successfully!"}
      </Title>
      <Paragraph className="text-lg text-gray-600 mb-8">
        Your cause has been {mode === "create" ? "created" : "updated"} and will
        be reviewed before being published.
      </Paragraph>
      <Space>
        <Button
          size="large"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Go to Dashboard
        </Button>
        <Button
          type="primary"
          size="large"
          className="bg-gradient-to-r from-blue-600 to-purple-600 border-none"
          onClick={() => (window.location.href = "/causes")}
        >
          View All Causes
        </Button>
      </Space>
    </motion.div>,
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <Steps current={currentStep} items={steps} className="mb-8" />
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">{stepContent[currentStep]}</AnimatePresence>

      {/* Helper Information */}
      {currentStep === 0 && (
        <div className="mt-8">
          <Alert
            message="Getting Started"
            description="Choose the category that best matches what you're offering or need. Each category has specific fields to help you provide the most relevant information."
            type="info"
            showIcon
            className="mb-4"
          />
        </div>
      )}
    </div>
  );
}
