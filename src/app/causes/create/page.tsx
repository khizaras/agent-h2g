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

interface CauseFormData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  subcategory: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  goalAmount: number;
  currency: string;
  deadline?: string;
  images: any[];
  tags: string[];
  volunteersNeeded: number;
  skillsNeeded: string[];
  urgencyLevel: "low" | "medium" | "high" | "critical";
  causeType: "fundraising" | "volunteer" | "awareness" | "mixed";
  isRecurring: boolean;
  recurringFrequency?: "weekly" | "monthly" | "quarterly";
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  terms: boolean;
  updates: boolean;
  publicProfile: boolean;
}

const categories = [
  { value: "emergency-relief", label: "Emergency Relief", subcategories: ["Natural Disasters", "Medical Emergencies", "Crisis Response"] },
  { value: "food-security", label: "Food Security", subcategories: ["Food Banks", "Community Gardens", "Nutrition Programs", "School Meals"] },
  { value: "education", label: "Education", subcategories: ["School Supplies", "Scholarships", "Literacy Programs", "Digital Access"] },
  { value: "healthcare", label: "Healthcare", subcategories: ["Medical Equipment", "Mental Health", "Wellness Programs", "Healthcare Access"] },
  { value: "environment", label: "Environment", subcategories: ["Clean Energy", "Conservation", "Sustainability", "Climate Action"] },
  { value: "community", label: "Community Development", subcategories: ["Infrastructure", "Housing", "Public Spaces", "Transportation"] },
];

const skillsOptions = [
  "Web Development", "Graphic Design", "Marketing", "Photography", "Writing",
  "Event Planning", "Legal Advice", "Financial Planning", "Social Media",
  "Translation", "Teaching", "Carpentry", "Plumbing", "Electrical Work"
];

export default function CreateCausePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CauseFormData>>({});
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, status, router]);

  const steps = [
    {
      title: "Basic Info",
      description: "Tell us about your cause",
      icon: <InfoCircleOutlined />,
    },
    {
      title: "Details",
      description: "Category and description", 
      icon: <FileTextOutlined />,
    },
    {
      title: "Goals & Timeline",
      description: "Set your targets",
      icon: <DollarOutlined />,
    },
    {
      title: "Media & Contact",
      description: "Images and contact info",
      icon: <CameraOutlined />,
    },
    {
      title: "Review",
      description: "Final review",
      icon: <CheckCircleOutlined />,
    },
  ];

  const nextStep = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: CauseFormData) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success("Your cause has been created successfully!");
      router.push("/profile");
    } catch (error) {
      message.error("Failed to create cause. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addCustomTag = () => {
    if (newTag && !customTags.includes(newTag)) {
      setCustomTags([...customTags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCustomTags(customTags.filter(tag => tag !== tagToRemove));
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
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <HeartOutlined className="text-4xl text-blue-600 mb-4" />
              <Title level={3}>Let's start with the basics</Title>
              <Paragraph type="secondary">
                Tell us about your cause and what you're trying to achieve
              </Paragraph>
            </div>

            <Form.Item
              name="title"
              label="Cause Title"
              rules={[
                { required: true, message: "Please enter a title for your cause" },
                { min: 10, message: "Title should be at least 10 characters" },
                { max: 100, message: "Title should not exceed 100 characters" },
              ]}
            >
              <Input
                size="large"
                placeholder="e.g., Emergency Food Relief for Hurricane Victims"
                showCount
                maxLength={100}
              />
            </Form.Item>

            <Form.Item
              name="shortDescription"
              label="Short Description"
              rules={[
                { required: true, message: "Please enter a short description" },
                { min: 20, message: "Description should be at least 20 characters" },
                { max: 200, message: "Description should not exceed 200 characters" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="A brief summary of your cause that will appear in listings"
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item
              name="causeType"
              label="What type of support do you need?"
              rules={[{ required: true, message: "Please select a cause type" }]}
            >
              <Radio.Group size="large" className="w-full">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Radio.Button value="fundraising" className="w-full h-auto p-4 text-center">
                      <div>
                        <DollarOutlined className="text-2xl text-green-600 mb-2" />
                        <div className="font-medium">Fundraising</div>
                        <div className="text-sm text-gray-500">Raise money for your cause</div>
                      </div>
                    </Radio.Button>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Radio.Button value="volunteer" className="w-full h-auto p-4 text-center">
                      <div>
                        <TeamOutlined className="text-2xl text-blue-600 mb-2" />
                        <div className="font-medium">Volunteers</div>
                        <div className="text-sm text-gray-500">Need people to help</div>
                      </div>
                    </Radio.Button>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Radio.Button value="awareness" className="w-full h-auto p-4 text-center">
                      <div>
                        <BookOutlined className="text-2xl text-purple-600 mb-2" />
                        <div className="font-medium">Awareness</div>
                        <div className="text-sm text-gray-500">Spread the word</div>
                      </div>
                    </Radio.Button>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Radio.Button value="mixed" className="w-full h-auto p-4 text-center">
                      <div>
                        <HeartOutlined className="text-2xl text-red-600 mb-2" />
                        <div className="font-medium">Mixed</div>
                        <div className="text-sm text-gray-500">All of the above</div>
                      </div>
                    </Radio.Button>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please enter the location" }]}
            >
              <Input
                size="large"
                prefix={<EnvironmentOutlined />}
                placeholder="City, State or Region"
              />
            </Form.Item>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileTextOutlined className="text-4xl text-blue-600 mb-4" />
              <Title level={3}>Category and Details</Title>
              <Paragraph type="secondary">
                Help people find your cause and understand what you're doing
              </Paragraph>
            </div>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: "Please select a category" }]}
                >
                  <Select
                    size="large"
                    placeholder="Select a category"
                    onChange={setSelectedCategory}
                  >
                    {categories.map(cat => (
                      <Option key={cat.value} value={cat.value}>
                        {cat.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="subcategory"
                  label="Subcategory"
                  rules={[{ required: true, message: "Please select a subcategory" }]}
                >
                  <Select
                    size="large"
                    placeholder="Select a subcategory"
                    disabled={!selectedCategory}
                  >
                    {selectedCategory &&
                      categories
                        .find(cat => cat.value === selectedCategory)
                        ?.subcategories.map(sub => (
                          <Option key={sub} value={sub}>
                            {sub}
                          </Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Detailed Description"
              rules={[
                { required: true, message: "Please provide a detailed description" },
                { min: 100, message: "Description should be at least 100 characters" },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Describe your cause in detail. What problem are you solving? How will donations/volunteers help? What impact do you expect to make?"
                showCount
                maxLength={2000}
              />
            </Form.Item>

            <Form.Item
              name="urgencyLevel"
              label="Urgency Level"
              rules={[{ required: true, message: "Please select urgency level" }]}
            >
              <Radio.Group size="large">
                <Radio.Button value="low" className="text-green-600">Low</Radio.Button>
                <Radio.Button value="medium" className="text-yellow-600">Medium</Radio.Button>
                <Radio.Button value="high" className="text-orange-600">High</Radio.Button>
                <Radio.Button value="critical" className="text-red-600">Critical</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <div>
              <Form.Item
                name="tags"
                label="Tags"
                help="Add tags to help people discover your cause"
              >
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select or add tags"
                  style={{ width: "100%" }}
                >
                  {["emergency", "food", "education", "health", "environment", "community", "children", "seniors", "families"].map(tag => (
                    <Option key={tag} value={tag}>#{tag}</Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="flex flex-wrap gap-2 mb-4">
                {customTags.map(tag => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => removeTag(tag)}
                    className="px-3 py-1"
                  >
                    #{tag}
                  </Tag>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onPressEnter={addCustomTag}
                />
                <Button onClick={addCustomTag} disabled={!newTag}>
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarOutlined className="text-4xl text-blue-600 mb-4" />
              <Title level={3}>Goals & Timeline</Title>
              <Paragraph type="secondary">
                Set your fundraising goals and timeline
              </Paragraph>
            </div>

            <Row gutter={16}>
              <Col xs={24} md={16}>
                <Form.Item
                  name="goalAmount"
                  label="Fundraising Goal"
                  rules={[
                    { required: true, message: "Please enter your goal amount" },
                    { type: "number", min: 100, message: "Goal must be at least $100" },
                  ]}
                >
                  <InputNumber
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="0"
                    prefix="$"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="currency"
                  label="Currency"
                  initialValue="USD"
                >
                  <Select size="large">
                    <Option value="USD">USD</Option>
                    <Option value="EUR">EUR</Option>
                    <Option value="GBP">GBP</Option>
                    <Option value="CAD">CAD</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="deadline"
              label="Campaign Deadline (Optional)"
              help="Set a deadline to create urgency. Leave blank for ongoing campaigns."
            >
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                disabledDate={(current) => current && current < dayjs().endOf('day')}
                placeholder="Select end date"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="volunteersNeeded"
                  label="Volunteers Needed"
                  initialValue={0}
                >
                  <InputNumber
                    size="large"
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Number of volunteers needed"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="skillsNeeded"
                  label="Skills Needed"
                >
                  <Select
                    mode="multiple"
                    size="large"
                    placeholder="Select skills needed"
                    style={{ width: "100%" }}
                  >
                    {skillsOptions.map(skill => (
                      <Option key={skill} value={skill}>{skill}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <InfoCircleOutlined className="text-blue-600 mt-1" />
                <div>
                  <Text strong className="text-blue-900">Goal Setting Tips</Text>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1">
                    <li>• Set realistic goals based on your network size</li>
                    <li>• Consider breaking large goals into milestones</li>
                    <li>• Research similar successful campaigns for reference</li>
                    <li>• Factor in platform fees (typically 2-3%)</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Form.Item name="isRecurring" valuePropName="checked">
              <Checkbox>This is a recurring cause (ongoing need)</Checkbox>
            </Form.Item>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CameraOutlined className="text-4xl text-blue-600 mb-4" />
              <Title level={3}>Media & Contact</Title>
              <Paragraph type="secondary">
                Add images and contact information
              </Paragraph>
            </div>

            <Form.Item
              name="images"
              label="Images"
              help="Upload compelling images that tell your story. First image will be the main cover photo."
            >
              <Dragger {...uploadProps} className="h-40">
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
            
            <Row gutter={16}>
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
                <Form.Item
                  name="contactPhone"
                  label="Contact Phone (Optional)"
                >
                  <Input size="large" prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="website"
              label="Website (Optional)"
            >
              <Input
                size="large"
                prefix={<GlobalOutlined />}
                placeholder="https://yourorganization.com"
              />
            </Form.Item>

            <Title level={5}>Social Media (Optional)</Title>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name={['socialMedia', 'facebook']} label="Facebook">
                  <Input size="large" placeholder="Facebook page URL" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name={['socialMedia', 'twitter']} label="Twitter">
                  <Input size="large" placeholder="Twitter profile URL" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name={['socialMedia', 'instagram']} label="Instagram">
                  <Input size="large" placeholder="Instagram profile URL" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircleOutlined className="text-4xl text-green-600 mb-4" />
              <Title level={3}>Review Your Cause</Title>
              <Paragraph type="secondary">
                Please review all information before publishing
              </Paragraph>
            </div>

            <Card title="Basic Information">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Title:</Text>
                  <div>{formData.title}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Type:</Text>
                  <div className="capitalize">{formData.causeType}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Category:</Text>
                  <div>{categories.find(c => c.value === formData.category)?.label}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Location:</Text>
                  <div>{formData.location}</div>
                </Col>
                <Col span={24}>
                  <Text strong>Short Description:</Text>
                  <div>{formData.shortDescription}</div>
                </Col>
              </Row>
            </Card>

            <Card title="Goals & Timeline">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Fundraising Goal:</Text>
                  <div>${formData.goalAmount?.toLocaleString()}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Volunteers Needed:</Text>
                  <div>{formData.volunteersNeeded || "None specified"}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Urgency:</Text>
                  <div className="capitalize">{formData.urgencyLevel}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Deadline:</Text>
                  <div>{formData.deadline || "No deadline set"}</div>
                </Col>
              </Row>
            </Card>

            <Card title="Legal & Preferences">
              <div className="space-y-4">
                <Form.Item
                  name="terms"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(new Error("You must agree to the terms")),
                    },
                  ]}
                >
                  <Checkbox>
                    I agree to the{" "}
                    <a href="/terms" target="_blank" className="text-blue-600">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" className="text-blue-600">
                      Privacy Policy
                    </a>
                  </Checkbox>
                </Form.Item>

                <Form.Item name="updates" valuePropName="checked" initialValue={true}>
                  <Checkbox>
                    Send me updates about my cause and tips for success
                  </Checkbox>
                </Form.Item>

                <Form.Item name="publicProfile" valuePropName="checked" initialValue={true}>
                  <Checkbox>
                    Make my profile visible to supporters
                  </Checkbox>
                </Form.Item>
              </div>
            </Card>

            <Alert
              message="Review Complete"
              description="Once you publish your cause, it will be reviewed by our team and go live within 24 hours."
              type="info"
              showIcon
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <Text className="text-gray-600">Loading...</Text>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Title level={1} className="text-gray-900 mb-4">
                Create a New Cause
              </Title>
              <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
                Share your passion and create positive change in your community.
                Every great movement starts with a single step.
              </Paragraph>
            </div>

            {/* Progress Steps */}
            <Card className="mb-8 shadow-sm">
              <Steps
                current={currentStep}
                size="small"
                className="mb-6"
                items={steps.map((step, index) => ({
                  title: step.title,
                  description: step.description,
                  icon: step.icon,
                }))}
              />
              <Progress
                percent={((currentStep + 1) / steps.length) * 100}
                showInfo={false}
                strokeColor={{
                  "0%": "#3b82f6",
                  "100%": "#1d4ed8",
                }}
                className="mb-4"
              />
              <div className="text-center text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
            </Card>

            {/* Form Content */}
            <Card className="shadow-lg">
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
                <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                  <div>
                    {currentStep > 0 && (
                      <Button
                        size="large"
                        onClick={prevStep}
                        icon={<LeftOutlined />}
                        className="rounded-lg"
                      >
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      size="large"
                      onClick={() => router.push("/causes")}
                      className="rounded-lg"
                    >
                      Save as Draft
                    </Button>

                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="primary"
                        size="large"
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700 border-none rounded-lg"
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
                        className="bg-green-600 hover:bg-green-700 border-none rounded-lg"
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